import { crotchetBeatsToMs } from "helpers/tempo";
import keyNotesDictionary from "lib/keyNamesDictionary";
import { getScaleNoteNumbers } from "lib/scales";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  clearSelection,
  selectSingleNote,
  setCurrentPlayingSequence,
  setIsPlaying,
  setScaleNoteNumbers,
} from "redux/pianoSlice";
import { PianoConfig } from "../types";

function scalesPlayer(config: PianoConfig) {
  const dispatch = useAppDispatch();
  const pianoState = useAppSelector((state) => state.piano);

  const playScale = useCallback(
    (rootNote = 48, scaleType = "minorHarmonic") => {
      const sequenceId = ["scale", rootNote, scaleType];
      const tempo = crotchetBeatsToMs(pianoState.settings.arpeggioSpeed);
      dispatch(setIsPlaying(true));
      dispatch(setCurrentPlayingSequence(sequenceId));

      let scaleIsPlaying = true;
      let scaleIsAscending = true;
      let i = 0;

      const interval = setInterval(() => {
        if (!scaleIsPlaying) {
          clearInterval(interval);
          dispatch(setIsPlaying(false));
          dispatch(clearSelection());
          dispatch(setScaleNoteNumbers([]));
          return;
        }
        const scaleNoteNumbers = getScaleNoteNumbers(
          rootNote,
          scaleType,
          scaleIsAscending
        );
        dispatch(setScaleNoteNumbers(scaleNoteNumbers));
        const note = scaleNoteNumbers[i];
        dispatch(selectSingleNote(note));
        config.player.triggerAttackRelease(keyNotesDictionary[note], "8n");

        scaleIsAscending ? i++ : i--;

        scaleIsAscending =
          (i < scaleNoteNumbers.length - 1 && scaleIsAscending) ||
          (i < 0 && !scaleIsAscending);

        scaleIsPlaying = i >= 0;
      }, tempo);
    },
    [pianoState.settings.arpeggioSpeed]
  );

  return playScale;
}

export default scalesPlayer;
