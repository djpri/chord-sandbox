import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface MidiState {
  deviceList: (string | undefined)[];
  selectedDevice: string | undefined;
}

// Define the initial state using that type
const initialState: MidiState = {
  deviceList: [],
  selectedDevice: "",
};

export const midiSlice = createSlice({
  name: "midi",
  initialState,
  reducers: {
    setCurrentDevice: (state, action: PayloadAction<string | undefined>) => {
      state.selectedDevice = action.payload;
    },
    setDevices: (state, action: PayloadAction<(string | undefined)[]>) => {
      state.deviceList = action.payload;
    },
    clearDevices: (state) => {
      state.deviceList = [];
      state.selectedDevice = undefined;
    },
  },
});

export const { setCurrentDevice, setDevices, clearDevices } = midiSlice.actions;

export default midiSlice.reducer;
