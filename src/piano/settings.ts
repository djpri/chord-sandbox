export type PlayerSettings = {
  chordRootNote: number;
  chordType: string;
  scaleRootNote: number;
  scaleType: string;
  arpeggioSpeed: number;
  autoPlayChords: boolean;
};

export const defaultSettings: PlayerSettings = {
  chordRootNote: 45,
  chordType: "major",
  scaleRootNote: 45,
  scaleType: "major",
  arpeggioSpeed: 300,
  autoPlayChords: false,
};
