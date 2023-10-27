import { getChordNoteNumbers } from "lib/chords";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useAppDispatch } from "redux/hooks";
import { ChordPadsList, setChordPads } from "redux/pianoSlice";

function majorScaleChordPads(rootNote: number): ChordPadsList {
  return [
    {
      padId: 1,
      rootNote,
      chordType: "major",
      selectedNotes: getChordNoteNumbers(rootNote, "major"),
    },
    {
      padId: 2,
      rootNote: rootNote + 2,
      chordType: "minor",
      selectedNotes: getChordNoteNumbers(rootNote + 2, "minor"),
    },
    {
      padId: 3,
      rootNote: rootNote + 4,
      chordType: "minor",
      selectedNotes: getChordNoteNumbers(rootNote + 4, "minor"),
    },
    {
      padId: 4,
      rootNote: rootNote + 5,
      chordType: "major",
      selectedNotes: getChordNoteNumbers(rootNote + 5, "major"),
    },
    {
      padId: 5,
      rootNote: rootNote + 7,
      chordType: "major",
      selectedNotes: getChordNoteNumbers(rootNote + 7, "major"),
    },
    {
      padId: 6,
      rootNote: rootNote + 9,
      chordType: "minor",
      selectedNotes: getChordNoteNumbers(rootNote + 9, "minor"),
    },
    {
      padId: 7,
      rootNote: rootNote + 11,
      chordType: "diminished",
      selectedNotes: getChordNoteNumbers(rootNote + 11, "diminished"),
    },
    // leave the rest of the pads blank
    { padId: 8, rootNote: null, chordType: null, selectedNotes: [] },
    { padId: 9, rootNote: null, chordType: null, selectedNotes: [] },
    { padId: 10, rootNote: null, chordType: null, selectedNotes: [] },
    { padId: 11, rootNote: null, chordType: null, selectedNotes: [] },
    { padId: 12, rootNote: null, chordType: null, selectedNotes: [] },
  ];
}

function ChordPadPresetsModal({ onClose }) {
  const [isFadedIn, setIsFadedIn] = useState(false);
  const insideContent = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsFadedIn(true);
  }, []);

  const MajorChordsOption = ({ letter, rootNote }) => {
    return (
      <button
        onClick={() => {
          dispatch(setChordPads(majorScaleChordPads(rootNote)));
          onClose();
        }}
      >
        {letter}
      </button>
    );
  };

  return ReactDOM.createPortal(
    <div
      className={isFadedIn ? "modal-overlay faded-in" : "modal-overlay"}
      onClick={(e) => {
        if (!insideContent?.current?.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        className={isFadedIn ? "modal-content faded-in" : "modal-content"}
        ref={insideContent}
      >
        <h2>Choose a Preset</h2>
        <h4>Chords of the Major Key</h4>
        <p>
          Provides the basic triad chords for each note in the major scale. The
          chords follow this pattern:
        </p>
        <ul>
          <li>I: Major</li>
          <li>ii: Minor</li>
          <li>iii: Minor</li>
          <li>IV: Major</li>
          <li>V: Minor</li>
          <li>VI: Minor</li>
          <li>vii: Diminished</li>
        </ul>
        <div>
          <MajorChordsOption letter="A" rootNote={57} />
          <MajorChordsOption letter="A#" rootNote={58} />
          <MajorChordsOption letter="B" rootNote={59} />
          <MajorChordsOption letter="C" rootNote={60} />
          <MajorChordsOption letter="C#" rootNote={61} />
          <MajorChordsOption letter="D" rootNote={62} />
          <MajorChordsOption letter="D#" rootNote={63} />
          <MajorChordsOption letter="E" rootNote={64} />
          <MajorChordsOption letter="F" rootNote={53} />
          <MajorChordsOption letter="F#" rootNote={54} />
          <MajorChordsOption letter="G" rootNote={55} />
          <MajorChordsOption letter="G#" rootNote={56} />
        </div>
        <h4>Chords of the Minor Key</h4>
      </div>
    </div>,
    document.getElementById("root") as HTMLElement
  );
}

export default ChordPadPresetsModal;
