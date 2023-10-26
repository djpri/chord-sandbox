import DevOnly from "components/DevOnly";
import usePianoPlayer from "piano/player/usePianoPlayer";
import { sampler } from "piano/sampler";
import { PianoKey } from "piano/types";
import useKeyboardAsPiano from "piano/useKeyboardAsPiano";
import useMidi from "piano/useMidi";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { toggleNote } from "redux/pianoSlice";
import Buttons from "./Buttons/Buttons";

type PianoKeyProps = {
  keyData: PianoKey;
  selectedKeys: Record<string, boolean>;
};

function Piano() {
  const dispatch = useAppDispatch();
  const { keyboardReady } = useMidi();
  useKeyboardAsPiano();

  const { pianoState, playerActions, chordName, keysArray } = usePianoPlayer({
    startingLetter: "C",
    numberOfKeys: 36,
    player: sampler,
  });

  const PianoKey: FC<PianoKeyProps> = ({ keyData, selectedKeys }) => {
    const midiNumberOfKey = keyData.id;
    const styles: React.CSSProperties = {};
    const isInScale = pianoState.scaleNoteNumbers.includes(
      parseInt(keyData.id)
    );
    const isSelected = pianoState.selectedKeys[keyData.id];
    if (isInScale && !isSelected) {
      styles.background =
        "linear-gradient(90deg, hsl(49, 50%, 77%), hsl(49, 50%, 79%), hsl(49, 50%, 64%))";
    }
    const className = `${keyData.className} ${
      selectedKeys[keyData.id] && "selected"
    }`;

    const onMouseDown = () => {
      sampler.triggerAttack(keyData.note);
      dispatch(toggleNote(parseInt(keyData.id)));
    };
    const onMouseUp = () => {
      sampler.triggerRelease(keyData.note, "+0.05");
    };

    return (
      <div
        className={className}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={styles}
      >
        <DevOnly>{midiNumberOfKey}</DevOnly>
      </div>
    );
  };

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
        <SelectedChordOrNote />
        <div id="keyboard">
          {keysArray.map((key: PianoKey) => (
            <PianoKey
              key={key.id}
              keyData={key}
              selectedKeys={pianoState.selectedKeys}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Piano;
