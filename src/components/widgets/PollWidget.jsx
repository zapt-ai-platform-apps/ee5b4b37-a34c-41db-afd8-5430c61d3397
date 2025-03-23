import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheck, FaRedo } from 'react-icons/fa';

const PollWidget = ({ config, updateConfig }) => {
  const { question, options } = config;
  const [votes, setVotes] = useState(new Array(options.length).fill(0));
  const [newQuestion, setNewQuestion] = useState(question);
  const [newOption, setNewOption] = useState('');
  const [editingOptions, setEditingOptions] = useState([...options]);
  const [isEditing, setIsEditing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalVotes = votes.reduce((sum, count) => sum + count, 0);

  const handleVote = (index) => {
    if (showResults) return;
    
    const newVotes = [...votes];
    newVotes[index]++;
    setVotes(newVotes);
    setShowResults(true);
  };

  const resetPoll = () => {
    setVotes(new Array(options.length).fill(0));
    setShowResults(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setNewQuestion(question);
    setEditingOptions([...options]);
  };

  const addOption = () => {
    if (newOption.trim() === '') return;
    setEditingOptions([...editingOptions, newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (index) => {
    const updatedOptions = [...editingOptions];
    updatedOptions.splice(index, 1);
    setEditingOptions(updatedOptions);
  };

  const savePoll = () => {
    if (newQuestion.trim() === '' || editingOptions.length < 2) return;
    
    updateConfig({
      question: newQuestion.trim(),
      options: [...editingOptions]
    });
    
    setVotes(new Array(editingOptions.length).fill(0));
    setShowResults(false);
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col">
      {isEditing ? (
        <div className="flex-1">
          <div className="mb-3">
            <label className="block mb-1 font-bold">Question:</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="ncurses-input w-full"
              placeholder="Enter your question"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 font-bold">Options:</label>
            {editingOptions.map((option, index) => (
              <div key={index} className="flex mb-1">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updated = [...editingOptions];
                    updated[index] = e.target.value;
                    setEditingOptions(updated);
                  }}
                  className="ncurses-input flex-1 mr-1"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="ncurses-button text-red-500 cursor-pointer"
                  disabled={editingOptions.length <= 2}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex mb-3">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="ncurses-input flex-1 mr-1"
              placeholder="Add new option"
              onKeyPress={(e) => e.key === 'Enter' && addOption()}
            />
            <button
              onClick={addOption}
              className="ncurses-button cursor-pointer"
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={savePoll}
              className="ncurses-button flex-1 cursor-pointer"
              disabled={newQuestion.trim() === '' || editingOptions.length < 2}
            >
              <FaCheck className="mr-1" /> Save Poll
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ncurses-button flex-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-3">{question}</h3>
          
          <div className="space-y-2 mb-4">
            {options.map((option, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => handleVote(index)}
                  className={`w-full text-left p-2 rounded ${
                    showResults ? 'bg-[#222] cursor-default' : 'hover:bg-[#333] cursor-pointer'
                  }`}
                  disabled={showResults}
                >
                  {option}
                </button>
                
                {showResults && (
                  <div className="mt-1">
                    <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4ade80]"
                        style={{ 
                          width: totalVotes > 0 ? `${(votes[index] / totalVotes) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-0.5">
                      {votes[index]} vote{votes[index] !== 1 ? 's' : ''} 
                      ({totalVotes > 0 ? Math.round((votes[index] / totalVotes) * 100) : 0}%)
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {showResults && (
              <button
                onClick={resetPoll}
                className="ncurses-button flex-1 cursor-pointer"
              >
                <FaRedo className="mr-1" /> Reset
              </button>
            )}
            <button
              onClick={startEditing}
              className="ncurses-button flex-1 cursor-pointer"
            >
              Edit Poll
            </button>
          </div>
          
          {showResults && (
            <div className="mt-2 text-center text-sm">
              Total votes: {totalVotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollWidget;