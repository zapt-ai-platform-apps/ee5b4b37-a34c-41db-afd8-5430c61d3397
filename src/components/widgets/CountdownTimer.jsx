import React, { useState, useEffect, useRef } from 'react';
import useAudio from '../../hooks/useAudio';
import { FaPlay, FaPause, FaStop, FaPlus, FaMinus } from 'react-icons/fa';

const CountdownTimer = ({ config, updateConfig }) => {
  const [timeLeft, setTimeLeft] = useState(config.minutes * 60 + config.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const { play: playAlarm } = useAudio('timerEnd', { volume: 0.7 });

  // Initialize timer when config changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(config.minutes * 60 + config.seconds);
    }
  }, [config.minutes, config.seconds, isRunning]);

  // Handle auto start
  useEffect(() => {
    if (config.autoStart && !isRunning && timeLeft > 0) {
      startTimer();
    }
    
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [config.autoStart]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer controls
  const startTimer = () => {
    if (timeLeft <= 0) return;
    
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (config.alert) {
            playAlarm();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(config.minutes * 60 + config.seconds);
  };

  const adjustTime = (minutes, seconds) => {
    const newConfig = {
      minutes: Math.max(0, config.minutes + minutes),
      seconds: Math.max(0, config.seconds + seconds) % 60
    };
    
    updateConfig(newConfig);
    
    if (!isRunning) {
      setTimeLeft(newConfig.minutes * 60 + newConfig.seconds);
    }
  };

  // Calculate progress percentage
  const totalTime = config.minutes * 60 + config.seconds;
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  // Handle time adjustment during running timer
  const addTime = (seconds) => {
    setTimeLeft(prevTime => Math.max(0, prevTime + seconds));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-4xl font-mono mb-4">{formatTime(timeLeft)}</div>
        
        <div className="w-full bg-[#333] h-2 rounded-full mb-4">
          <div 
            className="bg-[#4ade80] h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
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
              disabled={timeLeft <= 0}
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
        
        {isRunning && (
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => addTime(-60)}
              className="ncurses-button cursor-pointer"
              disabled={timeLeft < 60}
            >
              <FaMinus className="mr-1" /> 1min
            </button>
            <button 
              onClick={() => addTime(60)}
              className="ncurses-button cursor-pointer"
            >
              <FaPlus className="mr-1" /> 1min
            </button>
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
        
        {showSettings && (
          <div className="mt-2 p-2 bg-[#252525] rounded">
            <div className="flex items-center justify-between mb-2">
              <div>Minutes:</div>
              <div className="flex items-center">
                <button 
                  onClick={() => adjustTime(-1, 0)}
                  className="ncurses-button cursor-pointer"
                  disabled={config.minutes <= 0}
                >
                  <FaMinus />
                </button>
                <span className="mx-2">{config.minutes}</span>
                <button 
                  onClick={() => adjustTime(1, 0)}
                  className="ncurses-button cursor-pointer"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div>Seconds:</div>
              <div className="flex items-center">
                <button 
                  onClick={() => adjustTime(0, -5)}
                  className="ncurses-button cursor-pointer"
                  disabled={config.seconds <= 0 && config.minutes <= 0}
                >
                  <FaMinus />
                </button>
                <span className="mx-2">{config.seconds}</span>
                <button 
                  onClick={() => adjustTime(0, 5)}
                  className="ncurses-button cursor-pointer"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>Sound alert:</div>
              <label className="switch-container">
                <input 
                  type="checkbox" 
                  checked={config.alert}
                  onChange={() => updateConfig({ alert: !config.alert })}
                  className="sr-only"
                />
                <div className={`switch ${config.alert ? 'bg-[#4ade80]' : 'bg-[#333]'} w-10 h-5 rounded-full p-1 transition-colors cursor-pointer`}>
                  <div className={`switch-toggle h-3 w-3 bg-white rounded-full transform transition-transform ${config.alert ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div>Auto-start:</div>
              <label className="switch-container">
                <input 
                  type="checkbox" 
                  checked={config.autoStart}
                  onChange={() => updateConfig({ autoStart: !config.autoStart })}
                  className="sr-only"
                />
                <div className={`switch ${config.autoStart ? 'bg-[#4ade80]' : 'bg-[#333]'} w-10 h-5 rounded-full p-1 transition-colors cursor-pointer`}>
                  <div className={`switch-toggle h-3 w-3 bg-white rounded-full transform transition-transform ${config.autoStart ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;