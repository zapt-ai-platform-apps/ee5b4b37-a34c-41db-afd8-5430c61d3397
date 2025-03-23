import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaFlag } from 'react-icons/fa';

const Stopwatch = ({ config, updateConfig }) => {
  const { laps: showLaps } = config;
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (timeMs) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning) {
      setLaps([...laps, { time, formattedTime: formatTime(time) }]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="text-center">
          <div className="text-4xl font-mono mb-4">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center space-x-2 mb-4">
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
            
            {showLaps && (
              <button 
                onClick={addLap}
                className="ncurses-button cursor-pointer"
                disabled={!isRunning}
              >
                <FaFlag className="mr-1" /> Lap
              </button>
            )}
          </div>
          
          {showLaps && laps.length > 0 && (
            <div className="mt-2">
              <h3 className="font-bold mb-1">Laps</h3>
              <div className="max-h-20 overflow-y-auto border border-[#333] rounded p-1">
                {laps.map((lap, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-[#333] last:border-b-0">
                    <span>Lap {index + 1}</span>
                    <span>{lap.formattedTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          {showSettings ? 'Hide settings' : 'Show settings'}
        </button>
        
        {showSettings && (
          <div className="mt-2 p-2 bg-[#252525] rounded">
            <div className="flex items-center justify-between">
              <div>Show laps:</div>
              <label className="switch-container">
                <input 
                  type="checkbox" 
                  checked={showLaps}
                  onChange={() => updateConfig({ laps: !showLaps })}
                  className="sr-only"
                />
                <div className={`switch ${showLaps ? 'bg-[#4ade80]' : 'bg-[#333]'} w-10 h-5 rounded-full p-1 transition-colors cursor-pointer`}>
                  <div className={`switch-toggle h-3 w-3 bg-white rounded-full transform transition-transform ${showLaps ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;