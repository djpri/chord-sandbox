import React from "react";
import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import useMidi from "../../piano/useMidi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSingleChordPadShortCut } from "../../redux/pianoSlice";

const padNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  const deviceList = useAppSelector((state) => state.midi.deviceList);
  const selectedDevice = useAppSelector((state) => state.midi.selectedDevice);

  const requestMIDIAccess = async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      onMIDISuccess(midiAccess);
    } catch (error) {
      onMIDIFailure(error);
    }
  };

  const Modal = () => {
    const [isFadedIn, setIsFadedIn] = useState(false);
    const [padToAssign, setPadToAssign] = useState<number | null>(null);
    const insideContent = useRef<HTMLDivElement>(null);
    const shortcuts = useAppSelector((state) => state.piano.chordPadShortCuts);
    const dispatch = useAppDispatch();

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

    return (
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
                  <button onClick={() => setPadToAssign(number)}>
                    {number}
                  </button>
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
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src="/favicon.png" height="20px" />
        <IoMdSettings
          className="settings-icon"
          size="1.5rem"
          style={{ cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
        {isModalOpen && <Modal />}
      </div>
    </nav>
  );
}

export default Navbar;
