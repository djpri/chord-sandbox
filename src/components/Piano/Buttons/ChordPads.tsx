import { useEffect } from "react";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setChordPads } from "../../../redux/pianoSlice";

const playPadShortCuts = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "=",
];

// const assignPadShortCuts = [
//   "a",
//   "s",
//   "d",
//   "f",
//   "g",
//   "h",
//   "j",
//   "k",
//   "l",
//   ";",
//   "'",
// ];

function ChordPads({ player, getKeyLetter }) {
  const dispatch = useAppDispatch();
  const chordPads = useAppSelector((state) => state.piano.chordPads);
  const settings = useAppSelector((state) => state.piano.pianoSettings);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const padNumber =
        playPadShortCuts.findIndex((item) => item === e.key) + 1;
      if (chordPads[padNumber]) {
        player.playChordBlock(chordPads[padNumber][0], chordPads[padNumber][1]);
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [chordPads, playPadShortCuts]);

  return (
    <div className="chord-pads">
      {Object.entries<string | null>(chordPads).map((pad) => (
        <div className="chord-pad" key={pad[0]}>
          <button
            onClick={() =>
              pad[1] && player.playChordBlock(pad[1][0], pad[1][1])
            }
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
  );
}

export default ChordPads;
