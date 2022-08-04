import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface PianoState {
  currentPlayingSequence: (string | number)[];
  selectedKeys: {};
  isPlaying: boolean;
}

// Define the initial state using that type
const initialState: PianoState = {
  currentPlayingSequence: [],
  selectedKeys: {},
  isPlaying: false,
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
  },
});

export const {
  selectNote,
  selectSingleNote,
  toggleNote,
  deselectNote,
  clearSelection,
  setCurrentPlayingSequence,
} = pianoSlice.actions;

export default pianoSlice.reducer;
