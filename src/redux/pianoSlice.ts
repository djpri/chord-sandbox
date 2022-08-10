import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "../piano/settings";
import { PlayerSettings } from "./../piano/settings";

export type ChordPadsList = {
  1: string | null;
  2: string | null;
  3: string | null;
  4: string | null;
  5: string | null;
  6: string | null;
  7: string | null;
  8: string | null;
  9: string | null;
  10: string | null;
  11: string | null;
  12: string | null;
};

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

// Define a type for the slice state
interface PianoState {
  currentPlayingSequence: (string | number)[];
  selectedKeys: Record<string, boolean>;
  isPlaying: boolean;
  pianoSettings: PlayerSettings;
  chordPads: ChordPadsList;
  chordPadShortCuts: string[];
}

// Define the initial state using that type
const initialState: PianoState = {
  currentPlayingSequence: [],
  selectedKeys: {},
  isPlaying: false,
  pianoSettings: defaultSettings,
  chordPads: {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
  },
  chordPadShortCuts: chordPadShortCuts,
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
    },
    deselectNote: (state, action: PayloadAction<number>) => {
      state.selectedKeys[action.payload] = false;
    },
    clearSelection: (state) => {
      state.selectedKeys = {};
    },
    setCurrentPlayingSequence: (
      state,
      action: PayloadAction<(string | number)[]>
    ) => {
      state.currentPlayingSequence = action.payload;
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
  },
});

export const {
  selectNote,
  selectSingleNote,
  toggleNote,
  deselectNote,
  clearSelection,
  setCurrentPlayingSequence,
  setSingleChordPadShortCut,
  setIsPlaying,
  setPianoSettings,
  setChordPads,
} = pianoSlice.actions;

export default pianoSlice.reducer;
