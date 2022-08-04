/* eslint-disable no-console */
import keyNamesDictionary from "../lib/keyNamesDictionary";
import { sampler } from "./sampler";

export function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
  midiAccess.addEventListener("onstatechange", updateDevices);
  console.log("MIDI ready!");
  console.log(midiAccess.inputs);

  midiAccess.inputs.forEach((input) => {
    input.addEventListener("midimessage", handleInput);
  });
}

export function onMIDIFailure(msg: string) {
  console.log("Failed to get MIDI access - " + msg);
}

export function handleInput(input, offset = -12) {
  if (input === undefined) {
    return;
  }
  const command = input.data[0];
  const note = input.data[1] + offset;
  const velocity = input.data[2];
  switch (command) {
    case 144:
      if (velocity > 0) {
        sampler.triggerAttackRelease(keyNamesDictionary[note], "8n");
        const currentNote = document.querySelector(`.noteNumber-${note}`);
        currentNote?.classList.add("selected");
        // noteOn(note, velocity);
      } else {
        // noteOff(note);
        const currentNote = document.querySelector(`.noteNumber-${note}`);
        currentNote?.classList.remove("selected");
      }
      break;
    case 128:
      // noteOff
      break;
    default:
      break;
  }
}

function updateDevices(event) {
  console.log(event);
}
