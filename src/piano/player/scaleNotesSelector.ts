import { getAllNotesInScale } from "lib/scales";
import { useAppDispatch } from "redux/hooks";
import { setScaleNoteNumbers } from "redux/pianoSlice";

function scaleNotesSelector() {
  const dispatch = useAppDispatch();

  const highlightScaleNotes = (rootNote = 48, scaleType = "minorHarmonic") => {
    dispatch(setScaleNoteNumbers(getAllNotesInScale(rootNote, scaleType, true)));
  };
  
  return {
    highlightScaleNotes,
  };
}

export default scaleNotesSelector;
