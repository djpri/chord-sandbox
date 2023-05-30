import { volume } from "piano/sampler";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IoMdSettings } from "react-icons/io";
import useMidi from "../../piano/useMidi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSingleChordPadShortCut } from "../../redux/pianoSlice";

const padNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Modal = ({ setIsModalOpen }) => {
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  const insideContent = useRef<HTMLDivElement>(null);
  const [isFadedIn, setIsFadedIn] = useState(false);
  const [padToAssign, setPadToAssign] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const shortcuts = useAppSelector((state) => state.piano.chordPadShortCuts);
  const { deviceList, selectedDevice } = useAppSelector((state) => state.midi);

  const requestMIDIAccess = async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      onMIDISuccess(midiAccess);
    } catch (error) {
      onMIDIFailure(error);
    }
  };

  useEffect(() => {
    setIsFadedIn(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyPressed = e.key;
      if (padToAssign !== null) {
        if (keyPressed === "Escape") {
          e.preventDefault();
          setPadToAssign(null);
        } else {
          dispatch(setSingleChordPadShortCut([padToAssign - 1, keyPressed]));
          setPadToAssign(null);
        }
      }
    };
    if (padToAssign !== null) {
      document.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [padToAssign]);

  return ReactDOM.createPortal(
    <div
      className={isFadedIn ? "modal-overlay faded-in" : "modal-overlay"}
      onClick={(e) => {
        if (!insideContent?.current?.contains(e.target as Node)) {
          setIsModalOpen(false);
        }
      }}
    >
      <div
        className={isFadedIn ? "modal-content faded-in" : "modal-content"}
        ref={insideContent}
      >
        <h2>Settings</h2>
        <div className="midi-settings">
          <h4>Midi</h4>
          <button
            onClick={requestMIDIAccess}
            style={{ cursor: "pointer" }}
            disabled={deviceList.length > 0}
          >
            Connect Midi Device
          </button>
          {deviceList.length > 0 && selectedDevice && (
            <h4>Connected: {selectedDevice}</h4>
          )}
        </div>
        <div>
          <h4>Chord pad shortcuts</h4>
          <div className="chord-pad-shortcut-options">
            {padNumbers.map((number) => (
              <React.Fragment key={number}>
                <button onClick={() => setPadToAssign(number)}>{number}</button>
                <p>
                  {padToAssign === number
                    ? "waiting for keypress... (esc to cancel)"
                    : shortcuts[number - 1]}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root") as HTMLElement
  );
};

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volumeState, setVolumeState] = useState(100);
  const [decibel, setDecibels] = useState("");

  useEffect(() => {
    const decibels = mapRange(
      volumeState,
      0,
      100,
      -60,
      0
    );
    setDecibels((Math.round(decibels * 100) / 100).toFixed(2))
    volume.volume.value = decibels;
  }, [volumeState]);

  function mapRange(value, inMin, inMax, outMin, outMax) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    const normalizedValue = (value - inMin) / inRange;
    const mappedValue = Math.pow(normalizedValue, 0.5) * outRange + outMin;
    return mappedValue;
  }

  const handleVolumeChange = (e) => {
    setVolumeState(parseInt(e.target.value));
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src="/favicon.png" height="20px" />
        <div className="navbar-middle">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volumeState}
            className="slider"
            onChange={handleVolumeChange}
          />
          <p>{decibel}dB</p>
        </div>

        <IoMdSettings
          className="settings-icon"
          size="1.5rem"
          style={{ cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
        {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
      </div>
    </nav>
  );
}

export default Navbar;
