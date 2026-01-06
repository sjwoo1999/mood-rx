// Mock Supabase client for testing
import { isMockMode, MOCK_USER } from './data';

type MockUser = typeof MOCK_USER | null;

let mockLoggedIn = true; // Start logged in for testing

export function getMockAuth() {
    return {
        getUser: async () => ({
            data: {
                user: mockLoggedIn ? MOCK_USER : null,
            },
        }),
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
            if (email && password) {
                mockLoggedIn = true;
                return { error: null };
            }
            return { error: new Error('Invalid credentials') };
        },
        signUp: async ({ email, password }: { email: string; password: string }) => {
            if (email && password) {
                return { error: null };
            }
            return { error: new Error('Invalid input') };
        },
        signOut: async () => {
            mockLoggedIn = false;
            return { error: null };
        },
        onAuthStateChange: (callback: (event: string, session: { user: MockUser } | null) => void) => {
            // Return a mock subscription
            return {
                data: {
                    subscription: {
                        unsubscribe: () => { },
                    },
                },
            };
        },
    };
}

export function setMockLoggedIn(value: boolean) {
    mockLoggedIn = value;
}

export function isMockLoggedIn() {
    return mockLoggedIn;
}
