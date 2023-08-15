import { delay } from "helpers/delay";
import { crotchetBeatsToMs } from "helpers/tempo";
import { getChordNoteNumbers } from "lib/chords";
import keyNotesDictionary from "lib/keyNamesDictionary";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  clearSelection,
  selectSingleNote,
  setCurrentPlayingSequence,
  setIsPlaying,
} from "redux/pianoSlice";
import { PianoConfig } from "../types";

function arpeggioPlayer(config: PianoConfig) {
  const dispatch = useAppDispatch();
  const pianoState = useAppSelector((state) => state.piano);

  const playArpeggio = useCallback(
    async (rootNote = 48, chordType = "major") => {
      const sequenceId: (string | number)[] = ["arp", rootNote, chordType];
      const tempo = crotchetBeatsToMs(pianoState.settings.arpeggioSpeed);
      dispatch(setIsPlaying(true));
      dispatch(clearSelection());
      dispatch(setCurrentPlayingSequence(sequenceId));
      const chordNumbers = getChordNoteNumbers(rootNote, chordType);

      for (let i = 0; i < chordNumbers.length; i++) {
        const number = chordNumbers[i];
        if (i !== 0) {
          await delay(tempo);
        }
        config.player.triggerAttackRelease(keyNotesDictionary[number], 0.5);
        dispatch(selectSingleNote(number));
      }

      for (let i = chordNumbers.length - 1; i >= 0; i--) {
        const number = chordNumbers[i];
        if (i !== chordNumbers.length - 1) {
          await delay(tempo);
        }
        config.player.triggerAttackRelease(keyNotesDictionary[number], 0.5);
        dispatch(selectSingleNote(number));
      }

      await delay(tempo);
      dispatch(setIsPlaying(false));
      dispatch(clearSelection());
    },
    [config]
  );

  return playArpeggio;
}

export default arpeggioPlayer;
