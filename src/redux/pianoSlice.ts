import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "../piano/settings";
import { PlayerSettings } from "../piano/types";
import {
  keyLetters_startingWithA,
  keyLetters_startingWithC,
} from "./../lib/keyLetters";

export type ChordPad = {
  padId: number;
  rootNote: number | null;
  chordType: string | null;
  selectedNotes?: number[];
} | null;
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
  arpeggioSpeed: number;
  blackKeyIndexes: number[];
  chordPadShortCuts: string[];
  chordPads: ChordPadsList;
  currentNote: string | null;
  currentPlayingSequence: (string | number)[];
  isPlaying: boolean;
  keyLetters: Record<number, string>;
  numberOfKeys: number;
  scaleNoteNumbers: number[];
  selectedKeys: Record<string, boolean>;
  settings: PlayerSettings;
  showMidiNumbers: boolean;
  startingLetter: "A" | "C";
  view: "default" | "modern";
}


const initialState: PianoState = {
  arpeggioSpeed: 200,
  blackKeyIndexes: [1, 3, 6, 8, 10],
  chordPadShortCuts: chordPadShortCuts,
  chordPads: Array(12)
    .fill(null)
    .map((_, i) => ({ padId: i + 1, rootNote: null, chordType: null, selectedNotes: [] })),
  currentNote: null,
  currentPlayingSequence: [],
  isPlaying: false,
  keyLetters: keyLetters_startingWithC,
  numberOfKeys: 36,
  scaleNoteNumbers: [],
  selectedKeys: {},
  settings: defaultSettings,
  showMidiNumbers: true,
  startingLetter: "C",
  view: "default",
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
    setChord: (state, action: PayloadAction<[number, string]>) => {
      state.settings.chordRootNote = action.payload[0];
      state.settings.chordType = action.payload[1];
    },
    setSelectedChord: (
      state,
      action: PayloadAction<{
        rootNote: number;
        chordType: string;
      } | null>
    ) => {
      if (action.payload !== null) {
        state.settings.selectedChord = {
          rootNote: action.payload.rootNote,
          chordType: action.payload.chordType,
        };
      } else {
        state.settings.selectedChord = null;
      }
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setPianoSettings(state, action: PayloadAction<PlayerSettings>) {
      state.settings = action.payload;
    },
    setChordPads(state, action: PayloadAction<ChordPadsList>) {
      state.chordPads = action.payload;
    },
    handleChordPadDrop: (
      state,
      action: PayloadAction<{
        dragSourceIndex: number;
        dropDestinationIndex: number;
      }>
    ) => {
      const { dragSourceIndex, dropDestinationIndex } = action.payload;
      const newChordPads = [...state.chordPads];
      [newChordPads[dragSourceIndex], newChordPads[dropDestinationIndex]] = [
        newChordPads[dropDestinationIndex],
        newChordPads[dragSourceIndex],
      ];
      state.chordPads = newChordPads;
    },
    resetChordPads(state) {
      state.chordPads = Array(12).fill(null);
    },
    setSingleChordPadShortCut(state, action: PayloadAction<[number, string]>) {
      state.chordPadShortCuts[action.payload[0]] = action.payload[1];
    },
    setPianoStartKey(state, action: PayloadAction<string>) {
      if (action.payload === "A") {
        state.startingLetter = "A";
        state.keyLetters = keyLetters_startingWithA;
        state.blackKeyIndexes = [1, 4, 6, 9, 11];
      } else {
        state.startingLetter = "C";
        state.keyLetters = keyLetters_startingWithC;
        state.blackKeyIndexes = [1, 3, 6, 8, 10];
      }
    },
    setView: (state, action: PayloadAction<"default" | "modern">) => {
      state.view = action.payload;
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
  handleChordPadDrop,
  setScaleNoteNumbers,
  setChordPads,
  setSelectedChord,
  resetChordPads,
  setPianoStartKey,
  setView
} = pianoSlice.actions;

export default pianoSlice.reducer;
