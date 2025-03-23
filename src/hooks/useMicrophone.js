import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

export default function useMicrophone(sensitivity = 5) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const startListening = async () => {
    try {
      if (!navigator.mediaDevices) {
        throw new Error('Media devices API not supported');
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(audioStream);
      
      microphone.connect(analyserNode);
      analyserNode.fftSize = 256;
      
      setStream(audioStream);
      setAnalyser(analyserNode);
      setIsListening(true);
      setError(null);
      
      // Start processing audio data
      processAudio(analyserNode, sensitivity);
    } catch (err) {
      Sentry.captureException(err);
      console.error('Error accessing microphone:', err);
      setError(err.message);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setAnalyser(null);
      setIsListening(false);
      setVolume(0);
    }
  };

  const processAudio = (analyserNode, sensitivity) => {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVolume = () => {
      if (!analyserNode) return;
      
      analyserNode.getByteFrequencyData(dataArray);
      
      // Calculate average volume from frequency data
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      
      // Apply sensitivity factor (0-10 scale)
      const sensitivityFactor = sensitivity / 5;
      const averageVolume = (sum / bufferLength) * sensitivityFactor;
      const normalizedVolume = Math.min(10, averageVolume / 25.5);
      
      setVolume(normalizedVolume);
      
      if (isListening) {
        requestAnimationFrame(updateVolume);
      }
    };
    
    updateVolume();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    isListening,
    volume,
    error,
    startListening,
    stopListening
  };
}