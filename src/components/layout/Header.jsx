import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaBars, FaSun, FaMoon, FaSave, FaEdit } from 'react-icons/fa';

const Header = ({ toggleSidebar, currentWorkspace, updateWorkspace }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace.name);

  const handleNameChange = (e) => {
    setWorkspaceName(e.target.value);
  };

  const handleNameSave = () => {
    if (workspaceName.trim()) {
      updateWorkspace({
        ...currentWorkspace,
        name: workspaceName.trim()
      });
    } else {
      setWorkspaceName(currentWorkspace.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setWorkspaceName(currentWorkspace.name);
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-[#252525] border-b border-[#333] px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="ncurses-button text-xl p-1"
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        
        <div className="flex items-center">
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={workspaceName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                className="ncurses-input mr-2"
                autoFocus
                maxLength={30}
              />
              <button 
                onClick={handleNameSave}
                className="ncurses-button"
                aria-label="Save"
              >
                <FaSave />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-xl font-bold mr-2">{currentWorkspace.name}</h1>
              <button 
                onClick={() => setIsEditing(true)}
                className="ncurses-button"
                aria-label="Edit name"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <button 
          onClick={toggleTheme}
          className="ncurses-button"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;