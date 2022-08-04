import { useMemo, useState } from "react";
import { sampler } from "../../piano/sampler";
import { defaultSettings } from "../../piano/settings";
import useMidi from "../../piano/useMidi";
import usePiano from "../../piano/usePiano";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleNote } from "../../redux/pianoSlice";
import Buttons from "./Buttons";

function Piano() {
  const [settings, setSettings] = useState(defaultSettings);
  const selectedKeys = useAppSelector((state) => state.piano.selectedKeys);
  const dispatch = useAppDispatch();
  const { keyboardReady } = useMidi();

  const { isPlaying, player, selectedChord, keysArray } = usePiano({
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

      console.log(selectedKeys);
      console.log(data.id);

      dispatch(toggleNote(data.id));
    };

    return <div className={className} onClick={handleSelect}></div>;
  };

  return (
    <div>
      <h2 style={{ fontSize: "3rem", textTransform: "capitalize" }}>
        Chord Selected: {selectedChord ? selectedChord : "?"}
      </h2>
      {keyboardReady && <div>Keyboard Ready</div>}
      <Buttons
        selectedKeys={selectedKeys}
        player={player}
        settings={settings}
        setSettings={setSettings}
        isPlaying={isPlaying}
      />
      <div style={{ marginTop: "50px" }} id="keyboard">
        {keysArray.map((key) => (
          <PianoKey key={key.id} data={key} selectedKeys={selectedKeys} />
        ))}
      </div>
    </div>
  );
}

export default Piano;
