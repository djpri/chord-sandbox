import { useEffect, useState } from "react";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  ChordPad,
  ChordPadsList,
  resetChordPads,
  setChordPads,
} from "../../../redux/pianoSlice";

function ChordPads({ player, getKeyLetter }) {
  const dispatch = useAppDispatch();
  const [selectedPads, setSelectedPads] = useState({});
  const { settings, selectedKeys, chordPads } = useAppSelector(
    (state) => state.piano
  );
  const chordPadShortCuts = useAppSelector(
    (state) => state.piano.chordPadShortCuts
  );
  const selectedKeysArray = Object.keys(selectedKeys)
    ?.filter((key) => selectedKeys[key] === true)
    ?.map((item) => parseInt(item));

  const handlePlayChordPad = (pad: ChordPad, index: number) => {
    setSelectedPads({});
    if (pad) {
      // player.playChordBlock(pad.rootNote, pad.chordType);
      if (pad.selectedNotes) {
        player.playManualChordBlock(pad.selectedNotes);
      }
      setSelectedPads({ [index]: true });
    }
  };

  const handleAddChordPad = (padIndex: number) => {
    const newChordPads: ChordPadsList = [...chordPads];
    newChordPads[padIndex] = {
      rootNote: settings.selectedChord?.rootNote || null,
      chordType: settings.selectedChord?.chordType || null,
      selectedNotes: selectedKeysArray || null,
    };
    dispatch(setChordPads(newChordPads));
  };

  const handleRemoveChordPad = (padIndex: number) => {
    const newChordPads: ChordPadsList = [...chordPads];
    newChordPads[padIndex] = null;
    dispatch(setChordPads(newChordPads));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const padNumber = chordPadShortCuts.findIndex((item) => item === e.key);
      if (padNumber !== -1) {
        handlePlayChordPad(chordPads[padNumber], padNumber);
      } else {
        setSelectedPads({});
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setSelectedPads({});
    };
  }, [chordPads, chordPadShortCuts]);

  const getPadName = (pad, index) => {
    if (!pad) return index + 1;
    if (!pad.rootNote || !pad.chordType) return "-"
    return `${getKeyLetter(pad.rootNote).toUpperCase()} ${pad.chordType}`
  }

  return (
    <div className="chord-pads-section">
      <div className="chord-pads-heading">
        <h2>Chord Pads:</h2>
        <button onClick={() => dispatch(resetChordPads())}>
          Clear all pads
        </button>
      </div>
      <div className="chord-pads">
        {chordPads.map((pad: ChordPad, index: number) => (
          <div className="chord-pad" key={index}>
            <button
              onClick={() => handlePlayChordPad(pad, index)}
              style={{ backgroundColor: selectedPads[index] && "#dec1fa" }}
            >
              {getPadName(pad, index)}
            </button>
            <div className="chord-pad-options">
              <button
                className="chord-pad-add"
                title="Add selected chord"
                onClick={() => handleAddChordPad(index)}
                disabled={selectedKeysArray.length < 3}
              >
                <IoMdAddCircleOutline />
              </button>
              <button
                className="chord-pad-remove"
                title="Remove chord pad"
                disabled={pad === null}
                onClick={() => handleRemoveChordPad(index)}
              >
                <IoMdRemoveCircleOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChordPads;
