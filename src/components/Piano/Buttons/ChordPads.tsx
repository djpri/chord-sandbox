import DevOnly from "components/DevOnly";
import type { Identifier } from "dnd-core";
import { ItemTypes } from "dnd/itemTypes";
import useDisclosure from "hooks/useDisclosure";
import { PlayerActions } from "piano/player/usePianoPlayer";
import usePianoSelectors from "piano/usePianoSelectors";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  ChordPad,
  ChordPadsList,
  handleChordPadDrop,
  resetChordPads,
  setChordPads,
} from "../../../redux/pianoSlice";
import ChordPadPresetsModal from "./ChordPadPresetsModal";

interface ChordPadProps {
  pad: ChordPad;
  index: number;
  disabled: boolean;
  padId: number;
  selectedPads: Record<number, boolean>;
  handleAdd: (index: number) => void;
  handleRemove: (index: number) => void;
  handlePlay: (pad: ChordPad, index: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function Pad({
  pad,
  index,
  disabled,
  selectedPads,
  handleAdd,
  handleRemove: handleRemove,
  handlePlay: handlePlay,
}: ChordPadProps) {
  const { getKeyLetter } = usePianoSelectors();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLButtonElement>(null);
  const [buttonClass, setButtonClass] = useState("");

  const [collected, drag] = useDrag(() => ({
    type: ItemTypes.CHORD_PAD,
    item: { id: index + 1 },
  }));
  const [{ isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; isOver: boolean }
  >({
    accept: ItemTypes.CHORD_PAD,
    // The collecting function.
    // It should return a plain object of the props to return for injection into your component
    collect(monitor) {
      // setButtonClass("");
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(_, monitor) {
      if (!ref.current || !monitor.canDrop()) {
        return;
      }
      if (buttonClass === "") {
        setButtonClass("dragged");
      }
    },
    // Called when a compatible item is dropped on the target.
    drop(itemBeingDragged) {
      dispatch(
        handleChordPadDrop({
          dragSourceIndex: index,
          dropDestinationIndex: parseInt(itemBeingDragged.id) - 1,
        })
      );
      setButtonClass("");
    },
  });

  // Reset buttonClass state when hovering stops
  useEffect(() => {
    setButtonClass("");
  }, [isOver]);

  const getPadName = (pad, index) => {
    if (!pad) return index + 1;
    if (!pad.rootNote || !pad.chordType) return "-";
    return `${getKeyLetter(pad.rootNote).toUpperCase()} ${pad.chordType}`;
  };

  drag(drop(ref));

  return (
    <div className="chord-pad" key={index}>
      <button
        className={buttonClass}
        ref={ref}
        onClick={() => handlePlay(pad, index)}
        style={selectedPads[index] ? { backgroundColor: "#dec1fa" } : {}}
      >
        {getPadName(pad, index)}{" "}
        <DevOnly>
          <i style={{ color: "blue" }}>{index + 1}</i>
        </DevOnly>
      </button>
      <div className="chord-pad-options">
        <button
          className="chord-pad-add"
          title="Add selected chord"
          onClick={() => handleAdd(index)}
          disabled={disabled}
        >
          <IoMdAddCircleOutline />
        </button>
        <button
          className="chord-pad-remove"
          title="Remove chord pad"
          disabled={pad === null}
          onClick={() => handleRemove(index)}
        >
          <IoMdRemoveCircleOutline />
        </button>
      </div>
    </div>
  );
}

function ChordPads({ actions }: { actions: PlayerActions }) {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleAddChordPad = (padIndex: number) => {
    const newChordPads: ChordPadsList = [...chordPads];
    newChordPads[padIndex] = {
      padId: padIndex + 1,
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

  const handlePlayChordPad = (pad: ChordPad, index: number) => {
    setSelectedPads({});
    if (pad) {
      // player.playChordBlock(pad.rootNote, pad.chordType);
      if (pad.selectedNotes) {
        actions.playManualChordBlock(pad.selectedNotes);
      }
      setSelectedPads({ [index]: true });
    }
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

  return (
    <div className="chord-pads-section">
      <div className="chord-pads-heading">
        <h2>Chord Pads:</h2>
        <div>
          <button onClick={onOpen}>Load Preset</button>
          <button onClick={() => dispatch(resetChordPads())}>
            Clear all pads
          </button>
        </div>
      </div>
      <div className="chord-pads">
        {chordPads.map((pad: ChordPad, index: number) => (
          <Pad
            key={index}
            pad={pad}
            index={index}
            disabled={selectedKeysArray.length < 3}
            padId={pad === null ? index + 1 : pad.padId}
            selectedPads={selectedPads}
            handlePlay={handlePlayChordPad}
            handleAdd={handleAddChordPad}
            handleRemove={handleRemoveChordPad}
          />
        ))}
      </div>
      {isOpen && <ChordPadPresetsModal onClose={onClose} />}
    </div>
  );
}

export default ChordPads;
