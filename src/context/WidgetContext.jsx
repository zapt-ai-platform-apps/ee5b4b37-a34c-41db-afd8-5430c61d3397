import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WidgetContext = createContext();

export const WIDGET_TYPES = {
  COUNTDOWN: 'countdown',
  TRAFFIC_LIGHT: 'trafficLight',
  SOUND_METER: 'soundMeter',
  LESSON_PHASES: 'lessonPhases',
  SCOREBOARD: 'scoreboard',
  GROUP_MAKER: 'groupMaker',
  DICE: 'dice',
  VISUAL_TIMER: 'visualTimer',
  STOPWATCH: 'stopwatch',
  EMBED: 'embed',
  QR_CODE: 'qrCode',
  TEXT: 'text',
  POLL: 'poll',
  WORK_SYMBOLS: 'workSymbols'
};

export function WidgetProvider({ children }) {
  // List of available widget definitions
  const [widgetDefinitions] = useState([
    {
      type: WIDGET_TYPES.COUNTDOWN,
      name: 'Countdown Timer',
      description: 'Customizable countdown timer with sound alerts',
      defaultSize: { width: 300, height: 200 },
      defaultConfig: {
        minutes: 5,
        seconds: 0,
        alert: true,
        autoStart: false
      }
    },
    {
      type: WIDGET_TYPES.TRAFFIC_LIGHT,
      name: 'Traffic Light',
      description: 'Visual indicator for classroom noise levels',
      defaultSize: { width: 200, height: 300 },
      defaultConfig: {
        state: 'green', // green, yellow, red
        sound: true
      }
    },
    {
      type: WIDGET_TYPES.SOUND_METER,
      name: 'Sound Meter',
      description: 'Measures and displays classroom noise level',
      defaultSize: { width: 300, height: 200 },
      defaultConfig: {
        sensitivity: 5,
        threshold: 7,
        enabled: false
      }
    },
    {
      type: WIDGET_TYPES.LESSON_PHASES,
      name: 'Lesson Phases',
      description: 'Timeline of lesson phases with automatic progression',
      defaultSize: { width: 400, height: 250 },
      defaultConfig: {
        phases: [
          { name: 'Introduction', duration: 5, color: '#3b82f6' },
          { name: 'Main Activity', duration: 15, color: '#10b981' },
          { name: 'Discussion', duration: 10, color: '#f59e0b' },
          { name: 'Conclusion', duration: 5, color: '#ef4444' }
        ],
        currentPhase: 0,
        autoProgress: true
      }
    },
    {
      type: WIDGET_TYPES.SCOREBOARD,
      name: 'Scoreboard',
      description: 'Keep track of team scores',
      defaultSize: { width: 300, height: 250 },
      defaultConfig: {
        teams: [
          { name: 'Team 1', score: 0, color: '#3b82f6' },
          { name: 'Team 2', score: 0, color: '#ef4444' }
        ]
      }
    },
    {
      type: WIDGET_TYPES.GROUP_MAKER,
      name: 'Group Maker',
      description: 'Create random groups from a list of students',
      defaultSize: { width: 350, height: 300 },
      defaultConfig: {
        students: [],
        numberOfGroups: 2
      }
    },
    {
      type: WIDGET_TYPES.DICE,
      name: 'Dice',
      description: 'Roll virtual dice',
      defaultSize: { width: 200, height: 200 },
      defaultConfig: {
        numberOfDice: 1,
        sides: 6
      }
    },
    {
      type: WIDGET_TYPES.STOPWATCH,
      name: 'Stopwatch',
      description: 'Measure elapsed time',
      defaultSize: { width: 240, height: 180 },
      defaultConfig: {
        laps: false
      }
    },
    {
      type: WIDGET_TYPES.TEXT,
      name: 'Text',
      description: 'Display custom text',
      defaultSize: { width: 300, height: 200 },
      defaultConfig: {
        text: 'Enter your text here',
        fontSize: 16,
        alignment: 'left'
      }
    },
    {
      type: WIDGET_TYPES.POLL,
      name: 'Poll',
      description: 'Create a quick poll',
      defaultSize: { width: 350, height: 300 },
      defaultConfig: {
        question: 'Your question?',
        options: ['Option 1', 'Option 2']
      }
    }
  ]);

  // Function to create a new widget instance
  const createWidgetInstance = (type) => {
    const definition = widgetDefinitions.find(d => d.type === type);
    if (!definition) return null;

    return {
      id: uuidv4(),
      type,
      name: definition.name,
      position: { x: 50, y: 50 },
      size: { ...definition.defaultSize },
      config: { ...definition.defaultConfig },
      isMinimized: false
    };
  };

  return (
    <WidgetContext.Provider value={{
      widgetDefinitions,
      createWidgetInstance
    }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}