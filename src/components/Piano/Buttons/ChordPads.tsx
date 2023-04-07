import { useEffect, useState } from "react";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ChordPad, ChordPadsList, setChordPads } from "../../../redux/pianoSlice";

function ChordPads({ player, getKeyLetter }) {
  const dispatch = useAppDispatch();
  const [selectedPads, setSelectedPads] = useState({});
  const settings = useAppSelector((state) => state.piano.pianoSettings);
  // const selectedKeys = useAppSelector((state) => state.piano.selectedKeys);
  const chordPads: ChordPadsList = useAppSelector((state) => state.piano.chordPads);
  const chordPadShortCuts = useAppSelector(
    (state) => state.piano.chordPadShortCuts
  );

  const handleClick = (pad: ChordPad, index: number) => {
    setSelectedPads({});
    if (pad) {
      player.playChordBlock(pad[0], pad[1]);
      setSelectedPads({[index]: true})
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const padNumber =
        chordPadShortCuts.findIndex((item) => item === e.key);
      if (padNumber !== -1) {
        setSelectedPads({ [padNumber]: true });
        player.playChordBlock(chordPads[padNumber]?.[0], chordPads[padNumber]?.[1]);
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

  const addNewChordPads = (padIndex: number, rootNote?: number) => {
    const newChordPads: ChordPadsList = [...chordPads];
    newChordPads[padIndex] = [settings.chordRootNote, settings.chordType];
    dispatch(setChordPads(newChordPads));
  }

  const removeSelectedPad = (padIndex: number) => {
    const newChordPads: ChordPadsList = [...chordPads];
    newChordPads[padIndex] = null;
    dispatch(setChordPads(newChordPads));
  }

  return (
    <div className="chord-pads-section">
      <h2 style={{ display: "block" }}>Chord Pads:</h2>
      <div className="chord-pads">
        {chordPads.map((pad: ChordPad, index: number) => (
          <div className="chord-pad" key={index}>
            <button
              onClick={() => handleClick(pad, index)}
              style={{ backgroundColor: selectedPads[index] && "#dec1fa" }}
            >
              {pad !== null
                ? `${getKeyLetter(pad[0]).toUpperCase()} ${pad[1]}`
                : index + 1}
            </button>
            <div className="chord-pad-options">
              <button
                className="chord-pad-add"
                onClick={() => addNewChordPads(index)}
              >
                <IoMdAddCircleOutline />
              </button>
              <button
                className="chord-pad-remove"
                onClick={() => removeSelectedPad(index)}
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
