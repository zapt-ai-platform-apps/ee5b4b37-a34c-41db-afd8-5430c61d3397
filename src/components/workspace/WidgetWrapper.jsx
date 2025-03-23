import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { WIDGET_TYPES } from '../../context/WidgetContext';
import CountdownTimer from '../widgets/CountdownTimer';
import TrafficLight from '../widgets/TrafficLight';
import SoundMeter from '../widgets/SoundMeter';
import LessonPhases from '../widgets/LessonPhases';
import Scoreboard from '../widgets/Scoreboard';
import GroupMaker from '../widgets/GroupMaker';
import Dice from '../widgets/Dice';
import Stopwatch from '../widgets/Stopwatch';
import TextWidget from '../widgets/TextWidget';
import PollWidget from '../widgets/PollWidget';
import { FaTimes, FaMinus, FaExpand, FaCog } from 'react-icons/fa';

const WidgetWrapper = ({ widget, updateWidget, removeWidget }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    updateWidget({
      ...widget,
      position: { x: data.x, y: data.y }
    });
  };

  const toggleMinimize = () => {
    updateWidget({
      ...widget,
      isMinimized: !widget.isMinimized
    });
  };

  const updateWidgetConfig = (newConfig) => {
    updateWidget({
      ...widget,
      config: { ...widget.config, ...newConfig }
    });
  };

  // Render the actual widget content based on widget type
  const renderWidgetContent = () => {
    if (widget.isMinimized) return null;

    switch (widget.type) {
      case WIDGET_TYPES.COUNTDOWN:
        return <CountdownTimer config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.TRAFFIC_LIGHT:
        return <TrafficLight config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.SOUND_METER:
        return <SoundMeter config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.LESSON_PHASES:
        return <LessonPhases config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.SCOREBOARD:
        return <Scoreboard config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.GROUP_MAKER:
        return <GroupMaker config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.DICE:
        return <Dice config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.STOPWATCH:
        return <Stopwatch config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.TEXT:
        return <TextWidget config={widget.config} updateConfig={updateWidgetConfig} />;
      case WIDGET_TYPES.POLL:
        return <PollWidget config={widget.config} updateConfig={updateWidgetConfig} />;
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <Draggable
      handle=".widget-drag-handle"
      defaultPosition={widget.position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div 
        className={`widget ${isDragging ? 'dragging' : ''}`}
        style={{
          width: widget.isMinimized ? 200 : widget.size.width,
          height: widget.isMinimized ? 'auto' : widget.size.height,
          minHeight: widget.isMinimized ? 'auto' : 80
        }}
      >
        <div className="widget-header widget-drag-handle flex justify-between cursor-move">
          <div className="truncate">{widget.name}</div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsConfigOpen(!isConfigOpen);
              }}
              className="p-1 hover:text-[#4ade80] cursor-pointer"
              aria-label="Settings"
              title="Settings"
            >
              <FaCog size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize();
              }}
              className="p-1 hover:text-[#f59e0b] cursor-pointer"
              aria-label={widget.isMinimized ? "Expand" : "Minimize"}
              title={widget.isMinimized ? "Expand" : "Minimize"}
            >
              {widget.isMinimized ? <FaExpand size={14} /> : <FaMinus size={14} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(widget.id);
              }}
              className="p-1 hover:text-[#ef4444] cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
        
        <div className="widget-content">
          {renderWidgetContent()}
        </div>
      </div>
    </Draggable>
  );
};

export default WidgetWrapper;