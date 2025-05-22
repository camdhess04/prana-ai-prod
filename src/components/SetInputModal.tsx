// src/components/SetInputModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { PerformedSet } from '../types/workout'; // Local type for a set
import RPESelector from './RPESelector'; // Import the RPE selector
import Button from './Button'; // Your custom Button component
import Card from './Card'; // Your custom Card component
import { X } from 'lucide-react-native'; // Close icon
import uuid from 'react-native-uuid';

interface SetInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (setData: PerformedSet) => void;
  initialSetData?: Partial<PerformedSet>; // For editing or pre-filling a new set
  exerciseName?: string;
  setNumber?: number; // To display "Set X"
}

const SetInputModal: React.FC<SetInputModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialSetData,
  exerciseName,
  setNumber,
}) => {
  const { theme } = useAppTheme();

  const [currentSetId, setCurrentSetId] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rpe, setRpe] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      // Initialize state when modal becomes visible
      setCurrentSetId(initialSetData?.id || uuid.v4()); // Use existing ID or generate new
      setWeight(initialSetData?.weight?.toString() ?? '');
      setReps(initialSetData?.reps?.toString() ?? '');
      setRpe(initialSetData?.rpe ?? null);
      setNotes(initialSetData?.notes ?? '');
    } else {
      // Optionally reset when hidden, though not strictly necessary if re-initialized on show
    }
  }, [isVisible, initialSetData]);

  const handleSave = () => {
    // Basic validation (can be expanded)
    if (!weight.trim() && !reps.trim()) {
      // Alert.alert("Missing Data", "Please enter weight or reps.");
      // return;
      // Allow saving even if only notes or RPE are logged
    }

    const setData: PerformedSet = {
      id: currentSetId, // Use the determined ID
      weight: weight.trim() || null,
      reps: reps.trim() || null,
      rpe: rpe,
      notes: notes.trim() || null,
    };
    onSave(setData);
    onClose(); // Close modal after save
  };

  const modalTitleText = initialSetData?.id
    ? `Edit Set ${setNumber ? setNumber : ''}${exerciseName ? ` for ${exerciseName}` : ''}`
    : `Log Set ${setNumber ? setNumber : ''}${exerciseName ? ` for ${exerciseName}` : ''}`;

  // Define styles inside the component to access theme for fonts
  const styles = StyleSheet.create({
    keyboardAvoidingView: { flex: 1 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: theme.fontFamilyMonoMedium, // Use Mono Medium for title
        fontWeight: '700', // Keep bold weight for emphasis
    },
    closeButton: { padding: 8 },
    inputRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    inputContainer: { flex: 1 },
    label: {
        fontSize: 15,
        fontFamily: theme.fontFamilyMonoRegular, // Use Mono Regular for labels
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 17,
        fontFamily: theme.fontFamilyMonoRegular, // Already set for input text
    },
    notesInput: {
        minHeight: 90,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    rpeSelector: { marginVertical: 12 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 32, gap: 12 },
    modalButton: { minWidth: 100, paddingVertical: 12 },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.headerContainer}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{modalTitleText}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>Weight (kg/lb)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.borderColor }]}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="e.g., 60"
                  placeholderTextColor={theme.secondaryText}
                  keyboardType="numeric"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>Reps</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.borderColor }]}
                  value={reps}
                  onChangeText={setReps}
                  placeholder="e.g., 8"
                  placeholderTextColor={theme.secondaryText}
                  keyboardType="numeric"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.secondaryText, marginTop: 16 }]}>RPE (1-10)</Text>
            <RPESelector currentValue={rpe} onSelect={setRpe} style={styles.rpeSelector} />

            <Text style={[styles.label, { color: theme.secondaryText, marginTop: 16 }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.borderColor }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g., Felt strong, focus on form..."
              placeholderTextColor={theme.secondaryText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoCorrect={true}
              spellCheck={true}
            />

            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} variant="ghost" style={styles.modalButton} />
              <Button title="Save Set" onPress={handleSave} style={styles.modalButton} />
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SetInputModal; 