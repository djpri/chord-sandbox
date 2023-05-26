import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface MidiState {
  deviceList: (string | undefined)[];
  selectedDevice: string | undefined;
}

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
