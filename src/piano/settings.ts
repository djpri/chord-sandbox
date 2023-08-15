import { PlayerSettings } from "./types";

export const defaultSettings: PlayerSettings = {
  chordRootNote: 57,
  chordType: "major",
  scaleRootNote: 57,
  scaleType: "major",
  arpeggioSpeed: 300,
  autoPlayChords: false,
  selectedChord: null,
  volume: 80,
};
