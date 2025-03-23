import React, { useState, useEffect, useRef } from 'react';
import useAudio from '../../hooks/useAudio';
import { FaPlay, FaPause, FaStop, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const LessonPhases = ({ config, updateConfig }) => {
  const { phases, currentPhase, autoProgress } = config;
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newPhase, setNewPhase] = useState({ name: '', duration: 5, color: '#3b82f6' });
  const intervalRef = useRef(null);
  const { play: playAlert } = useAudio('alert', { volume: 0.6 });

  // Total duration of all phases in minutes
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  // Duration up to current phase in minutes
  const durationUpToCurrentPhase = phases
    .slice(0, currentPhase)
    .reduce((sum, phase) => sum + phase.duration, 0);
  
  // Current phase duration in minutes
  const currentPhaseDuration = currentPhase < phases.length ? phases[currentPhase].duration : 0;
  
  // Calculate current phase progress percentage
  const phaseProgress = currentPhaseDuration > 0 
    ? Math.min(100, ((timeElapsed - durationUpToCurrentPhase * 60) / (currentPhaseDuration * 60)) * 100)
    : 0;

  // Calculate overall progress percentage
  const overallProgress = totalDuration > 0 
    ? Math.min(100, (timeElapsed / (totalDuration * 60)) * 100)
    : 0;

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/stop the timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Check if we should move to next phase
          if (autoProgress && currentPhase < phases.length) {
            const currentPhaseEndTime = (durationUpToCurrentPhase + currentPhaseDuration) * 60;
            
            if (newTime >= currentPhaseEndTime) {
              if (currentPhase < phases.length - 1) {
                // Move to next phase
                updateConfig({ currentPhase: currentPhase + 1 });
                playAlert();
              } else if (currentPhase === phases.length - 1) {
                // End of all phases
                clearInterval(intervalRef.current);
                setIsRunning(false);
                playAlert();
              }
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentPhase, phases, durationUpToCurrentPhase, currentPhaseDuration, autoProgress]);

  // Reset timer when phases change
  useEffect(() => {
    if (!isRunning) {
      setTimeElapsed(durationUpToCurrentPhase * 60);
    }
  }, [phases, currentPhase, durationUpToCurrentPhase]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    updateConfig({ currentPhase: 0 });
    setTimeElapsed(0);
  };

  const setPhase = (index) => {
    setIsRunning(false);
    updateConfig({ currentPhase: index });
    setTimeElapsed(phases.slice(0, index).reduce((sum, phase) => sum + phase.duration, 0) * 60);
  };

  const addPhase = () => {
    if (newPhase.name.trim() === '') return;
    
    updateConfig({
      phases: [...phases, { ...newPhase, duration: parseInt(newPhase.duration) }]
    });
    
    setNewPhase({ name: '', duration: 5, color: '#3b82f6' });
  };

  const removePhase = (index) => {
    const updatedPhases = [...phases];
    updatedPhases.splice(index, 1);
    
    updateConfig({ 
      phases: updatedPhases,
      currentPhase: currentPhase >= index && currentPhase > 0 ? currentPhase - 1 : currentPhase
    });
  };

  const startEditPhase = (index) => {
    setEditingPhase(index);
    setNewPhase({ ...phases[index] });
  };

  const saveEditPhase = () => {
    if (editingPhase === null || newPhase.name.trim() === '') return;
    
    const updatedPhases = [...phases];
    updatedPhases[editingPhase] = { 
      ...newPhase, 
      duration: parseInt(newPhase.duration) 
    };
    
    updateConfig({ phases: updatedPhases });
    setEditingPhase(null);
    setNewPhase({ name: '', duration: 5, color: '#3b82f6' });
  };

  const cancelEditPhase = () => {
    setEditingPhase(null);
    setNewPhase({ name: '', duration: 5, color: '#3b82f6' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {phases.length === 0 ? (
          <div className="text-center p-4">
            <p>No phases defined</p>
            <button 
              onClick={() => setShowSettings(true)}
              className="ncurses-button mt-2 cursor-pointer"
            >
              Add phases
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-bold">Current Phase: {currentPhase < phases.length ? phases[currentPhase].name : 'End'}</div>
                <div>{formatTime(timeElapsed)}</div>
              </div>
              
              <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-2 transition-all"
                  style={{ 
                    width: `${phaseProgress}%`,
                    backgroundColor: currentPhase < phases.length ? phases[currentPhase].color : '#888' 
                  }}
                ></div>
              </div>
              
              <div className="w-full bg-[#333] h-1 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-[#4ade80]"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4 max-h-28 overflow-y-auto">
              {phases.map((phase, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-2 rounded cursor-pointer 
                            ${currentPhase === index ? 'bg-[#333]' : 'hover:bg-[#222]'}`}
                  onClick={() => setPhase(index)}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: phase.color }}
                  ></div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className={currentPhase === index ? 'font-bold' : ''}>
                      {phase.name}
                    </div>
                    <div className="text-sm">{phase.duration} min</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              {isRunning ? (
                <button 
                  onClick={pauseTimer}
                  className="ncurses-button cursor-pointer"
                >
                  <FaPause className="mr-1" /> Pause
                </button>
              ) : (
                <button 
                  onClick={startTimer}
                  className="ncurses-button cursor-pointer"
                >
                  <FaPlay className="mr-1" /> Start
                </button>
              )}
              
              <button 
                onClick={resetTimer}
                className="ncurses-button cursor-pointer"
              >
                <FaStop className="mr-1" /> Reset
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          {showSettings ? 'Hide settings' : 'Show settings'}
        </button>
        
        {showSettings && (
          <div className="mt-2 p-2 bg-[#252525] rounded max-h-40 overflow-y-auto">
            <div className="mb-2">
              <label className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  checked={autoProgress}
                  onChange={() => updateConfig({ autoProgress: !autoProgress })}
                  className="mr-2"
                />
                <span>Auto progress through phases</span>
              </label>
            </div>
            
            <div className="mb-2">
              <h4 className="font-bold mb-1">Phases:</h4>
              {phases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between mb-1 p-1 hover:bg-[#333] rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: phase.color }}
                    ></div>
                    <span>{phase.name} ({phase.duration} min)</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditPhase(index)}
                      className="p-1 hover:text-[#4ade80] cursor-pointer"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => removePhase(index)}
                      className="p-1 hover:text-red-500 cursor-pointer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {editingPhase !== null ? (
              <div className="mb-2 p-2 border border-dashed border-[#444] rounded">
                <h4 className="font-bold mb-1">Edit Phase</h4>
                <input
                  type="text"
                  placeholder="Phase name"
                  value={newPhase.name}
                  onChange={(e) => setNewPhase({...newPhase, name: e.target.value})}
                  className="ncurses-input w-full mb-1"
                />
                <div className="flex mb-1">
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={newPhase.duration}
                    onChange={(e) => setNewPhase({...newPhase, duration: Math.max(1, parseInt(e.target.value) || 1)})}
                    className="ncurses-input w-1/2 mr-1"
                    min="1"
                  />
                  <input
                    type="color"
                    value={newPhase.color}
                    onChange={(e) => setNewPhase({...newPhase, color: e.target.value})}
                    className="w-1/2 h-8 bg-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={saveEditPhase}
                    className="ncurses-button flex-1 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditPhase}
                    className="ncurses-button flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 p-2 border border-dashed border-[#444] rounded">
                <h4 className="font-bold mb-1">Add New Phase</h4>
                <input
                  type="text"
                  placeholder="Phase name"
                  value={newPhase.name}
                  onChange={(e) => setNewPhase({...newPhase, name: e.target.value})}
                  className="ncurses-input w-full mb-1"
                />
                <div className="flex mb-1">
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={newPhase.duration}
                    onChange={(e) => setNewPhase({...newPhase, duration: Math.max(1, parseInt(e.target.value) || 1)})}
                    className="ncurses-input w-1/2 mr-1"
                    min="1"
                  />
                  <input
                    type="color"
                    value={newPhase.color}
                    onChange={(e) => setNewPhase({...newPhase, color: e.target.value})}
                    className="w-1/2 h-8 bg-transparent"
                  />
                </div>
                <button
                  onClick={addPhase}
                  className="ncurses-button w-full cursor-pointer"
                >
                  <FaPlus className="mr-1" /> Add Phase
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPhases;