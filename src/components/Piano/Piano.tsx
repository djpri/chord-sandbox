import { FC } from "react";
import { PianoKey } from "piano/types";
import usePiano from "piano/usePiano";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { toggleNote } from "redux/pianoSlice";
import Buttons from "./Buttons/Buttons";
import { isInDevelopment } from "helpers/environment";
import useMidi from "piano/useMidi";
import { sampler } from "piano/sampler";
import useKeyboardAsPiano from "piano/useKeyboardAsPiano";
import { noteNumberToKeyboardLetter } from "lib/keyNamesDictionary";

type PianoKeyProps = {
  keyData: PianoKey;
  selectedKeys: Record<string, boolean>;
};

function Piano() {
  const dispatch = useAppDispatch();
  const pianoState = useAppSelector((state) => state.piano);
  const { keyboardReady } = useMidi();
  useKeyboardAsPiano();

  const { player, selectedChord, keysArray, getKeyLetter } = usePiano({
    startingLetter: "C",
    numberOfKeys: 36,
    player: sampler,
    arpeggioSpeed: pianoState.arpeggioSpeed,
  });

  const PianoKey: FC<PianoKeyProps> = ({ keyData, selectedKeys }) => {
    const midiNumberOfKey = keyData.id;
    const styles: React.CSSProperties = {}
    const isInScale = pianoState.isPlaying && pianoState.scaleNoteNumbers.includes(parseInt(keyData.id));
    const isSelected = pianoState.selectedKeys[keyData.id];
    if (isInScale && !isSelected) {
      styles.background = "linear-gradient(90deg, hsl(49, 50%, 77%), hsl(49, 50%, 79%), hsl(49, 50%, 64%))"
      styles.boxShadow = "inset 2px -1px 5px 9px #f5f22c6e;"
    }
    const className = `${keyData.className} ${selectedKeys[keyData.id] && "selected"}`;

    const onMouseDown = () => {
      sampler.triggerAttack(keyData.note);
      dispatch(toggleNote(parseInt(keyData.id)));
    };
    const onMouseUp = () => {
      sampler.triggerRelease(keyData.note, '+0.05');
    };

    return (
      <div className={className} onMouseDown={onMouseDown} onMouseUp={onMouseUp} style={styles}>
        {isInDevelopment && midiNumberOfKey}
        {/* {noteNumberToKeyboardLetter()[keyData.id]} */}
      </div>
    );
  };

  const SelectedChordOrNote: FC = () => {
    if (pianoState.currentNote && pianoState.isPlaying) {
      return <h2 className="selected-chord">{pianoState.currentNote}</h2>;
    }
    return (
      <h2 className="selected-chord">
        {selectedChord
          ? `${getKeyLetter(selectedChord[0])} ${selectedChord[1]}`
          : "-"}
      </h2>
    );
  };

  return (
    <div>
      {keyboardReady && <div>Keyboard Ready</div>}
      <Buttons getKeyLetter={getKeyLetter} player={player} />
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
