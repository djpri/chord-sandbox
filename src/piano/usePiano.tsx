import { useCallback, useMemo } from "react";
import { PolySynth, Sampler } from "tone";
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
import {
  keyLetters_startingWithA,
  keyLetters_startingWithC,
} from "../lib/keyLetters";
import keyNotesDictionary from "../lib/keyNamesDictionary";
import { getScaleNoteNumbers } from "../lib/scales";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearSelection,
  selectNote,
  selectSingleNote,
  setCurrentPlayingSequence,
  setIsPlaying,
} from "../redux/pianoSlice";
import { synth } from "./sampler";

type PianoConfig = {
  startingLetter: string;
  numberOfKeys: 36;
  player: Sampler | PolySynth;
  arpeggioSpeed: number;
};

type Key = {
  id: string;
  className: string;
  text: string;
  note: string;
};

function usePiano(
  config: PianoConfig = {
    startingLetter: "C",
    numberOfKeys: 36,
    player: synth,
    arpeggioSpeed: 200,
  }
) {
  const selectedKeys = useAppSelector((state) => state.piano.selectedKeys);

  const dispatch = useAppDispatch();

  const piano = useMemo(() => {
    const data: any = {};
    const { startingLetter, numberOfKeys } = config;
    if (startingLetter === "C") {
      data.keyLetters = keyLetters_startingWithC;
      data.blackKeyIndexes = [1, 3, 6, 8, 10];
    }
    if (startingLetter === "A") {
      data.keyLetters = keyLetters_startingWithA;
      data.blackKeyIndexes = [1, 4, 6, 9, 11];
    }
    data.numberOfKeys = numberOfKeys;

    return data;
  }, [config]);

  const isBlackKey = useCallback(
    (index: number) => {
      return piano.blackKeyIndexes.includes(index % 12);
    },
    [piano]
  );

  const getKeyLetter = useCallback(
    (index: number) => {
      return piano.keyLetters[index % 12];
    },
    [piano]
  );

  const keysArray = useMemo(() => {
    const keyArray: Key[] = [];
    const startingIndex = 48;
    for (let index = 0; index < piano.numberOfKeys; index++) {
      const key: Key = {
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
  }, [piano]);

  /**
   * When selected keys change, check if it matches a chord
   */
  const selectedChord = useMemo<[number, string] | null>(() => {
    const originalKeyNotes = Object.keys(selectedKeys).filter(
      (key) => selectedKeys[key] === true
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
  }, [selectedKeys]);

  const playScale = async (rootNote = 48, scaleType = "minorHarmonic") => {
    const sequenceId = ["scale", rootNote, scaleType];
    dispatch(setIsPlaying(true));
    dispatch(setCurrentPlayingSequence(sequenceId));

    let scaleIsPlaying = true;
    let scaleIsAscending = true;
    let i = 0;

    while (scaleIsPlaying) {
      const scaleNoteNumbers = getScaleNoteNumbers(
        rootNote,
        scaleType,
        scaleIsAscending
      );
      await delay(crotchetBeatsToMs(config.arpeggioSpeed));
      const note = scaleNoteNumbers[i];
      dispatch(selectSingleNote(note));
      config.player.triggerAttackRelease(keyNotesDictionary[note], "8n");

      scaleIsAscending ? i++ : i--;

      scaleIsAscending =
        (i < scaleNoteNumbers.length - 1 && scaleIsAscending) ||
        (i < 0 && !scaleIsAscending);

      scaleIsPlaying = i >= 0;
    }

    await delay(crotchetBeatsToMs(config.arpeggioSpeed));
    dispatch(setIsPlaying(false));
    dispatch(clearSelection());
  };

  const playChordBlock = useCallback(
    (rootNote = 60, chordType = "major") => {
      dispatch(clearSelection());
      const sequenceId = ["chord", rootNote, chordType];
      dispatch(setCurrentPlayingSequence(sequenceId));

      const chordNoteNumbers = getChordNoteNumbers(rootNote, chordType);
      const chordNoteLetters = chordNoteNumbers.map((noteNumber) => {
        return keyNotesDictionary[noteNumber];
      });
      config.player.triggerAttackRelease(chordNoteLetters, "4n");
      chordNoteNumbers.forEach((noteNumber) => {
        dispatch(selectNote(noteNumber));
      });
    },
    [config]
  );

  const playArpeggio = useCallback(
    async (rootNote = 48, chordType = "major") => {
      const sequenceId: (string | number)[] = ["arp", rootNote, chordType];
      dispatch(setIsPlaying(true));
      dispatch(clearSelection());
      dispatch(setCurrentPlayingSequence(sequenceId));
      const chordNumbers = getChordNoteNumbers(rootNote, chordType);

      for (let i = 0; i < chordNumbers.length; i++) {
        const number = chordNumbers[i];
        if (i !== 0) {
          await delay(crotchetBeatsToMs(config.arpeggioSpeed));
        }
        config.player.triggerAttackRelease(keyNotesDictionary[number], 0.5);
        dispatch(selectSingleNote(number));
      }

      for (let i = chordNumbers.length - 1; i >= 0; i--) {
        const number = chordNumbers[i];
        if (i !== chordNumbers.length - 1) {
          await delay(crotchetBeatsToMs(config.arpeggioSpeed));
        }
        config.player.triggerAttackRelease(keyNotesDictionary[number], 0.5);
        dispatch(selectSingleNote(number));
      }

      await delay(crotchetBeatsToMs(config.arpeggioSpeed));
      dispatch(setIsPlaying(false));
      dispatch(clearSelection());
    },
    [config]
  );

  return {
    selectedChord,
    keysArray,
    piano,
    player: {
      playArpeggio,
      playChordBlock,
      playScale,
    },
    getKeyLetter,
  };
}

export default usePiano;
