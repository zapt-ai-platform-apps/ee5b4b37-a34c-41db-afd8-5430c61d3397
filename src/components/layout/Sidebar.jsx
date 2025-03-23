import React, { useState } from 'react';
import { useWidgets } from '../../context/WidgetContext'; 
import { FaPlus, FaTrash, FaEllipsisV } from 'react-icons/fa';

const Sidebar = ({ 
  workspaces, 
  currentWorkspaceId, 
  setCurrentWorkspaceId, 
  createWorkspace, 
  deleteWorkspace 
}) => {
  const { widgetDefinitions, createWidgetInstance } = useWidgets();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const handleAddWidget = (widgetType) => {
    // This function will be used in the Workspace component
    // We just log it here to show it's available in the sidebar
    console.log('Add widget:', widgetType);
  };

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
    }
    setIsCreatingWorkspace(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateWorkspace();
    } else if (e.key === 'Escape') {
      setIsCreatingWorkspace(false);
      setNewWorkspaceName('');
    }
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#333] overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-[#333]">
        <h2 className="text-lg font-bold mb-2">Workspaces</h2>
        
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <div 
              key={workspace.id}
              className={`p-2 rounded flex justify-between items-center cursor-pointer ${
                workspace.id === currentWorkspaceId ? 'bg-[#333] text-[#4ade80]' : 'hover:bg-[#222]'
              }`}
              onClick={() => setCurrentWorkspaceId(workspace.id)}
            >
              <span className="truncate">{workspace.name}</span>
              
              {workspace.id !== currentWorkspaceId && workspaces.length > 1 && (
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    deleteWorkspace(workspace.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Delete workspace"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {isCreatingWorkspace ? (
          <div className="mt-2 flex">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ncurses-input flex-1 mr-1"
              placeholder="Workspace name"
              autoFocus
            />
            <button 
              onClick={handleCreateWorkspace}
              className="ncurses-button"
            >
              <FaPlus />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingWorkspace(true)}
            className="ncurses-button mt-2 w-full"
          >
            <FaPlus className="inline-block mr-1" /> New Workspace
          </button>
        )}
      </div>
      
      <div className="p-4 border-b border-[#333] flex-1">
        <h2 className="text-lg font-bold mb-2">Available Widgets</h2>
        <div className="space-y-2">
          {widgetDefinitions.map((widget) => (
            <div 
              key={widget.type}
              className="p-2 rounded hover:bg-[#222] cursor-pointer"
              onClick={() => handleAddWidget(widget.type)}
            >
              <div className="flex justify-between items-center">
                <span>{widget.name}</span>
                <button 
                  className="text-gray-500 hover:text-[#4ade80]"
                  aria-label={`Add ${widget.name}`}
                >
                  <FaPlus size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-500">{widget.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 text-xs text-gray-500">
        <p>Press Alt+S to toggle sidebar</p>
        <p>Workspace settings are saved locally</p>
      </div>
    </div>
  );
};

export default Sidebar;