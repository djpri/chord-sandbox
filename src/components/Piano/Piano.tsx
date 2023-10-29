import usePianoPlayer from "piano/player/usePianoPlayer";
import { sampler } from "piano/sampler";
import useKeyboardAsPiano from "piano/useKeyboardAsPiano";
import useMidi from "piano/useMidi";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { setView } from "redux/pianoSlice";
import Buttons from "./Buttons/Buttons";
import PianoCanvasView from "./PianoCanvasView";
import PianoDefaultView from "./PianoDefaultView";

function Piano() {
  const pianoState = useAppSelector((state) => state.piano);

  const dispatch = useAppDispatch();
  const { keyboardReady } = useMidi();
  useKeyboardAsPiano();

  const { playerActions, chordName, keysArray } = usePianoPlayer({
    startingLetter: "C",
    numberOfKeys: 36,
    player: sampler,
  });

  const SelectedChordOrNote: FC = () => {
    if (pianoState.currentNote && pianoState.isPlaying) {
      return <h2 className="selected-chord">{pianoState.currentNote}</h2>;
    }
    return (
      <h2 className="selected-chord" title="Detected Chord">
        {chordName}
      </h2>
    );
  };

  return (
    <div>
      {keyboardReady && <div>Keyboard Ready</div>}
      <Buttons actions={playerActions} />
      <div className="bottom-panel">
        <div className="bottom-panel-info">
          <SelectedChordOrNote />
          <select
            className="view-select"
            value={pianoState.view}
            onChange={(e) => dispatch(setView(e.target.value as "default" | "modern"))}
          >
            <option value={"default"}>Default</option>
            <option value={"modern"}>Modern</option>
          </select>
        </div>

        {pianoState.view === "default" && <PianoDefaultView keysArray={keysArray} />}

        {pianoState.view === "modern" && <PianoCanvasView />}
      </div>
    </div>
  );
}

export default Piano;
