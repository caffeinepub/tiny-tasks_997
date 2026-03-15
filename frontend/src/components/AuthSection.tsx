import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { LogIn, LogOut, User, Edit3, Save, X } from "lucide-react";
import { useGetDisplayName, useSetDisplayName } from "../hooks/useQueries";

export default function AuthSection() {
  const { identity, login, clear } = useInternetIdentity();
  const { data: displayName } = useGetDisplayName();
  const setDisplayNameMutation = useSetDisplayName();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const isAuthenticated = !!identity;

  const handleEdit = () => {
    setNewDisplayName(displayName || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (newDisplayName.trim()) {
      await setDisplayNameMutation.mutateAsync(newDisplayName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewDisplayName("");
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
        <div className="mb-4">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to Tiny Tasks
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in with Internet Identity to manage your personal tasks
          </p>
        </div>
        <button
          onClick={login}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In with Internet Identity
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Signed in as</p>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your display name"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={
                    setDisplayNameMutation.isPending || !newDisplayName.trim()
                  }
                  className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {setDisplayNameMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-800">
                  {displayName || "Anonymous User"}
                </p>
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
