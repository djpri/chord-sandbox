import { useMemo } from "react";
import { sampler } from "../../piano/sampler";
import useMidi from "../../piano/useMidi";
import usePiano from "../../piano/usePiano";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleNote } from "../../redux/pianoSlice";
import Buttons from "./Buttons/Buttons";

function Piano() {
  const selectedKeys = useAppSelector((state) => state.piano.selectedKeys);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.piano.pianoSettings);
  const { keyboardReady } = useMidi();

  const { player, selectedChord, keysArray, getKeyLetter } = usePiano({
    startingLetter: "C",
    numberOfKeys: 36,
    player: sampler,
    arpeggioSpeed: settings.arpeggioSpeed,
  });

  const PianoKey = ({ data, selectedKeys }) => {
    const className = useMemo(() => {
      if (selectedKeys[data.id]) {
        return `${data.className} selected`;
      } else {
        return data.className;
      }
    }, [selectedKeys]);

    const handleSelect = () => {
      sampler.triggerAttackRelease(data.note, "8n");
      dispatch(toggleNote(data.id));
    };

    return (
      <div className={className} onClick={handleSelect}>
        {data.id}
      </div>
    );
  };

  return (
    <div>
      {keyboardReady && <div>Keyboard Ready</div>}
      <Buttons getKeyLetter={getKeyLetter} player={player} />
      <h2 className="selected-chord">
        {selectedChord
          ? `${getKeyLetter(selectedChord[0])} ${selectedChord[1]}`
          : "-"}
      </h2>
      <div style={{ marginTop: "50px" }} id="keyboard">
        {keysArray.map((key) => (
          <PianoKey key={key.id} data={key} selectedKeys={selectedKeys} />
        ))}
      </div>
    </div>
  );
}

export default Piano;
