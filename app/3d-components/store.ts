import { create } from 'zustand';

type Store = {
  cameraDirection: [number, number, number];
  setCameraDirection: (pos: [number, number, number]) => void;
  wristDirection: [number, number, number];
  setwristDirection: (pos: [number, number, number]) => void;
};

export const useStore = create<Store>((set) => ({
  cameraDirection: [0, 0, 3],
  setCameraDirection: (pos) => set({ cameraDirection: pos }),
  wristDirection:[0,0,0],
  setwristDirection: (pos) => set({ wristDirection: pos }),
}));
