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
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUp, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
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
        console.log('🔑 Attempting sign in with username:', username);
        try {
            const { isSignedIn, nextStep } = await signIn({
                username,
                password
            });
            console.log('✅ SignIn result - isSignedIn:', isSignedIn, 'nextStep:', nextStep);
            if (!isSignedIn && nextStep) {
                console.log("SignIn requires next step:", nextStep.signInStep);
                throw new Error(`SignIn requires next step: ${nextStep.signInStep}`);
            }
        } catch (error: any) {
            console.error('❌ Sign-in error (raw):', error);
            console.log('❌ error.name:', error.name);
            console.log('❌ error.message:', error.message);
            console.log('❌ error.stack:', error.stack);
            throw error;
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

    const handleResendSignUp = async (username: string): Promise<void> => {
        console.log(`Resending code for ${username}`);
        try {
            await resendSignUp({ username });
            console.log('Confirmation code resent successfully');
        } catch (error: any) {
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
        resendSignUp: handleResendSignUp,
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