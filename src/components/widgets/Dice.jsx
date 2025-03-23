import React, { useState } from 'react';
import { FaDice } from 'react-icons/fa';

const Dice = ({ config, updateConfig }) => {
  const { numberOfDice = 1, sides = 6 } = config;
  const [results, setResults] = useState(Array(numberOfDice).fill(1));
  const [rolling, setRolling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    
    // Animate rolling for a short time
    const rollInterval = setInterval(() => {
      const newResults = Array(numberOfDice)
        .fill(0)
        .map(() => Math.floor(Math.random() * sides) + 1);
      setResults(newResults);
    }, 50);
    
    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      setRolling(false);
    }, 1000);
  };

  const updateNumberOfDice = (value) => {
    const newValue = Math.max(1, Math.min(5, parseInt(value) || 1));
    updateConfig({ numberOfDice: newValue });
    
    // Adjust results array size
    if (newValue > results.length) {
      setResults([...results, ...Array(newValue - results.length).fill(1)]);
    } else if (newValue < results.length) {
      setResults(results.slice(0, newValue));
    }
  };

  const updateSides = (value) => {
    const newValue = Math.max(2, parseInt(value) || 6);
    updateConfig({ sides: newValue });
  };

  // Generate dice face display
  const renderDiceFace = (value) => {
    if (sides === 6) {
      // Visual representation for standard 6-sided dice
      switch (value) {
        case 1:
          return (
            <div className="grid place-items-center h-full">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          );
        case 2:
          return (
            <div className="grid grid-cols-2 h-full">
              <div className="flex justify-center items-start pt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex justify-center items-end pb-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="grid grid-cols-3 grid-rows-3 h-full">
              <div className="col-start-1 row-start-1 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-2 row-start-2 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-3 row-start-3 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="grid grid-cols-2 grid-rows-2 h-full">
              <div className="flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="grid grid-cols-3 grid-rows-3 h-full">
              <div className="col-start-1 row-start-1 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-3 row-start-1 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-2 row-start-2 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-1 row-start-3 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="col-start-3 row-start-3 flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          );
        case 6:
          return (
            <div className="grid grid-cols-2 grid-rows-3 h-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center items-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ))}
            </div>
          );
        default:
          return <div className="text-center font-bold text-lg">{value}</div>;
      }
    } else {
      // Simple number display for non-standard dice
      return <div className="text-center font-bold text-lg">{value}</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
          {results.map((result, index) => (
            <div 
              key={index}
              className={`w-14 h-14 bg-[#f43f5e] rounded-lg flex items-center justify-center 
                         shadow-md border-2 border-[#222] ${rolling ? 'animate-spin-slow' : ''}`}
            >
              {renderDiceFace(result)}
            </div>
          ))}
        </div>
        
        <div className="text-lg font-bold mb-4">
          Total: {results.reduce((sum, value) => sum + value, 0)}
        </div>
        
        <button 
          onClick={rollDice}
          className="ncurses-button text-lg px-6 py-2 cursor-pointer"
          disabled={rolling}
        >
          <FaDice className="mr-2 inline" /> Roll{numberOfDice > 1 ? ' Dice' : ' Die'}
        </button>
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
              <div>Number of dice:</div>
              <div className="flex items-center">
                <button 
                  onClick={() => updateNumberOfDice(numberOfDice - 1)}
                  className="ncurses-button cursor-pointer"
                  disabled={numberOfDice <= 1}
                >
                  -
                </button>
                <span className="mx-2">{numberOfDice}</span>
                <button 
                  onClick={() => updateNumberOfDice(numberOfDice + 1)}
                  className="ncurses-button cursor-pointer"
                  disabled={numberOfDice >= 5}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>Number of sides:</div>
              <div className="flex items-center">
                <select
                  value={sides}
                  onChange={(e) => updateSides(parseInt(e.target.value))}
                  className="ncurses-input cursor-pointer"
                >
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dice;