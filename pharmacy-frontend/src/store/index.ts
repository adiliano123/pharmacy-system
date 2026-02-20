// Global state management
// You can use Zustand, Redux, or Context API here

interface AppState {
  user: any | null;
  isLoading: boolean;
}

// Example using simple state management
export const initialState: AppState = {
  user: null,
  isLoading: false,
};

// Add your state management logic here
