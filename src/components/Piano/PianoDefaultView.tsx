import DevOnly from "components/DevOnly";
import { sampler } from "piano/sampler";
import { PianoKey } from "piano/types";
import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { toggleNote } from "redux/pianoSlice";

type PianoKeyProps = {
  keyData: PianoKey;
  selectedKeys: Record<string, boolean>;
};

function PianoDefaultView({ keysArray }) {
  const pianoState = useAppSelector((state) => state.piano);
  const dispatch = useAppDispatch();

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

  return (
    <div id="keyboard">
      {keysArray.map((key: PianoKey) => (
        <PianoKey
          key={key.id}
          keyData={key}
          selectedKeys={pianoState.selectedKeys}
        />
      ))}
    </div>
  );
}

export default PianoDefaultView;
