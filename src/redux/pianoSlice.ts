import { keyLetters_startingWithA, keyLetters_startingWithC } from './../lib/keyLetters';
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "../piano/settings";
import { PlayerSettings } from "../piano/types";

export type ChordPad = [number, string] | null;
export type ChordPadsList = ChordPad[];

const chordPadShortCuts = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "=",
];

interface PianoState {
  currentPlayingSequence: (string | number)[];
  selectedKeys: Record<string, boolean>;
  isPlaying: boolean;
  currentNote: string | null;
  pianoSettings: PlayerSettings;
  chordPads: ChordPadsList;
  chordPadShortCuts: string[];
  showMidiNumbers: boolean;
  startingLetter: "A" | "C";
  numberOfKeys: number;
  arpeggioSpeed: number;
  keyLetters: Record<number, string>;
  blackKeyIndexes: number[];
  scaleNoteNumbers: number[];
}

const initialState: PianoState = {
  currentPlayingSequence: [],
  selectedKeys: {},
  isPlaying: false,
  currentNote: null,
  pianoSettings: defaultSettings,
  chordPads: Array(12).fill(null),
  chordPadShortCuts: chordPadShortCuts,
  showMidiNumbers: true,
  numberOfKeys: 36,
  arpeggioSpeed: 200,
  keyLetters: keyLetters_startingWithC,
  startingLetter: "C",
  blackKeyIndexes: [1, 3, 6, 8, 10],
  scaleNoteNumbers: [],
};

export const pianoSlice = createSlice({
  name: "piano",
  initialState,
  reducers: {
    selectNote: (state, action: PayloadAction<number>) => {
      state.selectedKeys[action.payload] = true;
    },
    toggleNote(state, action: PayloadAction<number>) {
      state.selectedKeys[action.payload] = !state.selectedKeys[action.payload];
    },
    selectSingleNote: (state, action: PayloadAction<number>) => {
      state.selectedKeys = { [action.payload]: true };
      state.currentNote = state.keyLetters[action.payload % 12];
    },
    deselectNote: (state, action: PayloadAction<number>) => {
      state.selectedKeys[action.payload] = false;
    },
    clearSelection: (state) => {
      state.selectedKeys = {};
      state.currentNote = null;
    },
    setCurrentPlayingSequence: (
      state,
      action: PayloadAction<(string | number)[]>
    ) => {
      state.currentPlayingSequence = action.payload;
    },
    setScaleNoteNumbers: (state, action: PayloadAction<number[]>) => {
      state.scaleNoteNumbers = action.payload;
    },
    setChord: (
      state,
      action: PayloadAction<[number, string]>
    ) => {
      state.pianoSettings.chordRootNote = action.payload[0];
      state.pianoSettings.chordType = action.payload[1];
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setPianoSettings(state, action: PayloadAction<PlayerSettings>) {
      state.pianoSettings = action.payload;
    },
    setChordPads(state, action: PayloadAction<ChordPadsList>) {
      state.chordPads = action.payload;
    },
    setSingleChordPadShortCut(state, action: PayloadAction<[number, string]>) {
      state.chordPadShortCuts[action.payload[0]] = action.payload[1];
    },
    setPianoStartKey(state, action: PayloadAction<string>) {
      if (action.payload === "A") {
        state.startingLetter = "A";
        state.keyLetters = keyLetters_startingWithA;
        state.blackKeyIndexes = [1, 4, 6, 9, 11]
      } else {
        state.startingLetter = "C";
        state.keyLetters = keyLetters_startingWithC;
        state.blackKeyIndexes = [1, 3, 6, 8, 10]
      }
    }
  },
});

export const {
  selectNote,
  selectSingleNote,
  toggleNote,
  deselectNote,
  setChord,
  clearSelection,
  setCurrentPlayingSequence,
  setSingleChordPadShortCut,
  setIsPlaying,
  setPianoSettings,
  setScaleNoteNumbers,
  setChordPads,
  setPianoStartKey,
} = pianoSlice.actions;

export default pianoSlice.reducer;
