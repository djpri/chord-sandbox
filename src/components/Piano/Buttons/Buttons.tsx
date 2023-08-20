import { FC, useRef } from "react";
import { chordDictionary } from "../../../lib/chords";
import { scalesDictionary } from "../../../lib/scales";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearSelection, setPianoSettings } from "../../../redux/pianoSlice";
import "../../../styles/buttons.scss";
import ChordPads from "./ChordPads";

function Buttons({ player, getKeyLetter }) {
  const { selectedKeys, isPlaying, settings } = useAppSelector((state) => ({
    selectedKeys: state.piano.selectedKeys,
    isPlaying: state.piano.isPlaying,
    currentPlayingSequence: state.piano.currentPlayingSequence,
    settings: state.piano.settings,
  }));
  const dispatch = useAppDispatch();

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
    const ref = useRef<HTMLSelectElement>(null);
    return (
      <select
        ref={ref}
        className="note-select"
        value={settings.chordRootNote}
        onChange={(e) => {
          changeChordSelectedNote(parseInt(e.target.value));
          player.playChordBlock(parseInt(e.target.value), settings.chordType);
          ref.current?.focus();
        }}
      >
        <NoteOptions />
      </select>
    );
  };
  const ChordTypeSelect: FC = () => (
    <select
      value={settings.chordType}
      onChange={(e) => {
        dispatch(setPianoSettings({ ...settings, chordType: e.target.value }));
        player.playChordBlock(settings.chordRootNote, e.target.value);
      }}
    >
      {Object.keys(chordDictionary).map((chord) => (
        <option key={chord} value={chord}>
          {chord}
        </option>
      ))}
    </select>
  );

  const ScaleRootNoteSelect: FC = () => (
    <select
      className="note-select"
      value={settings.scaleRootNote}
      onChange={(e) => changeScaleSelectedNote(parseInt(e.target.value))}
    >
      <NoteOptions />
    </select>
  );
  const ScaleTypeSelect: FC = () => (
    <select
      value={settings.scaleType}
      onChange={(e) =>
        dispatch(setPianoSettings({ ...settings, scaleType: e.target.value }))
      }
    >
      {Object.entries(scalesDictionary).map((scale) => (
        <option key={scale[0]} value={scale[0]}>
          {scale[1].name}
        </option>
      ))}
    </select>
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
              player.playScale(settings.scaleRootNote, settings.scaleType)
            }
            disabled={isPlaying}
          >
            Play scale
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
              player.playChordBlock(settings.chordRootNote, settings.chordType)
            }
            disabled={isPlaying}
          >
            Play Chord
          </button>
          <button
            onClick={() => {
              player.playArpeggio(settings.chordRootNote, settings.chordType);
            }}
            disabled={isPlaying}
          >
            Play Arpeggio
          </button>
        </div>
      </div>
      <ChordPads player={player} />
    </div>
  );
}

export default Buttons;
