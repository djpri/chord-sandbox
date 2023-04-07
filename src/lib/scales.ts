export const scalesDictionary = {
  major: {
    name: "Major",
    ascending: [0, 2, 4, 5, 7, 9, 11, 12],
    descending: [0, 2, 4, 5, 7, 9, 11, 12],
  },
  naturalMinor: {
    name: "Natural Minor",
    ascending: [0, 2, 3, 5, 7, 8, 10, 12],
    descending: [0, 2, 3, 5, 7, 8, 10, 12],
  },
  minorHarmonic: {
    name: "Harmonic Minor",
    ascending: [0, 2, 3, 5, 7, 8, 11, 12],
    descending: [0, 2, 3, 5, 7, 8, 11, 12],
  },
  minorMelodic: {
    name: "Melodic Minor",
    ascending: [0, 2, 3, 5, 7, 9, 11, 12],
    descending: [0, 2, 3, 5, 7, 8, 10, 12],
  },
  majorPentatonic: {
    name: "Major Pentatonic",
    ascending: [0, 2, 4, 7, 9, 12],
    descending: [0, 2, 4, 7, 9, 12],
  },
  minorPentatonic: {
    name: "Minor Pentatonic",
    ascending: [0, 3, 5, 7, 10, 12],
    descending: [0, 3, 5, 7, 10, 12],
  },
  blues: {
    name: "Blues",
    ascending: [0, 3, 5, 6, 7, 10, 12],
    descending: [0, 3, 5, 6, 7, 10, 12],
  },
  chromatic: {
    name: "Chromatic",
    ascending: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    descending: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  // diatonic: [0, 2, 4, 5, 7, 9, 10, 12],
  // diminished: [0, 2, 3, 5, 6, 8, 9, 11, 12],
  // augmented: [0, 2, 4, 6, 8, 10, 11, 12],
  // majorBlues: [0, 2, 3, 5, 6, 7, 9, 10, 12],
  // ionian: [0, 2, 4, 5, 7, 9, 11, 12],
  // dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  // phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
  // lydian: [0, 2, 4, 6, 7, 9, 11, 12],
  // mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  // aeolian: [0, 2, 3, 5, 7, 8, 10, 12],
  // locrian: [0, 1, 3, 5, 6, 8, 10, 12],
};

export const getScaleNoteNumbers = (
  noteNumber = 36,
  scaleType = "major",
  ascending = true
) => {
  let scaleNoteNumbers: number[] = [];
  const type = ascending ? "ascending" : "descending";
  scaleNoteNumbers = scalesDictionary[scaleType][type].map(
    (interval: number) => {
      return noteNumber + interval;
    }
  );

  return scaleNoteNumbers;
};

export type Scales = typeof scalesDictionary;
