import CustomSelect from "components/Shared/CustomSelect";
import { PlayerActions } from "piano/player/usePianoPlayer";
import { FC, useState } from "react";
import { chordDictionary } from "../../../lib/chords";
import { scalesDictionary } from "../../../lib/scales";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearSelection,
  setPianoSettings,
  setScaleNoteNumbers,
} from "../../../redux/pianoSlice";
import "../../../styles/buttons.scss";
import ChordPads from "./ChordPads";

function Buttons({ actions }: { actions: PlayerActions }) {
  const [currentSelectId, setCurrentSelectId] = useState<string | null>(null);
  const { selectedKeys, isPlaying, settings } = useAppSelector((state) => ({
    selectedKeys: state.piano.selectedKeys,
    isPlaying: state.piano.isPlaying,
    currentPlayingSequence: state.piano.currentPlayingSequence,
    settings: state.piano.settings,
  }));
  const dispatch = useAppDispatch();
  const [scaleNotesHighlighted, setScaleNotesHighlighted] = useState(false);

  const changeChordSelectedNote = (note: number) => {
    dispatch(setPianoSettings({ ...settings, chordRootNote: note }));
  };

  const changeScaleSelectedNote = (note: number) => {
    dispatch(setPianoSettings({ ...settings, scaleRootNote: note }));
  };

  const ChangeRootNote = ({ noteLetter, noteNumber }) => (
    <option value={noteNumber}>{noteLetter}</option>
  );

  const NoteOptions: FC = () => (
    <>
      <ChangeRootNote noteNumber={57} noteLetter={"A"} />
      <ChangeRootNote noteNumber={58} noteLetter={"A#"} />
      <ChangeRootNote noteNumber={59} noteLetter={"B"} />
      <ChangeRootNote noteNumber={60} noteLetter={"C"} />
      <ChangeRootNote noteNumber={61} noteLetter={"C#"} />
      <ChangeRootNote noteNumber={62} noteLetter={"D"} />
      <ChangeRootNote noteNumber={63} noteLetter={"D#"} />
      <ChangeRootNote noteNumber={64} noteLetter={"E"} />
      <ChangeRootNote noteNumber={65} noteLetter={"F"} />
      <ChangeRootNote noteNumber={66} noteLetter={"F#"} />
      <ChangeRootNote noteNumber={67} noteLetter={"G"} />
      <ChangeRootNote noteNumber={68} noteLetter={"G#"} />
    </>
  );

  const ChordRootNoteSelect: FC = () => {
    return (
      <CustomSelect
        selectId={"chord-root-note"}
        currentSelectId={currentSelectId}
        watch={settings.chordRootNote}
        className="note-select"
        value={settings.chordRootNote}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setCurrentSelectId("chord-root-note");
          changeChordSelectedNote(parseInt(e.target.value));
          actions.playChordBlock(parseInt(e.target.value), settings.chordType);
        }}
      >
        <NoteOptions />
      </CustomSelect>
    );
  };

  const ChordTypeSelect: FC = () => (
    <CustomSelect
      selectId={"chord-type"}
      currentSelectId={currentSelectId}
      watch={settings.chordType}
      value={settings.chordType}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSelectId("chord-type");
        dispatch(setPianoSettings({ ...settings, chordType: e.target.value }));
        actions.playChordBlock(settings.chordRootNote, e.target.value);
      }}
    >
      {Object.keys(chordDictionary).map((chord) => (
        <option key={chord} value={chord}>
          {chord}
        </option>
      ))}
    </CustomSelect>
  );

  const ScaleRootNoteSelect: FC = () => (
    <CustomSelect
      selectId={"scale-root-note"}
      currentSelectId={currentSelectId}
      watch={settings.scaleRootNote}
      className="note-select"
      value={settings.scaleRootNote}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSelectId("scale-root-note");
        changeScaleSelectedNote(parseInt(e.target.value));
        if (scaleNotesHighlighted) {
          actions.highlightScaleNotes(
            parseInt(e.target.value),
            settings.scaleType
          );
        }
      }}
    >
      <NoteOptions />
    </CustomSelect>
  );
  const ScaleTypeSelect: FC = () => (
    <CustomSelect
      selectId={"scale-type"}
      currentSelectId={currentSelectId}
      watch={settings.scaleType}
      value={settings.scaleType}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSelectId("scale-type");
        dispatch(setPianoSettings({ ...settings, scaleType: e.target.value }));
        if (scaleNotesHighlighted) {
          actions.highlightScaleNotes(settings.scaleRootNote, e.target.value);
        }
      }}
    >
      {Object.entries(scalesDictionary).map((scale) => (
        <option key={scale[0]} value={scale[0]}>
          {scale[1].name}
        </option>
      ))}
    </CustomSelect>
  );

  return (
    <div className="buttons">
      <button
        disabled={Object.entries(selectedKeys).length === 0 || isPlaying}
        onClick={() => dispatch(clearSelection())}
      >
        Reset
      </button>
      <div className="scales-section">
        <h2>Scales:</h2>
        <div className="scales-section-buttons">
          <ScaleRootNoteSelect />
          <ScaleTypeSelect />
          <h2 className="speed" style={{ width: "200px" }}>
            Speed: ♩ = {settings.arpeggioSpeed}
          </h2>
          <input
            type="range"
            min="60"
            max="300"
            step="5"
            value={settings.arpeggioSpeed}
            onChange={(e) => {
              dispatch(
                setPianoSettings({
                  ...settings,
                  arpeggioSpeed: parseInt(e.target.value),
                })
              );
            }}
          />
          <button
            onClick={() =>
              actions.playScale(settings.scaleRootNote, settings.scaleType)
            }
            disabled={isPlaying}
          >
            Play scale
          </button>
          <button
            style={
              scaleNotesHighlighted
                ? {
                    minWidth: "32ch",
                    color: "rgb(133, 133, 133)",
                  }
                : {minWidth: "32ch"}
            }
            onClick={() => {
              dispatch(clearSelection());
              if (!scaleNotesHighlighted) {
                actions.highlightScaleNotes(
                  settings.scaleRootNote,
                  settings.scaleType
                );
              } else {
                dispatch(setScaleNoteNumbers([]));
              }
              setScaleNotesHighlighted((prevState) => !prevState);
            }}
            disabled={isPlaying}
          >
            {scaleNotesHighlighted
              ? "Unhighlight notes"
              : "Highlight notes of scale"}
          </button>
        </div>
      </div>

      <div className="chords-section">
        <h2>Chords:</h2>
        <div className="chords-section-buttons">
          <ChordRootNoteSelect />
          <ChordTypeSelect />
          <button
            onClick={() =>
              actions.playChordBlock(settings.chordRootNote, settings.chordType)
            }
            disabled={isPlaying}
          >
            Play Chord
          </button>
          <button
            onClick={() => {
              actions.playArpeggio(settings.chordRootNote, settings.chordType);
            }}
            disabled={isPlaying}
          >
            Play Arpeggio
          </button>
        </div>
      </div>
      <ChordPads actions={actions} />
    </div>
  );
}

export default Buttons;
