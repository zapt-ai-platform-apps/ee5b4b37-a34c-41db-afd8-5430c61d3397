import React, { useState, useEffect } from 'react';
import useMicrophone from '../../hooks/useMicrophone';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import useAudio from '../../hooks/useAudio';

const SoundMeter = ({ config, updateConfig }) => {
  const { sensitivity = 5, threshold = 7, enabled = false } = config;
  const [showSettings, setShowSettings] = useState(false);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const { isListening, volume, error, startListening, stopListening } = useMicrophone(sensitivity);
  const { play: playAlert } = useAudio('alert', { volume: 0.6 });

  useEffect(() => {
    if (enabled && !isListening) {
      startListening();
    } else if (!enabled && isListening) {
      stopListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [enabled, isListening]);

  // Check if volume is above threshold
  useEffect(() => {
    const newIsAboveThreshold = volume > threshold;
    
    if (newIsAboveThreshold && !isAboveThreshold) {
      // Volume just exceeded threshold
      playAlert();
    }
    
    setIsAboveThreshold(newIsAboveThreshold);
  }, [volume, threshold]);

  const getVolumeColor = () => {
    if (volume < threshold * 0.5) return 'bg-green-500';
    if (volume < threshold) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleSensitivityChange = (value) => {
    const newSensitivity = Math.max(1, Math.min(10, value));
    updateConfig({ sensitivity: newSensitivity });
  };

  const handleThresholdChange = (value) => {
    const newThreshold = Math.max(1, Math.min(10, value));
    updateConfig({ threshold: newThreshold });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {error && (
          <div className="text-red-500 mb-2 text-sm">
            Error: {error}. Please allow microphone access.
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">Current Sound Level</div>
          <button
            onClick={() => updateConfig({ enabled: !enabled })}
            className="ncurses-button cursor-pointer"
          >
            {enabled ? (
              <><FaMicrophoneSlash className="mr-1" /> Disable</>
            ) : (
              <><FaMicrophone className="mr-1" /> Enable</>
            )}
          </button>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-[#222] h-6 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${getVolumeColor()}`}
              style={{ width: `${(volume / 10) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Quiet</span>
            <span>Moderate</span>
            <span>Loud</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between">
            <span>Threshold Level:</span>
            <span>{threshold}/10</span>
          </div>
          <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-red-500 h-full"
              style={{ width: `${(threshold / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {isAboveThreshold && enabled && (
          <div className="text-red-500 font-bold text-center p-2 bg-[#331111] rounded-md mt-2 animate-pulse">
            Noise level exceeded threshold!
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
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span>Sensitivity:</span>
                <span>{sensitivity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sensitivity}
                onChange={(e) => handleSensitivityChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Threshold:</span>
                <span>{threshold}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={threshold}
                onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundMeter;