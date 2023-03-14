import { useCallback, useEffect, useMemo } from "react";
import { arraysEqual } from "../helpers/arrays";
import { delay } from "../helpers/delay";
import { crotchetBeatsToMs } from "../helpers/tempo";
import {
  chordDictionary,
  firstInversion,
  getChordNoteNumbers,
  reduceNotes,
  secondInversion,
  thirdInversion,
} from "../lib/chords";
import keyNotesDictionary from "../lib/keyNamesDictionary";
import { getScaleNoteNumbers } from "../lib/scales";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearSelection,
  selectNote,
  selectSingleNote,
  setChord,
  setCurrentPlayingSequence,
  setIsPlaying,
  setPianoStartKey,
} from "../redux/pianoSlice";
import { synth } from "./sampler";
import { PianoConfig, PianoKey } from "./types";

function usePiano(
  config: PianoConfig = {
    startingLetter: "C",
    numberOfKeys: 36,
    player: synth,
    arpeggioSpeed: 200,
  }
) {
  const pianoState = useAppSelector((state) => state.piano);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPianoStartKey(config.startingLetter)
  }, [])
  
  const isBlackKey = useCallback(
    (index: number) => {
      return pianoState.blackKeyIndexes.includes(index % 12);
    },
    [pianoState.blackKeyIndexes]
  );

  const getKeyLetter = useCallback(
    (index: number) => {
      return pianoState.keyLetters[index % 12];
    },
    [pianoState.keyLetters]
  );

  const keysArray = useMemo(() => {
    const keyArray: PianoKey[] = [];
    const startingIndex = 48;
    for (let index = 0; index < pianoState.numberOfKeys; index++) {
      const key: PianoKey = {
        id: "",
        className: "",
        text: "",
        note: "",
      };
      key.id = `${index + startingIndex}`;

      if (isBlackKey(index)) {
        key.className = `key ${index} black ${getKeyLetter(index)} noteNumber-${
          index + startingIndex
        }`;
      } else {
        key.className = `key ${index} white ${getKeyLetter(index)} noteNumber-${
          index + startingIndex
        }`;
      }
      key.text = `${getKeyLetter(index)}${Math.floor(index / 12) + 3}`;
      key.note = `${getKeyLetter(index)}${Math.floor(index / 12) + 3}`;
      keyArray.push(key);
    }
    return keyArray;
  }, [pianoState]);


  /**
   * When selected keys change, check if it matches a chord
   */
  const selectedChord = useMemo<[number, string] | null>(() => {
    const originalKeyNotes = Object.keys(pianoState.selectedKeys).filter(
      (key) => pianoState.selectedKeys[key] === true
    );

    const keys: number[] = reduceNotes(
      originalKeyNotes.map((key) => parseInt(key))
    );

    const interval: number[] = keys?.map((key: number) => {
      return key - keys[0];
    });

    const originalChord: string | undefined = Object.keys(chordDictionary).find(
      (key) => arraysEqual(chordDictionary[key].intervals, interval)
    );

    if (originalChord) {
      return [keys[0], originalChord];
    }

    const isFirstInversion: string | undefined = Object.keys(
      chordDictionary
    ).find((key) =>
      arraysEqual(firstInversion(chordDictionary[key].intervals), interval)
    );

    if (isFirstInversion) {
      return [keys[keys.length - 1], isFirstInversion];
    }

    const isSecondInversion: string | undefined = Object.keys(
      chordDictionary
    ).find((key) =>
      arraysEqual(secondInversion(chordDictionary[key].intervals), interval)
    );

    if (isSecondInversion) {
      return [keys[keys.length - 2], isSecondInversion];
    }

    const isThirdInversion: string | undefined = Object.keys(
      chordDictionary
    ).find((key) =>
      arraysEqual(thirdInversion(chordDictionary[key].intervals), interval)
    );

    if (isThirdInversion) {
      return [keys[keys.length - 3], isThirdInversion];
    }

    return null;
  }, [pianoState.selectedKeys]);

  useEffect(() => {
    if (selectedChord) {
      dispatch(setChord([selectedChord[0], selectedChord[1]]));
    }
  }, [selectedChord])
  
  const playScale = useCallback((
    rootNote = 48,
    scaleType = "minorHarmonic",
  ) => {
    const sequenceId = ["scale", rootNote, scaleType];
    const tempo = crotchetBeatsToMs(pianoState.pianoSettings.arpeggioSpeed);
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
        return;
      }
      const scaleNoteNumbers = getScaleNoteNumbers(
        rootNote,
        scaleType,
        scaleIsAscending
      );
      const note = scaleNoteNumbers[i];
      dispatch(selectSingleNote(note));
      config.player.triggerAttackRelease(keyNotesDictionary[note], "8n");

      scaleIsAscending ? i++ : i--;

      scaleIsAscending =
        (i < scaleNoteNumbers.length - 1 && scaleIsAscending) ||
        (i < 0 && !scaleIsAscending);

      scaleIsPlaying = i >= 0;
    }, tempo);
  },[pianoState.pianoSettings.arpeggioSpeed]);

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

  const playArpeggio = useCallback(
    async (rootNote = 48, chordType = "major") => {
      const sequenceId: (string | number)[] = ["arp", rootNote, chordType];
    const tempo = crotchetBeatsToMs(pianoState.pianoSettings.arpeggioSpeed);
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
    keysArray,
    player: {
      playArpeggio,
      playChordBlock,
      playScale,
    },
    getKeyLetter,
  };
}

export default usePiano;
