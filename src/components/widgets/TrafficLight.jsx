import React, { useEffect } from 'react';
import useAudio from '../../hooks/useAudio';

const TrafficLight = ({ config, updateConfig }) => {
  const { state, sound } = config;
  
  const { play: playRed } = useAudio('redLight', { volume: 0.6 });
  const { play: playYellow } = useAudio('yellowLight', { volume: 0.6 });
  const { play: playGreen } = useAudio('greenLight', { volume: 0.6 });

  useEffect(() => {
    if (sound) {
      if (state === 'red') playRed();
      if (state === 'yellow') playYellow();
      if (state === 'green') playGreen();
    }
  }, [state, sound]);

  const handleStateChange = (newState) => {
    updateConfig({ state: newState });
  };

  const getStateDescription = () => {
    switch (state) {
      case 'red':
        return 'Absolute silence (individual work)';
      case 'yellow':
        return 'Whispered consultation or quiet collaboration';
      case 'green':
        return 'Free discussion and collaboration';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <h3 className="font-bold">{getStateDescription()}</h3>
      </div>
      
      <div className="traffic-light p-4 border border-[#333] rounded-lg bg-[#222] flex flex-col items-center gap-4 mb-4">
        <button
          onClick={() => handleStateChange('red')}
          className={`w-16 h-16 rounded-full ${state === 'red' ? 'bg-red-600 ring-4 ring-red-300' : 'bg-red-900'} cursor-pointer transition-all`}
          aria-label="Red - Absolute silence"
        ></button>
        
        <button
          onClick={() => handleStateChange('yellow')}
          className={`w-16 h-16 rounded-full ${state === 'yellow' ? 'bg-yellow-500 ring-4 ring-yellow-200' : 'bg-yellow-900'} cursor-pointer transition-all`}
          aria-label="Yellow - Whispered consultation"
        ></button>
        
        <button
          onClick={() => handleStateChange('green')}
          className={`w-16 h-16 rounded-full ${state === 'green' ? 'bg-green-500 ring-4 ring-green-200' : 'bg-green-900'} cursor-pointer transition-all`}
          aria-label="Green - Free discussion"
        ></button>
      </div>
      
      <div className="flex items-center">
        <div className="mr-2">Sound:</div>
        <label className="switch-container">
          <input 
            type="checkbox" 
            checked={sound}
            onChange={() => updateConfig({ sound: !sound })}
            className="sr-only"
          />
          <div className={`switch ${sound ? 'bg-[#4ade80]' : 'bg-[#333]'} w-10 h-5 rounded-full p-1 transition-colors cursor-pointer`}>
            <div className={`switch-toggle h-3 w-3 bg-white rounded-full transform transition-transform ${sound ? 'translate-x-5' : ''}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TrafficLight;