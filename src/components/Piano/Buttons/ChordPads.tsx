import { useEffect, useState } from "react";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setChordPads } from "../../../redux/pianoSlice";

function ChordPads({ player, getKeyLetter }) {
  const dispatch = useAppDispatch();
  const [selectedPads, setSelectedPads] = useState({});
  const settings = useAppSelector((state) => state.piano.pianoSettings);
  const chordPads = useAppSelector((state) => state.piano.chordPads);
  const chordPadShortCuts = useAppSelector(
    (state) => state.piano.chordPadShortCuts
  );

  const handleClick = (pad) => {
    setSelectedPads({});
    if (pad[1]) {
      player.playChordBlock(pad[1][0], pad[1][1]);
      setSelectedPads({[pad[0]]: true})
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const padNumber =
        chordPadShortCuts.findIndex((item) => item === e.key) + 1;
      if (chordPads[padNumber]) {
        setSelectedPads({ [padNumber]: true });
        player.playChordBlock(chordPads[padNumber][0], chordPads[padNumber][1]);
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

  return (
    <div className="chord-pads-section">
      <h2 style={{ display: "block" }}>Chord Pads:</h2>
      <div className="chord-pads">
        {Object.entries<string | null>(chordPads).map((pad, index) => (
          <div className="chord-pad" key={pad[0]}>
            <button
              onClick={() => handleClick(pad)}
              style={{ backgroundColor: selectedPads[index + 1] && "#dec1fa" }}
            >
              {pad[1] !== null
                ? `${getKeyLetter(pad[1][0]).toUpperCase()} ${pad[1][1]}`
                : pad[0]}
            </button>
            <div className="chord-pad-options">
              <button
                className="chord-pad-add"
                onClick={() =>
                  dispatch(
                    setChordPads({
                      ...chordPads,
                      [pad[0]]: [settings.chordRootNote, settings.chordType],
                    })
                  )
                }
              >
                <IoMdAddCircleOutline />
              </button>
              <button
                className="chord-pad-remove"
                onClick={() =>
                  dispatch(
                    setChordPads({
                      ...chordPads,
                      [pad[0]]: null,
                    })
                  )
                }
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
