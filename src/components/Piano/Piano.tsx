import { FC, useMemo } from "react";
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

    const className = useMemo(() => {
      if (selectedKeys[keyData.id]) {
        return `${keyData.className} selected`;
      } else {
        return keyData.className;
      }
    }, [selectedKeys]);

    const handleSelect = () => {
      sampler.triggerAttackRelease(keyData.note, "4n");
      dispatch(toggleNote(parseInt(keyData.id)));
    };

    const handleKeyPress = () => {

    }

    return (
      <div className={className} onClick={handleSelect}>
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
