import { chordDictionary } from "../../lib/chords";
import { scalesDictionary } from "../../lib/scales";
import { PlayerSettings } from "../../piano/settings";
import { useAppDispatch } from "../../redux/hooks";
import { clearSelection } from "../../redux/pianoSlice";
import "../../styles/buttons.scss";

function Buttons({ selectedKeys, player, settings, setSettings, isPlaying }) {
  const dispatch = useAppDispatch();
  const changeSelectedNote = (note: number) => {
    setSettings((prevState: PlayerSettings) => ({
      ...prevState,
      chordRootNote: note,
      scaleRootNote: note,
    }));
  };
  const ChangeNoteButton = ({ noteLetter, noteNumber }) => (
    <option
      style={
        settings.chordRootNote === noteNumber
          ? { backgroundColor: "rgb(220, 145, 255)", fontWeight: "bold" }
          : { fontWeight: "bold" }
      }
      value={noteNumber}
    >
      {noteLetter}
    </option>
  );

  const ChordNoteSelect = () => (
    <select
      className="note-select"
      style={{ marginBottom: "10px" }}
      value={settings.chordRootNote}
      onChange={(e) => changeSelectedNote(parseInt(e.target.value))}
    >
      <ChangeNoteButton noteNumber={45} noteLetter={"A"} />
      <ChangeNoteButton noteNumber={46} noteLetter={"A#"} />
      <ChangeNoteButton noteNumber={47} noteLetter={"B"} />
      <ChangeNoteButton noteNumber={48} noteLetter={"C"} />
      <ChangeNoteButton noteNumber={49} noteLetter={"C#"} />
      <ChangeNoteButton noteNumber={50} noteLetter={"D"} />
      <ChangeNoteButton noteNumber={51} noteLetter={"D#"} />
      <ChangeNoteButton noteNumber={52} noteLetter={"E"} />
      <ChangeNoteButton noteNumber={53} noteLetter={"F"} />
      <ChangeNoteButton noteNumber={54} noteLetter={"F#"} />
      <ChangeNoteButton noteNumber={55} noteLetter={"G"} />
      <ChangeNoteButton noteNumber={56} noteLetter={"G#"} />
    </select>
  );
  const ChordTypeSelect = () => (
    <select
      value={settings.chordType}
      onChange={(e) => {
        setSettings((prevState: PlayerSettings) => ({
          ...prevState,
          chordType: e.target.value,
        }));
      }}
    >
      {Object.keys(chordDictionary).map((chord) => (
        <option key={chord} value={chord}>
          {chord}
        </option>
      ))}
    </select>
  );
  const ScaleTypeSelect = () => (
    <select
      value={settings.scaleType}
      onChange={(e) =>
        setSettings((prevState: PlayerSettings) => ({
          ...prevState,
          scaleType: e.target.value,
        }))
      }
    >
      {Object.keys(scalesDictionary).map((scale) => (
        <option key={scale} value={scale}>
          {scale}
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
      <div>
        <h2>Root Note</h2>
        <ChordNoteSelect />
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
        <select>Assign to chord pad</select>
      </div>

      <div>
        <h2>Scales</h2>
        <ScaleTypeSelect />
        <button
          onClick={() =>
            player.playScale(settings.scaleRootNote, settings.scaleType)
          }
          disabled={isPlaying}
        >
          Play scale
        </button>
      </div>

      <h2 className="speed">Speed: ♩ = {settings.arpeggioSpeed}</h2>
      <input
        type="range"
        min="60"
        max="300"
        step="5"
        value={settings.arpeggioSpeed}
        onChange={(e) => {
          setSettings((prevState: PlayerSettings) => ({
            ...prevState,
            arpeggioSpeed: e.target.value,
          }));
        }}
      />
      <div className="chord-pads">
        <button>Pad 1</button>
        <button>Pad 2</button>
        <button>Pad 3</button>
        <button>Pad 4</button>
        <button>Pad 5</button>
        <button>Pad 6</button>
        <button>Pad 7</button>
        <button>Pad 8</button>
        <button>Pad 9</button>
        <button>Pad 10</button>
        <button>Pad 11</button>
        <button>Pad 12</button>
      </div>
    </div>
  );
}

export default Buttons;
