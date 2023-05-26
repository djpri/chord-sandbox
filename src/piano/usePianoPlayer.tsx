import { useCallback, useEffect } from "react";
import { delay } from "../helpers/delay";
import { crotchetBeatsToMs } from "../helpers/tempo";
import {
  getChordNoteNumbers,
} from "../lib/chords";
import keyNotesDictionary from "../lib/keyNamesDictionary";
import { getScaleNoteNumbers } from "../lib/scales";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearSelection,
  selectNote,
  selectSingleNote,
  setCurrentPlayingSequence,
  setIsPlaying,
  setPianoStartKey,
  setScaleNoteNumbers,
} from "../redux/pianoSlice";
import { synth } from "./sampler";
import { PianoConfig } from "./types";
import usePianoSelectors from "./usePianoSelectors";

function usePianoPlayer(
  config: PianoConfig = {
    startingLetter: "C",
    numberOfKeys: 36,
    player: synth,
    arpeggioSpeed: 200,
  }
) {
  const {
    getKeyLetter,
    keysArray,
    selectedChord,
    chordName
  } = usePianoSelectors();
  const pianoState = useAppSelector((state) => state.piano);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPianoStartKey(config.startingLetter);
    dispatch(setIsPlaying(false));
    dispatch(clearSelection());
    dispatch(setScaleNoteNumbers([]));
  }, []);

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

  return {
    selectedChord,
    chordName,
    keysArray,
    player: {
      playArpeggio,
      playChordBlock,
      playManualChordBlock,
      playScale,
    },
    getKeyLetter,
  };
}

export default usePianoPlayer;
