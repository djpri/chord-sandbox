export const chordDictionary = {
  major: {
    intervals: [0, 4, 7],
    firstInversion: [0, 3, 8],
    secondInversion: [0, 5, 9],
  },
  minor: {
    intervals: [0, 3, 7],
  },
  diminished: {
    intervals: [0, 3, 6],
  },
  augmented: {
    intervals: [0, 4, 8],
  },
  sus2: {
    intervals: [0, 2, 7],
  },
  sus4: {
    intervals: [0, 5, 7],
  },
  add2: {
    intervals: [0, 2, 4, 7],
  },
  major6: {
    intervals: [0, 4, 7, 9],
  },
  minor6: {
    intervals: [0, 3, 7, 9],
  },
  "7sus2": {
    intervals: [0, 2, 7, 10],
  },
  "7sus4": {
    intervals: [0, 5, 7, 10],
  },
  dominant7: {
    intervals: [0, 4, 7, 10],
  },
  major7: {
    intervals: [0, 4, 7, 11],
  },
  minor7: {
    intervals: [0, 3, 7, 10],
  },
  dominant9: {
    intervals: [0, 4, 7, 10, 14],
  },
  // checkpoint
  diminished7: {
    intervals: [0, 3, 6, 9],
  },
  augmented7: {
    intervals: [0, 4, 8, 11],
  },
  // major7b5: {
  //   intervals: [0, 4, 6, 10],
  // },
  // minor9b5: {
  //   intervals: [0, 3, 7, 10, 14],
  // },
  major9: {
    intervals: [0, 4, 7, 11, 14],
  },
  minor9: {
    intervals: [0, 3, 7, 10, 14],
  },
  major11: {
    intervals: [0, 4, 7, 11, 14, 17],
  },
  minor11: {
    intervals: [0, 3, 7, 10, 14, 17],
  },
  // dominant11: {
  //   intervals: [0, 4, 7, 10, 14, 17],
  // },
  major13: {
    intervals: [0, 4, 7, 11, 14, 17, 21],
  },
  minor13: {
    intervals: [0, 3, 7, 10, 14, 17, 21],
  },
};

export const getChordLetter = (keys: string[]) => {
  const notes = keys.map((key) => parseInt(key) % 12);
  return notes;
};

const numberOfUniqueNotes = (notes: number[]) => {
  const modNotes = notes.map((note) => note % 12);
  return new Set(modNotes).size;
};

// remove notes of the same letter and ensure that that chord does not span more than an octave
// only works for triads and sevenths
export function reduceNotes(notes: number[], isValidated = false) {
  if (!isValidated && numberOfUniqueNotes(notes) > 4) {
    return notes;
  }
  if (notes[notes.length - 1] - notes[0] < 12) {
    return notes;
  }

  let i = notes.length - 2;
  while (i >= 0) {
    let x = notes[i];
    let y = notes[notes.length - 1];

    if ((y - x) % 12 === 0) {
      notes.pop();

      return reduceNotes(notes.sort(), true);
    }

    if (notes[notes.length - 1] - notes[i] > 12) {
      notes[notes.length - 1] -= 12;

      return reduceNotes(notes.sort(), true);
    }
    i--;
  }
}

export const firstInversion = (intervals: number[]) => {
  const newIntervals = [...intervals.slice(1), intervals[0] + 12];

  const firstInversion = newIntervals.map((interval) => {
    return interval - newIntervals[0];
  });

  return firstInversion;
};

export const secondInversion = (intervals: number[]) => {
  return firstInversion(firstInversion(intervals));
};

export const thirdInversion = (intervals: number[]) => {
  return firstInversion(secondInversion(intervals));
};

export const getChordNoteNumbers = (noteNumber = 60, chordType = "major") => {
  console.log(noteNumber, chordType);
  let chordNoteNumbers: number[] = [];
  chordNoteNumbers = chordDictionary[chordType].intervals.map(
    (interval: number) => {
      return noteNumber + interval;
    }
  );

  return chordNoteNumbers;
};

export type Chords = typeof chordDictionary;
