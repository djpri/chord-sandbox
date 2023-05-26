import { Sampler, PolySynth } from "tone";

export type PianoConfig = {
  startingLetter: string;
  numberOfKeys: 36;
  player: Sampler | PolySynth;
  arpeggioSpeed: number;
};

export type PianoKey = {
  id: string;
  className: string;
  text: string;
  note: string;
};

export type PlayerSettings = {
  chordRootNote: number;
  chordType: string;
  scaleRootNote: number;
  scaleType: string;
  arpeggioSpeed: number;
  autoPlayChords: boolean;
  selectedChord: {
    rootNote: number,
    chordType: string
  } | null
  volume: number
};