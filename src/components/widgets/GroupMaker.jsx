import React, { useState } from 'react';
import { FaRandom, FaPlus, FaTimes } from 'react-icons/fa';

const GroupMaker = ({ config, updateConfig }) => {
  const { students = [], numberOfGroups = 2 } = config;
  const [inputName, setInputName] = useState('');
  const [groups, setGroups] = useState([]);
  const [showGroups, setShowGroups] = useState(false);

  const addStudent = () => {
    if (inputName.trim() === '') return;
    
    const updatedStudents = [...students, inputName.trim()];
    updateConfig({ students: updatedStudents });
    setInputName('');
  };

  const removeStudent = (index) => {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1);
    updateConfig({ students: updatedStudents });
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      addStudent();
    }
  };

  const updateNumberOfGroups = (value) => {
    const newValue = Math.max(2, Math.min(10, parseInt(value) || 2));
    updateConfig({ numberOfGroups: newValue });
  };

  const createGroups = () => {
    if (students.length === 0) return;
    
    // Shuffle the students array
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    
    // Create empty groups
    const newGroups = Array.from({ length: numberOfGroups }, () => []);
    
    // Distribute students among groups
    shuffled.forEach((student, index) => {
      const groupIndex = index % numberOfGroups;
      newGroups[groupIndex].push(student);
    });
    
    setGroups(newGroups);
    setShowGroups(true);
  };

  const importStudents = () => {
    try {
      const input = prompt('Enter student names separated by commas or new lines:');
      if (!input) return;
      
      // Split by commas or new lines and trim whitespace
      const newStudents = input
        .split(/[,\n]/)
        .map(name => name.trim())
        .filter(name => name !== '');
      
      updateConfig({ students: newStudents });
    } catch (error) {
      console.error('Error importing students:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {showGroups ? (
          <div>
            <h3 className="font-bold mb-2">Groups</h3>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {groups.map((group, index) => (
                <div key={index} className="p-2 bg-[#222] rounded">
                  <div className="font-bold mb-1">Group {index + 1}</div>
                  <div className="pl-2 text-sm">
                    {group.map((student, i) => (
                      <div key={i}>{student}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGroups(false)}
              className="ncurses-button mt-3 w-full cursor-pointer"
            >
              Back to Setup
            </button>
          </div>
        ) : (
          <div>
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Add student name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={handleInputKeyPress}
                className="ncurses-input flex-1 mr-1"
              />
              <button
                onClick={addStudent}
                className="ncurses-button cursor-pointer"
              >
                <FaPlus />
              </button>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold">Students: {students.length}</div>
              <button
                onClick={importStudents}
                className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer"
              >
                Import list
              </button>
            </div>
            
            <div className="max-h-20 overflow-y-auto mb-3">
              {students.length === 0 ? (
                <div className="text-gray-500 text-center text-sm p-2">
                  Add students to create groups
                </div>
              ) : (
                <div className="space-y-1">
                  {students.map((student, index) => (
                    <div key={index} className="flex justify-between items-center p-1 hover:bg-[#222] rounded">
                      <div>{student}</div>
                      <button
                        onClick={() => removeStudent(index)}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>Number of groups:</div>
              <div className="flex items-center">
                <button
                  onClick={() => updateNumberOfGroups(numberOfGroups - 1)}
                  className="ncurses-button cursor-pointer"
                  disabled={numberOfGroups <= 2}
                >
                  -
                </button>
                <span className="mx-2">{numberOfGroups}</span>
                <button
                  onClick={() => updateNumberOfGroups(numberOfGroups + 1)}
                  className="ncurses-button cursor-pointer"
                  disabled={numberOfGroups >= 10}
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={createGroups}
              className="ncurses-button w-full cursor-pointer"
              disabled={students.length === 0}
            >
              <FaRandom className="mr-1" /> Create Random Groups
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMaker;