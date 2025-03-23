import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Workspace from './components/workspace/Workspace';
import useLocalStorage from './hooks/useLocalStorage';
import { ThemeProvider } from './context/ThemeContext';
import { WidgetProvider } from './context/WidgetContext';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  // Workspace management
  const [workspaces, setWorkspaces] = useLocalStorage('workspaces', [
    { id: 'default', name: 'Default Workspace', widgets: [] }
  ]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useLocalStorage('currentWorkspaceId', 'default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];

  // Workspace actions
  const createWorkspace = (name) => {
    const newWorkspace = {
      id: uuidv4(),
      name: name || `Workspace ${workspaces.length + 1}`,
      widgets: []
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setCurrentWorkspaceId(newWorkspace.id);
    return newWorkspace;
  };

  const deleteWorkspace = (id) => {
    if (workspaces.length <= 1) {
      console.log('Cannot delete the last workspace');
      return;
    }
    
    const newWorkspaces = workspaces.filter(w => w.id !== id);
    setWorkspaces(newWorkspaces);
    
    if (id === currentWorkspaceId) {
      setCurrentWorkspaceId(newWorkspaces[0].id);
    }
  };

  const updateWorkspace = (updatedWorkspace) => {
    const newWorkspaces = workspaces.map(w => 
      w.id === updatedWorkspace.id ? updatedWorkspace : w
    );
    setWorkspaces(newWorkspaces);
  };

  const saveWidgetsToWorkspace = (widgets) => {
    const updatedWorkspace = { ...currentWorkspace, widgets };
    updateWorkspace(updatedWorkspace);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Alt+S
      if (e.altKey && e.key === 's') {
        setIsSidebarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <WidgetProvider>
        <div className="h-screen flex flex-col text-[#e0e0e0] bg-[#121212]">
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            currentWorkspace={currentWorkspace}
            updateWorkspace={updateWorkspace}
          />
          
          <div className="flex-1 flex overflow-hidden">
            {isSidebarOpen && (
              <Sidebar 
                workspaces={workspaces}
                currentWorkspaceId={currentWorkspaceId}
                setCurrentWorkspaceId={setCurrentWorkspaceId}
                createWorkspace={createWorkspace}
                deleteWorkspace={deleteWorkspace}
              />
            )}
            
            <Workspace 
              workspace={currentWorkspace}
              saveWidgets={saveWidgetsToWorkspace}
            />
          </div>
          
          <div className="zapt-badge">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
              Made on ZAPT
            </a>
          </div>
        </div>
      </WidgetProvider>
    </ThemeProvider>
  );
}