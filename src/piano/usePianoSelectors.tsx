import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { PianoKey } from "./types";
import { arraysEqual } from "helpers/arrays";
import { reduceNotes, firstInversion, secondInversion, thirdInversion, chordDictionary } from "lib/chords";
import { setChord, setSelectedChord } from "redux/pianoSlice";

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
    const selectedChord = useMemo(() => {
      const selectedKeysArray = Object.keys(pianoState.selectedKeys).filter(
        (key) => pianoState.selectedKeys[key] === true
      );
  
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
          dispatch(setChord([inversion.rootNote, chordType]));
          dispatch(setSelectedChord({
            rootNote: inversion.rootNote,
            chordType
          }))
          return [inversion.rootNote, chordType];
        }
      }
      dispatch(setSelectedChord(null))
      return null;
    }, [pianoState.selectedKeys]);
  
    const chordName = selectedChord
      ? `${getKeyLetter(selectedChord[0])} ${selectedChord[1]}`
      : "-";

  return {
    isBlackKey,
    getKeyLetter,
    keysArray,
    selectedChord,
    chordName
  }
}

export default usePianoSelectors