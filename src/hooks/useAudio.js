import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const audioFiles = {
  timerEnd: '/sounds/timer-end.mp3',
  click: '/sounds/click.mp3',
  alert: '/sounds/alert.mp3',
  success: '/sounds/success.mp3',
  redLight: '/sounds/red-light.mp3',
  yellowLight: '/sounds/yellow-light.mp3',
  greenLight: '/sounds/green-light.mp3',
};

export default function useAudio(soundName, options = {}) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { volume = 1, loop = false, autoplay = false } = options;

  useEffect(() => {
    try {
      // Create audio element
      const audioElement = new Audio(audioFiles[soundName]);
      audioElement.volume = volume;
      audioElement.loop = loop;
      
      // Set up event listeners
      audioElement.addEventListener('play', () => setIsPlaying(true));
      audioElement.addEventListener('pause', () => setIsPlaying(false));
      audioElement.addEventListener('ended', () => setIsPlaying(false));
      
      setAudio(audioElement);
      
      if (autoplay) {
        audioElement.play().catch(error => {
          // Browser may prevent autoplay
          console.log('Autoplay prevented:', error);
        });
      }
      
      // Cleanup
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('play', () => setIsPlaying(true));
        audioElement.removeEventListener('pause', () => setIsPlaying(false));
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      };
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error initializing audio:', error);
    }
  }, [soundName, volume, loop, autoplay]);
  
  const play = () => {
    if (audio) {
      // Reset to beginning to ensure it plays even if already ended
      audio.currentTime = 0;
      audio.play().catch(error => {
        Sentry.captureException(error);
        console.error('Error playing audio:', error);
      });
    }
  };
  
  const pause = () => {
    if (audio) audio.pause();
  };
  
  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  const setAudioVolume = (newVolume) => {
    if (audio) audio.volume = Math.max(0, Math.min(1, newVolume));
  };
  
  return { play, pause, stop, togglePlay, isPlaying, setVolume: setAudioVolume };
}