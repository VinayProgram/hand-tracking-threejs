import { useEffect, useRef, useState } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Set up the camera stream
  const startCamera = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userMediaStream);
      if (videoRef.current) {
        console.log('working')
        videoRef.current.srcObject = userMediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  return {
    videoRef,
    startCamera,
    stopCamera
  };
};

export default useCamera;
