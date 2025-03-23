import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

const Scoreboard = ({ config, updateConfig }) => {
  const { teams } = config;
  const [showSettings, setShowSettings] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', score: 0, color: '#3b82f6' });
  const [editingTeam, setEditingTeam] = useState(null);

  const handleScoreChange = (index, change) => {
    const updatedTeams = [...teams];
    updatedTeams[index].score = Math.max(0, updatedTeams[index].score + change);
    updateConfig({ teams: updatedTeams });
  };

  const addTeam = () => {
    if (newTeam.name.trim() === '') return;
    
    updateConfig({
      teams: [...teams, { ...newTeam, score: parseInt(newTeam.score) || 0 }]
    });
    
    setNewTeam({ name: '', score: 0, color: '#3b82f6' });
  };

  const removeTeam = (index) => {
    const updatedTeams = [...teams];
    updatedTeams.splice(index, 1);
    updateConfig({ teams: updatedTeams });
  };

  const startEditTeam = (index) => {
    setEditingTeam(index);
    setNewTeam({ ...teams[index] });
  };

  const saveEditTeam = () => {
    if (editingTeam === null || newTeam.name.trim() === '') return;
    
    const updatedTeams = [...teams];
    updatedTeams[editingTeam] = { 
      ...newTeam, 
      score: parseInt(newTeam.score) || 0
    };
    
    updateConfig({ teams: updatedTeams });
    setEditingTeam(null);
    setNewTeam({ name: '', score: 0, color: '#3b82f6' });
  };

  const resetScores = () => {
    const updatedTeams = teams.map(team => ({ ...team, score: 0 }));
    updateConfig({ teams: updatedTeams });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {teams.length === 0 ? (
          <div className="text-center p-4">
            <p>No teams defined</p>
            <button 
              onClick={() => setShowSettings(true)}
              className="ncurses-button mt-2 cursor-pointer"
            >
              Add teams
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div 
                key={index}
                className="p-2 rounded"
                style={{ backgroundColor: `${team.color}20` }} // Using hex color with transparency
              >
                <div className="flex justify-between items-center mb-1">
                  <div 
                    className="font-bold flex items-center"
                    style={{ color: team.color }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: team.color }}
                    ></div>
                    {team.name}
                  </div>
                  <div className="text-2xl font-mono">{team.score}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleScoreChange(index, -1)}
                    className="ncurses-button cursor-pointer"
                    disabled={team.score <= 0}
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => handleScoreChange(index, 1)}
                    className="ncurses-button cursor-pointer"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-4">
              <button
                onClick={resetScores}
                className="ncurses-button cursor-pointer"
              >
                Reset All Scores
              </button>
            </div>
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
          <div className="mt-2 p-2 bg-[#252525] rounded max-h-40 overflow-y-auto">
            <div className="mb-2">
              <h4 className="font-bold mb-1">Teams:</h4>
              {teams.map((team, index) => (
                <div key={index} className="flex items-center justify-between mb-1 p-1 hover:bg-[#333] rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <span>{team.name} ({team.score})</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditTeam(index)}
                      className="p-1 hover:text-[#4ade80] cursor-pointer"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => removeTeam(index)}
                      className="p-1 hover:text-red-500 cursor-pointer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {editingTeam !== null ? (
              <div className="p-2 border border-dashed border-[#444] rounded mb-2">
                <h4 className="font-bold mb-1">Edit Team</h4>
                <div className="flex mb-1 space-x-1">
                  <input
                    type="text"
                    placeholder="Team name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className="ncurses-input flex-1"
                  />
                  <input
                    type="color"
                    value={newTeam.color}
                    onChange={(e) => setNewTeam({...newTeam, color: e.target.value})}
                    className="w-10 h-8 bg-transparent"
                  />
                </div>
                <button
                  onClick={saveEditTeam}
                  className="ncurses-button w-full cursor-pointer"
                >
                  <FaCheck className="mr-1" /> Save Changes
                </button>
              </div>
            ) : (
              <div className="p-2 border border-dashed border-[#444] rounded">
                <h4 className="font-bold mb-1">Add New Team</h4>
                <div className="flex mb-1 space-x-1">
                  <input
                    type="text"
                    placeholder="Team name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className="ncurses-input flex-1"
                  />
                  <input
                    type="color"
                    value={newTeam.color}
                    onChange={(e) => setNewTeam({...newTeam, color: e.target.value})}
                    className="w-10 h-8 bg-transparent"
                  />
                </div>
                <button
                  onClick={addTeam}
                  className="ncurses-button w-full cursor-pointer"
                >
                  <FaPlus className="mr-1" /> Add Team
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;