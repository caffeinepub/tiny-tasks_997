import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ListChecks } from "lucide-react";
import AuthSection from "./components/AuthSection";
import ProfileSection from "./components/ProfileSection";
import TaskManager from "./components/TaskManager";
import Footer from "./components/Footer";

function App() {
  const { isInitializing, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing) {
      queryClient.invalidateQueries();
    }
  }, [isAuthenticated, isInitializing, queryClient]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ListChecks className="w-14 h-14 text-gray-800" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Tiny Tasks</h1>
              <p className="text-gray-600">Your personal task manager</p>
            </div>
          </div>

          <ProfileSection />
        </header>

        {!isAuthenticated && <AuthSection />}

        {isAuthenticated && (
          <div className="space-y-8">
            <TaskManager />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
