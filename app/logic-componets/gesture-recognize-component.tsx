"use client"
import React from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

interface GestureRecognizerProps {
  setGestureRecognizer: (recognizer: GestureRecognizer | null) => void;
}

const GestureRecognizerComponent: React.FC<GestureRecognizerProps> = ({ setGestureRecognizer }) => {
  React.useEffect(() => {
    const createGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );
      const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
      });
      setGestureRecognizer(gestureRecognizer);
    };

    createGestureRecognizer();
  }, [setGestureRecognizer]);

  return null; // No UI for this component.
};

export default GestureRecognizerComponent;
