import { getChordNoteNumbers } from "lib/chords";
import keyNotesDictionary from "lib/keyNamesDictionary";
import { useCallback } from "react";
import { useAppDispatch } from "redux/hooks";
import {
  clearSelection,
  selectNote,
  setCurrentPlayingSequence,
} from "redux/pianoSlice";
import { PianoConfig } from "../types";

function chordPlayer(config: PianoConfig) {
  const dispatch = useAppDispatch();

  const playChordBlock = useCallback(
    (rootNote = 60, chordType = "major") => {
      dispatch(clearSelection());
      const sequenceId = ["chord", rootNote, chordType];
      dispatch(setCurrentPlayingSequence(sequenceId));

      const chordNoteNumbers = getChordNoteNumbers(rootNote, chordType);
      const chordNoteLetters = chordNoteNumbers.map((noteNumber) => {
        return keyNotesDictionary[noteNumber];
      });
      config.player.triggerAttackRelease(chordNoteLetters, "2n");
      chordNoteNumbers.forEach((noteNumber) => {
        dispatch(selectNote(noteNumber));
      });
    },
    [config]
  );

  const playManualChordBlock = useCallback(
    (noteNumbers: number[]) => {
      dispatch(clearSelection());
      
      const sequenceId = ["manualChord", ...noteNumbers];
      dispatch(setCurrentPlayingSequence(sequenceId));

      const chordNoteLetters = noteNumbers.map((noteNumber) => {
        return keyNotesDictionary[noteNumber];
      });
      config.player.triggerAttackRelease(chordNoteLetters, "2n");
      noteNumbers.forEach((noteNumber) => {
        dispatch(selectNote(noteNumber));
      });
    },
    [config]
  );

  return {
    playChordBlock,
    playManualChordBlock,
  };
}

export default chordPlayer;
