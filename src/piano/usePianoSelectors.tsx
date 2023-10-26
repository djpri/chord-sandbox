import { arraysEqual } from "helpers/arrays";
import {
  chordDictionary,
  firstInversion,
  reduceNotes,
  secondInversion,
  thirdInversion,
} from "lib/chords";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { setChord, setSelectedChord } from "redux/pianoSlice";
import { PianoKey } from "./types";

function usePianoSelectors() {
  const pianoState = useAppSelector((state) => state.piano);
  const dispatch = useAppDispatch();

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

  const selectedKeysArray = Object.keys(pianoState.selectedKeys).filter(
    (key) => pianoState.selectedKeys[key] === true
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
  const selectedChord: [number, string] | null = useMemo(() => {
    if (selectedKeysArray.length < 3) return null;

    const keys = reduceNotes(selectedKeysArray.map(Number));
    const interval = keys.map((key) => key - keys[0]);

    const chordInversions = {
      root: {
        rootNote: keys[0],
        inversionFn: (chord) => chord,
      },
      first: {
        rootNote: keys[keys.length - 1],
        inversionFn: firstInversion,
      },
      second: {
        rootNote: keys[keys.length - 2],
        inversionFn: secondInversion,
      },
      third: {
        rootNote: keys[keys.length - 3],
        inversionFn: thirdInversion,
      },
    };

    for (const inversion of Object.values(chordInversions)) {
      const chordType = Object.keys(chordDictionary).find((key) =>
        arraysEqual(
          inversion.inversionFn(chordDictionary[key].intervals),
          interval
        )
      );
      if (chordType) {
        return [inversion.rootNote, chordType];
      }
    }
    return null;
  }, [pianoState.selectedKeys]);

  // update global state when selected chord changes
  useEffect(() => {
    if (selectedChord !== null) {
      dispatch(setChord([...selectedChord]));
        dispatch(
          setSelectedChord({
            rootNote: selectedChord[0],
            chordType: selectedChord[1],
          })
        );
    } else {
      dispatch(setSelectedChord(null));
    }
  }, [selectedChord])
  

  const chordName = selectedChord
    ? `${getKeyLetter(selectedChord[0])} ${
        selectedChord[1]
      }`
    : "-";

  return {
    pianoState,
    isBlackKey,
    getKeyLetter,
    keysArray,
    selectedKeysArray,
    selectedChord,
    chordName,
  };
}

export default usePianoSelectors;
