import { FC } from "react";
import { sampler } from "../../piano/sampler";
import { PianoKey } from "../../piano/types";
import useMidi from "../../piano/useMidi";
import usePiano from "../../piano/usePiano";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleNote } from "../../redux/pianoSlice";
import Buttons from "./Buttons/Buttons";

type PianoKeyProps = {
  keyData: PianoKey;
  selectedKeys: Record<string, boolean>;
};

function Piano() {
  const dispatch = useAppDispatch();
  const pianoState = useAppSelector((state) => state.piano);
  const { keyboardReady } = useMidi();

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
      styles.background = "linear-gradient(90deg, rgb(244, 250, 193), rgb(241, 255, 159), rgb(215, 255, 72))"
      styles.boxShadow = "inset 2px -1px 5px 9px #f2f52c;"
    }
    const className = `${keyData.className} ${selectedKeys[keyData.id] && "selected"}`;

    const handleSelect = () => {
      sampler.triggerAttackRelease(keyData.note, "4n");
      dispatch(toggleNote(parseInt(keyData.id)));
    };
    // const handleKeyPress = () => {

    // }
    return (
      <div className={className} onClick={handleSelect} style={styles}>
        {midiNumberOfKey}
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
