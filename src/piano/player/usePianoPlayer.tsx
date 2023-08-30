import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  clearSelection,
  setIsPlaying,
  setPianoStartKey,
  setScaleNoteNumbers,
} from "../../redux/pianoSlice";
import { sampler, synth, volume } from "../sampler";
import { PianoConfig } from "../types";
import usePianoSelectors from "../usePianoSelectors";
import arpeggioPlayer from "./arpeggioPlayer";
import chordPlayer from "./chordPlayer";
import scalesPlayer from "./scalesPlayer";
import scaleNotesSelector from "./scaleNotesSelector";

function usePianoPlayer(
  config: PianoConfig = {
    startingLetter: "C",
    numberOfKeys: 36,
    player: synth,
    arpeggioSpeed: 200,
  }
) {
  const dispatch = useAppDispatch();
  const { getKeyLetter, keysArray, selectedChord, chordName } =
    usePianoSelectors();
  const playScale = scalesPlayer(config);
  const { playChordBlock, playManualChordBlock } = chordPlayer(config);
  const { highlightScaleNotes } = scaleNotesSelector();
  const playArpeggio = arpeggioPlayer(config);

  useEffect(() => {
    setPianoStartKey(config.startingLetter);
    dispatch(setIsPlaying(false));
    dispatch(clearSelection());
    dispatch(setScaleNoteNumbers([]));
  }, []);

  useEffect(() => {
    config.player.connect(volume);
    return () => {
      config.player.disconnect(volume);
    };
  }, [sampler]);

  return {
    selectedChord,
    chordName,
    keysArray,
    playerActions: {
      playArpeggio,
      playChordBlock,
      playManualChordBlock,
      playScale,
      highlightScaleNotes
    },
    getKeyLetter,
  };
}

export default usePianoPlayer;

export type PlayerActions = ReturnType<typeof usePianoPlayer>["playerActions"];