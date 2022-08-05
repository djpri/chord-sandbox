import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface MidiState {
  devices: string[];
  currentDevice: string;
}

// Define the initial state using that type
const initialState: MidiState = {
  devices: [],
  currentDevice: "",
};

export const midiSlice = createSlice({
  name: "midi",
  initialState,
  reducers: {
    setCurrentDevice: (state, action: PayloadAction<string>) => {
      state.currentDevice = action.payload;
    },
    setDevices: (state, action: PayloadAction<string[]>) => {
      state.devices = action.payload;
    },
  },
});

export const { setCurrentDevice, setDevices } = midiSlice.actions;

export default midiSlice.reducer;
