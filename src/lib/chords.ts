export const chordDictionary = {
  major: {
    intervals: [0, 4, 7],
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
  // dominant7: {
  //   intervals: [0, 4, 7, 10],
  // },
  // dominant9: {
  //   intervals: [0, 4, 7, 10, 14],
  // },
  // dominant11: {
  //   intervals: [0, 4, 7, 10, 14, 17],
  // },
  major13: {
    intervals: [0, 4, 7, 11, 14, 18, 21],
  },
  minor13: {
    intervals: [0, 3, 7, 10, 14, 17, 21],
  },
};

// start at last note of chord and look for the next note that is any octave below
// if such note is found, delete last note and start process again

// start at last note of chord and look a note that is over an octave below
// if such note is found, bring last note an octave down

// repeat until no notes are left
export const reduceChordIntervals = (intervals: number[]) => {
  // remove octaves
  for (let i = intervals.length - 1; i > -0; i--) {
    for (let j = intervals.length - 1; j > -0; j--) {
      if (
        intervals[i] !== intervals[j] &&
        (intervals[i] - intervals[j]) % 12 === 0
      ) {
        console.log(intervals[i], intervals[j]);
        intervals.splice(j, 1);
      }
      if (intervals[i] - intervals[j] > 12) {
        intervals[i] -= 12;
        // reduceChordIntervals(intervals);
      }
    }
  }
  // check for no intervals bigger than an octave
  for (let i = 0; i < intervals.length - 1; i++) {
    let difference = intervals[i + 1] - intervals[i];
    if (difference === 12) {
      intervals.splice(i + 1, 1);
    }
    if (difference > 12) {
      intervals[i + 1] -= 12;
      reduceChordIntervals(intervals);
    }
  }
  return intervals.sort((a, b) => a - b);
};

console.log(reduceChordIntervals([36, 40, 43, 48, 52, 55]));

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
