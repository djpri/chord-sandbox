export type PlayerSettings = {
  chordRootNote: number;
  chordType: string;
  scaleRootNote: number;
  scaleType: string;
  arpeggioSpeed: number;
  autoPlayChords: boolean;
};

export const defaultSettings: PlayerSettings = {
  chordRootNote: 57,
  chordType: "major",
  scaleRootNote: 57,
  scaleType: "major",
  arpeggioSpeed: 300,
  autoPlayChords: false,
};
