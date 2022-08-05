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
  major7: {
    intervals: [0, 4, 7, 11],
  },
  minor7: {
    intervals: [0, 3, 7, 10],
  },
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
  dominant7: {
    intervals: [0, 4, 7, 10],
  },
  dominant9: {
    intervals: [0, 4, 7, 10, 14],
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

// repeat until no notes are left
// export const reduceChordIntervals = (intervals: number[]) => {
//   const modIntervals = intervals.map((interval) => interval % 12);
//   const uniqueIntervals = [...new Set(modIntervals)].sort((a, b) => a - b);
//   if (uniqueIntervals.length > 3) {
//     return intervals;
//   }
//   return uniqueIntervals;
// };

// remove notes of the same letter and ensure that that chord does not span more than an octave
// only works for triads and sevenths
export function reduceNotes(notes: number[]) {
  if (notes[notes.length - 1] - notes[0] < 12) {
    notes;
    return notes;
  }

  let i = notes.length - 2;
  while (i >= 0) {
    let x = notes[i];
    let y = notes[notes.length - 1];

    if ((y - x) % 12 === 0) {
      notes.pop();

      return reduceNotes(notes.sort());
    }

    if (notes[notes.length - 1] - notes[i] > 12) {
      notes[notes.length - 1] -= 12;

      return reduceNotes(notes.sort());
    }
    i--;
  }
}

console.log(reduceNotes([52, 55, 60, 64]));

//[40, 48, 52, 55, 60, 64]
//[40, 43, 48]

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

export const getChordNoteNumbers = (noteNumber = 36, chordType = "major") => {
  let chordNoteNumbers: number[] = [];
  chordNoteNumbers = chordDictionary[chordType].intervals.map(
    (interval: number) => {
      return noteNumber + interval;
    }
  );

  return chordNoteNumbers;
};

export type Chords = typeof chordDictionary;
