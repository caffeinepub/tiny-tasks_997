import { useState, useRef, useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { User, Edit3, LogOut, Save, X } from "lucide-react";
import { useGetDisplayName, useSetDisplayName } from "../hooks/useQueries";

export default function ProfileSection() {
  const { identity, clear } = useInternetIdentity();
  const { data: displayName } = useGetDisplayName();
  const setDisplayNameMutation = useSetDisplayName();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setNewDisplayName(displayName || "");
    setIsEditing(true);
    setIsDropdownOpen(false);
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

  const handleSignOut = () => {
    clear();
    setIsDropdownOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-3">
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
          <>
            <span className="text-gray-700 font-medium">
              {displayName || "Anonymous User"}
            </span>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {isDropdownOpen && !isEditing && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Name</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
