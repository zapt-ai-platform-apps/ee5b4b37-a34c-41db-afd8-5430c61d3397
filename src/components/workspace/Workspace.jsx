import React, { useState, useEffect } from 'react';
import { useWidgets } from '../../context/WidgetContext';
import WidgetWrapper from './WidgetWrapper';
import AddWidgetMenu from './AddWidgetMenu';
import { FaPlus } from 'react-icons/fa';

const Workspace = ({ workspace, saveWidgets }) => {
  const [widgets, setWidgets] = useState(workspace.widgets || []);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { createWidgetInstance } = useWidgets();

  // Update local widgets when workspace changes
  useEffect(() => {
    setWidgets(workspace.widgets || []);
  }, [workspace]);

  // Save widgets to workspace when they change
  useEffect(() => {
    saveWidgets(widgets);
  }, [widgets, saveWidgets]);

  const addWidget = (widgetType) => {
    const newWidget = createWidgetInstance(widgetType);
    if (newWidget) {
      setWidgets([...widgets, newWidget]);
    }
    setShowAddMenu(false);
  };

  const updateWidget = (updatedWidget) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    );
    setWidgets(updatedWidgets);
  };

  const removeWidget = (widgetId) => {
    const updatedWidgets = widgets.filter(widget => widget.id !== widgetId);
    setWidgets(updatedWidgets);
  };

  const handleAddButtonClick = (e) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: buttonRect.left,
      y: buttonRect.bottom + window.scrollY
    });
    setShowAddMenu(!showAddMenu);
  };

  return (
    <div className="flex-1 p-4 overflow-auto relative bg-[#121212]">
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center p-8 rounded-lg border border-dashed border-[#333] bg-[#1a1a1a]">
            <h2 className="text-xl mb-4">This workspace is empty</h2>
            <p className="mb-4 text-gray-400">Add widgets to get started</p>
            <button 
              onClick={handleAddButtonClick} 
              className="ncurses-button"
            >
              <FaPlus className="mr-2 inline" /> Add Widget
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {widgets.map(widget => (
            <WidgetWrapper
              key={widget.id}
              widget={widget}
              updateWidget={updateWidget}
              removeWidget={removeWidget}
            />
          ))}
          
          <button 
            className="fixed bottom-6 left-6 z-10 ncurses-button flex items-center shadow-lg"
            onClick={handleAddButtonClick}
          >
            <FaPlus className="mr-2" /> Add Widget
          </button>
        </div>
      )}
      
      {showAddMenu && (
        <AddWidgetMenu
          position={menuPosition}
          onAddWidget={addWidget}
          onClose={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
};

export default Workspace;