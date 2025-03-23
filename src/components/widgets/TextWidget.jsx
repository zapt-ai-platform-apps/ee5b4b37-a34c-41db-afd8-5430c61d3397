import React, { useState } from 'react';

const TextWidget = ({ config, updateConfig }) => {
  const { text, fontSize, alignment } = config;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showSettings, setShowSettings] = useState(false);

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const saveText = () => {
    updateConfig({ text: editText });
    setIsEditing(false);
  };

  const updateFontSize = (newSize) => {
    const size = Math.max(8, Math.min(36, newSize));
    updateConfig({ fontSize: size });
  };

  const updateAlignment = (newAlignment) => {
    updateConfig({ alignment: newAlignment });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {isEditing ? (
          <div className="h-full">
            <textarea
              value={editText}
              onChange={handleTextChange}
              className="ncurses-input w-full h-full resize-none"
              autoFocus
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={saveText}
                className="ncurses-button cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditText(text);
                  setIsEditing(false);
                }}
                className="ncurses-button ml-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="h-full overflow-auto cursor-pointer"
            onClick={() => setIsEditing(true)}
            style={{ 
              fontSize: `${fontSize}px`,
              textAlign: alignment
            }}
          >
            {text}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          {showSettings ? 'Hide settings' : 'Show settings'}
        </button>
        
        {showSettings && !isEditing && (
          <div className="mt-2 p-2 bg-[#252525] rounded">
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span>Font size:</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="36"
                step="1"
                value={fontSize}
                onChange={(e) => updateFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="mb-1">Alignment:</div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => updateAlignment('left')}
                  className={`ncurses-button ${alignment === 'left' ? 'bg-[#4ade80]' : ''} cursor-pointer`}
                >
                  Left
                </button>
                <button
                  onClick={() => updateAlignment('center')}
                  className={`ncurses-button ${alignment === 'center' ? 'bg-[#4ade80]' : ''} cursor-pointer`}
                >
                  Center
                </button>
                <button
                  onClick={() => updateAlignment('right')}
                  className={`ncurses-button ${alignment === 'right' ? 'bg-[#4ade80]' : ''} cursor-pointer`}
                >
                  Right
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWidget;