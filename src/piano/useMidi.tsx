import { useState } from "react";
import keyNamesDictionary from "../lib/keyNamesDictionary";
import { useAppDispatch } from "../redux/hooks";
import { deselectNote, selectNote } from "../redux/pianoSlice";
import { sampler } from "./sampler";
import usePiano from "./usePiano";

function useMidi() {
  const { selectedKeys } = usePiano();
  const [keyboardReady, setKeyboardReady] = useState(false);
  const dispatch = useAppDispatch();

  function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
    midiAccess.addEventListener("onstatechange", updateDevices);
    setKeyboardReady(midiAccess.inputs.size > 0);

    const inputs: string[] = [];
    midiAccess.inputs.forEach((input) => {
      inputs.push(input.id);
      console.log(input);
      // input.addEventListener("midimessage", handleInput);
    });

    midiAccess.inputs
      .get(inputs[0])
      ?.addEventListener("midimessage", handleInput);
  }

  function onMIDIFailure(msg: string) {
    console.log("Failed to get MIDI access - " + msg);
  }

  function handleInput(input, offset = -12) {
    if (input === undefined) {
      return;
    }
    const command = input.data[0];
    const note = input.data[1] + offset;
    const velocity = input.data[2];
    switch (command) {
      case 144:
        if (velocity > 0) {
          console.log("Note on: " + note);
          sampler.triggerAttackRelease(keyNamesDictionary[note], "8n");
          const currentNote = document.querySelector(`.noteNumber-${note}`);
          currentNote?.classList.add("selected");
          dispatch(selectNote(note));
          // console.log("note on");

          // noteOn(note, velocity);
        } else {
          dispatch(deselectNote(note));

          const currentNote = document.querySelector(`.noteNumber-${note}`);
          currentNote?.classList.remove("selected");
        }
        break;
      case 128:
        console.log("Note off: " + note);
        const currentNote = document.querySelector(`.noteNumber-${note}`);
        currentNote?.classList.remove("selected");
        dispatch(deselectNote(note));

        // console.log("note off");
        // noteOff
        break;
      default:
        break;
    }
  }

  function updateDevices(event) {
    console.log(event);
  }

  return {
    keyboardReady,
    onMIDISuccess,
    onMIDIFailure,
  };
}

export default useMidi;
