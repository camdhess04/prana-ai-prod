// src/context/AuthContext.tsx
// *** RESTORED REAL AUTHENTICATION CONTEXT ***

import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from 'react';
// --- Use Modern Amplify Imports ---
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { AuthUser, SignInOutput, SignUpOutput, ConfirmSignUpOutput, ResendSignUpCodeOutput, FetchUserAttributesOutput } from 'aws-amplify/auth';
import profileService from '../services/profileService';
import type { UserProfile } from '../types/profile'; // Assuming UserProfile type includes nickname
// --- --- --- --- --- --- --- ---

// Define possible onboarding statuses
type OnboardingStatus = 'checking' | 'needed' | 'complete';

// Extend with profile data, including optional nickname
interface UserProfileData {
    nickname?: string | null;
    // other profile fields can be added here if needed in context
}

interface AuthContextType {
    user: AuthUser | null;
    userProfile: UserProfileData | null; // To hold nickname and other profile details
    isLoading: boolean;
    onboardingStatus: OnboardingStatus;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string, email: string) => Promise<SignUpOutput>;
    confirmSignUp: (username: string, code: string) => Promise<ConfirmSignUpOutput>;
    resendSignUp: (username: string) => Promise<ResendSignUpCodeOutput>;
    signOut: () => Promise<void>;
    fetchCurrentSession: () => Promise<any>;
    fetchCurrentUserAttributes: () => Promise<FetchUserAttributesOutput>;
    markOnboardingComplete: () => void;
    updateUserProfileData: (newData: Partial<UserProfileData>) => Promise<void>; // For updating nickname etc.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>('checking');

    const checkUserAndProfile = async (isInitialLoad = false) => {
        if (isInitialLoad) setIsLoading(true);
        setOnboardingStatus('checking');
        console.log('AUTH_CONTEXT: Checking current user...');
        try {
            const authenticatedUser = await getCurrentUser();
            console.log('AUTH_CONTEXT: User found:', authenticatedUser.username);
            setUser(authenticatedUser);

            console.log('AUTH_CONTEXT: Checking user profile...');
            // Assuming profileService.getUserProfile returns a UserProfile compatible object
            const profile: UserProfile | null = await profileService.getUserProfile(authenticatedUser.userId);
            if (profile) {
                console.log('AUTH_CONTEXT: Profile found. Onboarding complete.');
                setUserProfile({ nickname: profile.nickname }); // Extract nickname
                setOnboardingStatus('complete');
            } else {
                console.log('AUTH_CONTEXT: Profile NOT found. Onboarding needed.');
                setUserProfile(null);
                setOnboardingStatus('needed');
            }
        } catch (error) {
            console.log('AUTH_CONTEXT: No authenticated user found.');
            setUser(null);
            setUserProfile(null);
            setOnboardingStatus('needed');
        } finally {
            // Only set loading to false on initial load
            if (isInitialLoad) {
                setIsLoading(false);
                console.log('AUTH_CONTEXT: Initial load check complete, setting isLoading to false');
            }
            console.log('AUTH_CONTEXT: Finished checkUserAndProfile. Current state - isLoading:', isLoading, 'onboardingStatus:', onboardingStatus);
        }
    };

    useEffect(() => {
        checkUserAndProfile(true);

        const listener = (data: any) => {
            console.log("Hub event received:", data.payload.event);
            switch (data.payload.event) {
                case 'signedIn':
                case 'autoSignIn':
                case 'signUp':
                    checkUserAndProfile();
                    break;
                case 'signedOut':
                    setUser(null);
                    setUserProfile(null);
                    setOnboardingStatus('needed');
                    break;
            }
        };
        const hubListenerCancelToken = Hub.listen('auth', listener);
        console.log("Hub listener set up.");
        return () => { hubListenerCancelToken(); };
    }, []);

    const markOnboardingComplete = () => {
        console.log("AUTH_CONTEXT: Marking onboarding as complete.");
        setOnboardingStatus('complete');
        if(user) checkUserAndProfile(); // Re-check to load profile data including nickname
    };

    const handleUpdateUserProfileData = async (newData: Partial<UserProfileData>) => {
        if (!user || !user.userId) {
            console.error("AUTH_CONTEXT: No user to update profile for.");
            throw new Error("User not authenticated.");
        }
        try {
            console.log('AUTH_CONTEXT: Updating user profile data with:', newData);
            // Stage B: Persist to backend via profileService
            // For now, profileService.updateUserProfile might not exist or not handle all partial updates.
            // We'll assume it takes the userId and the fields to update.
            // e.g., await profileService.updateUserProfile(user.userId, { nickname: newData.nickname });
            
            // For Stage A, just update local state
            setUserProfile(prevProfile => ({ ...prevProfile, ...newData }));
            console.log('AUTH_CONTEXT: Local user profile data updated.');
            
            // Placeholder for actual backend update call - to be fully implemented in Stage B
            if (newData.nickname !== undefined) { // Example: only call service if nickname changes
                 // await profileService.updateUserProfile(user.userId, { nickname: newData.nickname });
                 console.log("AUTH_CONTEXT: Backend update for nickname would be called here.");
            }

        } catch (error) {
            console.error('AUTH_CONTEXT: Error updating user profile data:', error);
            throw error; // Re-throw for the UI to handle
        }
    };

    const handleSignIn = async (username: string, password: string): Promise<void> => {
        console.log('🔑 CONTEXT: Attempting sign in via context for:', username);
        try {
            const cleanUsername = username.trim();
            const cleanPassword = password.trim();

            // Call Amplify signIn - this initiates the process
            // We await it primarily to allow catching errors from the attempt itself
            const signInOutput = await signIn({
                username: cleanUsername,
                password: cleanPassword
            });

            console.log('✅ CONTEXT: Amplify signIn call completed. Raw output:', signInOutput);

            // *** NO MORE CODE NEEDED HERE ON SUCCESS ***
            // SUCCESS is handled async by the Hub listener ('signedIn')
            // which calls checkCurrentUser -> updates state -> triggers navigation.

        } catch (error: any) {
            // Log details from the ACTUAL error thrown by Amplify signIn
            console.error('❌ CONTEXT: Sign-in error caught:', error.name, error.message);

            // Re-throw a user-friendly error message for the LoginScreen UI
            if (error.name === 'UserNotConfirmedException') { throw new Error('Confirm email first.'); }
            else if (error.name === 'NotAuthorizedException') { throw new Error('Incorrect username or password.'); }
            else if (error.name === 'UserNotFoundException') { throw new Error('User not found.'); }
            else if (error.name === 'UserAlreadyAuthenticatedException') {
                 // This *shouldn't* normally be hit if LoginScreen only calls this when logged out,
                 // but if it happens (e.g., fast double-tap), log it but don't crash UI.
                 console.warn("CONTEXT: signIn called when user already authenticated.");
                 return; // Exit gracefully without throwing to UI
            }
            else { throw new Error(error.message || 'Unknown auth error.'); }
        }
    };

    const handleSignUp = async (username: string, password: string, email: string): Promise<SignUpOutput> => {
        console.log('Attempting sign up for:', username);
        try {
            const signUpOutput = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email
                    }
                }
            });
            console.log('Sign up result:', signUpOutput);
            return signUpOutput;
        } catch (error: any) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const handleConfirmSignUp = async (username: string, code: string): Promise<ConfirmSignUpOutput> => {
        console.log(`Attempting confirmation for ${username} with code ${code}`);
        try {
            const confirmSignUpOutput = await confirmSignUp({ username, confirmationCode: code });
            console.log('Sign up confirmed successfully');
            return confirmSignUpOutput;
        } catch (error: any) {
            console.error('Error confirming sign up:', error);
            throw error;
        }
    };

    const handleResendConfirmationCode = async (username: string): Promise<ResendSignUpCodeOutput> => {
        try {
            const resendCodeOutput = await resendSignUpCode({ username });
            console.log('Resend confirmation code successful:', resendCodeOutput);
            return resendCodeOutput;
        } catch (error) {
            console.error('Error resending confirmation code:', error);
            throw error;
        }
    };

    const handleSignOut = async (): Promise<void> => {
        console.log('Attempting sign out...');
        try {
            await signOut();
            console.log('Sign out successful');
        } catch (error) {
            console.error('Error signing out: ', error);
            throw error;
        }
    };

    const handleFetchSession = async (): Promise<any> => {
        console.log('Attempting to fetch session...');
        try {
            const session = await fetchAuthSession();
            console.log('Fetched session:', session);
            return session;
        } catch (error) {
            console.error('Error fetching session:', error);
            throw error;
        }
    };

    const handleFetchUserAttributes = async (): Promise<FetchUserAttributesOutput> => {
        console.log('Attempting to fetch user attributes...');
        try {
            const attributes = await fetchUserAttributes();
            console.log('Fetched attributes:', attributes);
            return attributes;
        } catch (error) {
            console.error('Error fetching user attributes:', error);
            throw error;
        }
    };

    const contextValue: AuthContextType = {
        user,
        userProfile,
        isLoading,
        onboardingStatus,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        resendSignUp: handleResendConfirmationCode,
        signOut: handleSignOut,
        fetchCurrentSession: handleFetchSession,
        fetchCurrentUserAttributes: handleFetchUserAttributes,
        markOnboardingComplete,
        updateUserProfileData: handleUpdateUserProfileData,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 