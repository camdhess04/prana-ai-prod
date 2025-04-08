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
import type { AuthUser, SignInInput, SignUpInput, ConfirmSignUpInput, ResendSignUpCodeInput } from 'aws-amplify/auth';
// --- --- --- --- --- --- --- ---

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string, email: string) => Promise<any>;
    confirmSignUp: (username: string, code: string) => Promise<void>;
    resendSignUp: (username: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchCurrentSession: () => Promise<any>;
    fetchCurrentUserAttributes: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkCurrentUser = async () => {
        console.log('Attempting to check current user...');
        try {
            const authenticatedUser = await getCurrentUser();
            console.log('Current user checked:', authenticatedUser.username);
            setUser(authenticatedUser);
        } catch (error) {
            console.log('No authenticated user found (expected if not logged in):', error);
            setUser(null);
        } finally {
            if (isLoading) setIsLoading(false);
            console.log('Finished checking user, isLoading:', isLoading);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        checkCurrentUser().finally(() => setIsLoading(false));

        const listener = (data: any) => {
            console.log("Hub event received:", data.payload.event);
            switch (data.payload.event) {
                case 'signedIn':
                case 'autoSignIn':
                case 'signUp':
                    console.log('Hub received signedIn/autoSignIn/signUp event');
                    checkCurrentUser();
                    break;
                case 'signedOut':
                    console.log('Hub received signedOut event');
                    setUser(null);
                    break;
            }
        };
        const hubListenerCancelToken = Hub.listen('auth', listener);
        console.log("Hub listener set up.");
        return () => {
            console.log("Cleaning up Hub listener.");
            hubListenerCancelToken();
        };
    }, []);

    const handleSignIn = async (username: string, password: string): Promise<void> => {
        console.log('🔑 CONTEXT: Attempting sign in via context for:', username);
        try {
            const cleanUsername = username.trim();
            const cleanPassword = password.trim();

            // Call Amplify signIn - this initiates the process
            // We await it primarily to allow catching errors from the attempt itself
            const output = await signIn({
                username: cleanUsername,
                password: cleanPassword
            });

            console.log('✅ CONTEXT: Amplify signIn call completed. Raw output:', output);

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

    const handleSignUp = async (username: string, password: string, email: string): Promise<any> => {
        console.log('Attempting sign up for:', username);
        try {
            const output = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email
                    }
                }
            });
            console.log('Sign up result:', output);
            return output;
        } catch (error: any) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const handleConfirmSignUp = async (username: string, code: string): Promise<void> => {
        console.log(`Attempting confirmation for ${username} with code ${code}`);
        try {
            await confirmSignUp({ username, confirmationCode: code });
            console.log('Sign up confirmed successfully');
        } catch (error: any) {
            console.error('Error confirming sign up:', error);
            throw error;
        }
    };

    const handleResendConfirmationCode = async (email: string): Promise<void> => {
        try {
            await resendSignUpCode({ username: email });
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

    const handleFetchUserAttributes = async (): Promise<any> => {
        console.log('Attempting to fetch user attributes...');
        try {
            const attributes = await fetchUserAttributes();
            console.log('Fetched attributes:', attributes);
            return attributes;
        } catch (error) {
            console.error('Error fetching user attributes:', error);
            return null;
        }
    };

    const contextValue: AuthContextType = {
        user,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        resendSignUp: handleResendConfirmationCode,
        signOut: handleSignOut,
        fetchCurrentSession: handleFetchSession,
        fetchCurrentUserAttributes: handleFetchUserAttributes,
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