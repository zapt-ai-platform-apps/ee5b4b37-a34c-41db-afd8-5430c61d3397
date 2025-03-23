import React, { useEffect, useRef } from 'react';
import { useWidgets } from '../../context/WidgetContext';

const AddWidgetMenu = ({ position, onAddWidget, onClose }) => {
  const { widgetDefinitions } = useWidgets();
  const menuRef = useRef(null);

  useEffect(() => {
    // Handle clicking outside of the menu to close it
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 bg-[#1a1a1a] border border-[#333] rounded-md shadow-lg p-2 max-w-xs"
      style={{ 
        left: position.x, 
        top: position.y,
        maxHeight: '60vh',
        overflowY: 'auto'
      }}
    >
      <h3 className="text-sm font-bold mb-2 p-2 border-b border-[#333]">Add Widget</h3>
      <div className="divide-y divide-[#333]">
        {widgetDefinitions.map((widget) => (
          <div 
            key={widget.type}
            className="p-2 hover:bg-[#252525] cursor-pointer transition-colors"
            onClick={() => onAddWidget(widget.type)}
          >
            <div className="font-medium">{widget.name}</div>
            <div className="text-xs text-gray-400">{widget.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddWidgetMenu;