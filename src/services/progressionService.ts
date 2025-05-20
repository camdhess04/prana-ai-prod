// src/services/progressionService.ts
// V1.5.1: Refined progression logic with Rep Ranges and RPE consideration

import workoutService from './workoutService';
import { WorkoutTemplate, WorkoutSession, PerformedSet, Exercise, SessionExercise } from '../types/workout';

// --- Helper Functions ---

// Parses rep range string like "8-10" or "5" into min/max
function parseRepRange(repsString?: string | null): { min: number | null; max: number | null } {
    if (!repsString) return { min: null, max: null };
    const rangeMatch = repsString.match(/^(\d+)\s*-\s*(\d+)$/); // Matches "8-10"
    const singleMatch = repsString.match(/^\d+$/); // Matches "5"

    if (rangeMatch) {
        const min = parseInt(rangeMatch[1], 10);
        const max = parseInt(rangeMatch[2], 10);
        return { min: isNaN(min) ? null : min, max: isNaN(max) ? null : max };
    } else if (singleMatch) {
        const num = parseInt(singleMatch[0], 10);
        return { min: isNaN(num) ? null : num, max: isNaN(num) ? null : num }; // Min and Max are the same
    }
    return { min: null, max: null }; // Couldn't parse
}

function parseLoggedReps(repsString?: string | null): number | null { /* unchanged */
    if (!repsString) return null; const num = parseInt(repsString, 10);
    return isNaN(num) ? null : num;
}
function parseWeight(weightString?: string | null): number | null { /* unchanged */
    if (!weightString || weightString.toLowerCase() === 'bodyweight' || weightString.trim() === '') return 0;
    const num = parseFloat(weightString.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num;
}
function formatWeight(weightNum: number | null | undefined): string | null { /* unchanged */
    if (weightNum === null || weightNum === undefined || weightNum <= 0) return null;
    const rounded = Math.round(weightNum / 2.5) * 2.5;
    if (rounded <= 0) return null; return `${rounded} lbs`;
}

// Helper to suggest next rep target
function suggestNextReps(currentRepsStr?: string | null): string | null {
    if (!currentRepsStr) return null;
    const { min, max } = parseRepRange(currentRepsStr);
    if (min !== null && max !== null && min !== max) {
        return `${min}-${max}`; // If range, suggest aiming for top of range again? Or just keep original string? Keep original for now.
        // return `Aim for ${max}`; // Alternative suggestion
    } else if (min !== null) {
        return `${min + 1}`; // If single target, suggest +1 rep
    }
    return currentRepsStr; // Fallback to original
}


// --- Main Suggestion Logic ---

export type SuggestionMap = { /* unchanged */
    [exerciseId: string]: { weight?: string | null; reps?: string | null; note?: string | null; }
};

const WEIGHT_INCREMENT_LBS = 5;

const calculateSuggestions = async (userId: string, template: WorkoutTemplate): Promise<SuggestionMap> => {
    console.log(`PROGRESSION_SERVICE V1.5.1: Calculating suggestions for template "${template.name}" (ID: ${template.id})`);
    const suggestions: SuggestionMap = {};

    if (!template?.id || !template.exercises?.length) return suggestions;

    try {
        // 1. Fetch & find last relevant session
        const allSessions = await workoutService.getSessionsByUserId(userId);
        const relevantSessions = allSessions
            .filter(s => s.templateId === template.id && s.exercises?.length > 0)
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

        if (relevantSessions.length === 0) {
            console.log(`PROGRESSION_SERVICE: No previous sessions for template ${template.id}.`);
            return suggestions;
        }
        const lastSession = relevantSessions[0];
        console.log(`PROGRESSION_SERVICE: Using last session from ${lastSession.completedAt}.`);

        const lastSessionExercisesMap = new Map<string, SessionExercise>();
        lastSession.exercises?.forEach(ex => { if (ex?.id) { lastSessionExercisesMap.set(ex.id, ex); } });

        // 2. Loop through exercises in the template for the upcoming session
        for (const currentExercise of template.exercises) {
            if (!currentExercise?.id) continue;

            const lastLoggedExercise = lastSessionExercisesMap.get(currentExercise.id);
            if (!lastLoggedExercise?.performedSets?.length) continue; // Skip if no data

            const { min: minTargetReps, max: maxTargetReps } = parseRepRange(currentExercise.reps);
            if (minTargetReps === null) continue; // Skip if target reps unparseable

            let allSetsMetMinTarget = true;
            let lastSetWeightNum: number | null = null;
            let lastSetRepsNum: number | null = null;
            let lastSetRpe: number | undefined = undefined; // Use RPE from the actual last set performed

            for (const performedSet of lastLoggedExercise.performedSets) {
                const loggedReps = parseLoggedReps(performedSet.reps);
                if (loggedReps === null || loggedReps < minTargetReps) {
                    allSetsMetTarget = false;
                    break; // If any set fails minimum, no progression this time
                }
                // Store data from the final set in the loop
                lastSetRepsNum = loggedReps;
                lastSetWeightNum = parseWeight(performedSet.weight);
                lastSetRpe = performedSet.rpe;
            }

            // --- Apply Refined Rules ---
            const lastSetRpeValid = typeof lastSetRpe === 'number' && lastSetRpe >= 0 && lastSetRpe <= 10;
            const lastSetEffortLow = lastSetRpeValid && lastSetRpe < 9; // Effort was likely not maximal
            const hitMaxReps = maxTargetReps !== null && lastSetRepsNum !== null && lastSetRepsNum >= maxTargetReps;

            if (allSetsMetMinTarget && lastSetWeightNum !== null) {
                // Condition 1: Hit MAX reps easily -> Increase Weight
                if (hitMaxReps && (lastSetEffortLow || !lastSetRpeValid)) { // Increase if max reps hit AND RPE was low/unknown
                    const suggestedWeightNum = lastSetWeightNum + WEIGHT_INCREMENT_LBS;
                    const suggestedWeightStr = formatWeight(suggestedWeightNum);
                    console.log(`PROGRESSION_SERVICE: [${currentExercise.name}] Cond 1 Met (Max Reps, Low/Unknown RPE). Suggesting ${suggestedWeightStr}`);
                    suggestions[currentExercise.id] = {
                        weight: suggestedWeightStr,
                        reps: currentExercise.reps, // Reset/keep original rep target
                        note: `Suggest: +${WEIGHT_INCREMENT_LBS}lbs (Hit ${lastSetRepsNum}/${maxTargetReps} reps @ RPE ${lastSetRpe ?? 'N/A'})`
                    };
                }
                // Condition 2: Hit MIN reps, but not max OR RPE was high -> Increase Reps (Keep Weight)
                else if (allSetsMetMinTarget) { // Removed RPE check here, focus on reps first if min met
                     const suggestedReps = suggestNextReps(currentExercise.reps);
                     const currentWeightStr = formatWeight(lastSetWeightNum) ?? currentExercise.weight; // Use last weight if possible
                     console.log(`PROGRESSION_SERVICE: [${currentExercise.name}] Cond 2 Met (Min Reps Met, High RPE or Max Reps Not Met). Suggesting Keep W: ${currentWeightStr}, Target Reps: ${suggestedReps}`);
                     suggestions[currentExercise.id] = {
                         weight: currentWeightStr,
                         reps: suggestedReps, // Suggest aiming higher or original target
                         note: `Suggest: Aim for ${suggestedReps} reps (Last: ${lastSetRepsNum} @ RPE ${lastSetRpe ?? 'N/A'})`
                     };
                }
                // Condition 3 (Implicitly handled if neither above is met, but explicitly stating): Did not meet min reps on all sets
                 else { // This case is now covered by the 'else' below
                    // Fallthrough expected
                 }

            } else { // Conditions not met (didn't hit min reps on all sets OR couldn't parse last weight)
                 console.log(`PROGRESSION_SERVICE: [${currentExercise.name}] Cond 3 Met (Min Reps Not Met / Weight Issue). Suggesting Keep Same.`);
                 suggestions[currentExercise.id] = {
                    weight: formatWeight(lastSetWeightNum) ?? currentExercise.weight, // Try to suggest last used weight, else template weight
                    reps: currentExercise.reps, // Keep original rep target
                    note: `Suggest: Keep weight same (Focus on hitting ${minTargetReps}+ reps)`
                 };
            }
            // --- End Refined Rules ---
        }

        console.log("PROGRESSION_SERVICE: Final suggestions:", JSON.stringify(suggestions, null, 2));
        return suggestions;

    } catch (error) {
        console.error("PROGRESSION_SERVICE: Error calculating suggestions:", error);
        return {}; // Return empty suggestions on error
    }
};


// --- Export Service ---
const progressionService = {
    calculateSuggestions,
};

export default progressionService;