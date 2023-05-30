import keyNotesDictionary, {
  keyboardLetterToNoteNumber,
} from "lib/keyNamesDictionary";
import { useEffect } from "react";
import { useAppDispatch } from "redux/hooks";
import { deselectNote, selectNote } from "../redux/pianoSlice";
import { sampler } from "./sampler";

const activeKeys = {};

function useKeyboardAsPiano() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const noteNumber = keyboardLetterToNoteNumber[event.key];
      const keyLetter = keyNotesDictionary[noteNumber];

      if (noteNumber) {
        if (!activeKeys[event.key]) {
          sampler.triggerAttack(keyLetter);
        }
        dispatch(selectNote(noteNumber));
      }

      activeKeys[event.key] = true;
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const noteNumber = keyboardLetterToNoteNumber[event.key];
      const keyLetter = keyNotesDictionary[noteNumber];

      if (noteNumber) {
        sampler.triggerRelease(keyLetter, "+0.05");
        dispatch(deselectNote(noteNumber));
      }
      activeKeys[event.key] = false;
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}

export default useKeyboardAsPiano;
