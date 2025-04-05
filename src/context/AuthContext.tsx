// src/context/AuthContext.tsx
// *** MOCKED AUTHENTICATION CONTEXT FOR DEVELOPMENT ***

import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from 'react';
// Removed imports for Amplify Auth functions (signIn, signUp, Hub, etc.) as they are now mocked
// We still might need a type for the user object
// Define a simple mock user type or use a generic object
// Or import AuthUser if you want to maintain the type structure for later
import type { AuthUser } from 'aws-amplify/auth'; // Keep type for structure if desired

// Define a simpler mock user structure or use AuthUser interface partially
interface MockUser {
    username: string;
    userId: string;
    // Add any other user attributes your app might need later
    attributes?: {
        email?: string;
        // etc.
    };
}

// Define the shape of the context value (functions will be mocked)
interface AuthContextType {
    user: MockUser | null; // Using MockUser type now
    isLoading: boolean;
    signIn: (args?: any) => Promise<void>; // Mocked - takes optional args
    signUp: (args?: any) => Promise<void>; // Mocked
    confirmSignUp: (args?: any) => Promise<void>; // Mocked
    resendSignUp: (args?: any) => Promise<void>; // Mocked
    signOut: () => Promise<void>; // Mocked
    fetchCurrentSession?: () => Promise<any>; // Optional: Mock or remove
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider component
interface AuthProviderProps {
    children: ReactNode;
}

// --- Mock User Data ---
const mockUser: MockUser = {
    username: 'developer@prana.ai', // Use a consistent mock username
    userId: 'mock-user-123',
    attributes: {
        email: 'developer@prana.ai',
    },
};
// --- --- --- --- ---

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading

    // --- Mocked checkCurrentUser ---
    // Simulate loading and then set the mock user
    useEffect(() => {
        console.log('[Mock Auth] Simulating initial auth check...');
        setIsLoading(true);
        const timer = setTimeout(() => {
            console.log('[Mock Auth] Setting mock user:', mockUser.username);
            setUser(mockUser);
            setIsLoading(false);
            console.log('[Mock Auth] Finished mock auth check.');
        }, 1500); // Simulate 1.5 second loading time

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);
    // --- --- --- --- --- --- --- ---

    // --- Removed Hub Listener ---
    // useEffect(() => { /* Hub listener code removed */ }, []);
    // --- --- --- --- --- --- ---

    // --- Mocked Authentication Functions ---

    const mockSignIn = async (args?: any): Promise<void> => {
        console.log('[Mock Auth] signIn called (mocked)', args);
        setIsLoading(true);
        // Simulate sign-in delay and set user
        await new Promise(res => setTimeout(res, 500));
        setUser(mockUser);
        setIsLoading(false);
        console.log('[Mock Auth] Mock user set via signIn');
    };

    const mockSignUp = async (args?: any): Promise<void> => {
        console.log('[Mock Auth] signUp called (mocked - does nothing)', args);
        // In mock mode, we don't need to do anything here
        // Maybe show an alert for feedback during development?
        // Alert.alert("Mock Mode", "Sign up function called (no action taken).");
        return Promise.resolve();
    };

    const mockConfirmSignUp = async (args?: any): Promise<void> => {
        console.log('[Mock Auth] confirmSignUp called (mocked - does nothing)', args);
        return Promise.resolve();
    };

    const mockResendSignUp = async (args?: any): Promise<void> => {
        console.log('[Mock Auth] resendSignUp called (mocked - does nothing)', args);
        return Promise.resolve();
    };

    const mockSignOut = async (): Promise<void> => {
        console.log('[Mock Auth] signOut called (mocked)');
        setIsLoading(true);
        // Simulate sign-out delay and clear user
        await new Promise(res => setTimeout(res, 500));
        setUser(null);
        setIsLoading(false);
        console.log('[Mock Auth] User set to null via signOut');
    };

    const mockFetchCurrentSession = async (): Promise<any> => {
         console.log('[Mock Auth] fetchCurrentSession called (mocked)');
         // Return mock session data if needed by other parts of your app
         return Promise.resolve({
             user: mockUser,
             credentials: { accessKeyId: 'mockAccessKey', secretAccessKey: 'mockSecret', sessionToken: 'mockSessionToken' },
             identityId: 'mockIdentityId'
         });
    };

    // --- --- --- --- --- --- --- --- --- --- ---

    // Provide state and mocked functions through the context
    const contextValue: AuthContextType = {
        user,
        isLoading,
        signIn: mockSignIn,
        signUp: mockSignUp,
        confirmSignUp: mockConfirmSignUp,
        resendSignUp: mockResendSignUp,
        signOut: mockSignOut,
        fetchCurrentSession: mockFetchCurrentSession,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the context (no changes needed)
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 