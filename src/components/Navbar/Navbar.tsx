import { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import useMidi from "../../piano/useMidi";
import { useAppSelector } from "../../redux/hooks";

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  const deviceList = useAppSelector((state) => state.midi.deviceList);
  const selectedDevice = useAppSelector((state) => state.midi.selectedDevice);

  const requestMIDIAccess = () => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  };

  const Modal = () => {
    const [isFadedIn, setIsFadedIn] = useState(false);

    useEffect(() => {
      setIsFadedIn(true);
    }, []);

    return (
      <div
        className={isFadedIn ? "modal-overlay faded-in" : "modal-overlay"}
        onClick={() => setIsModalOpen(false)}
      >
        <div className={isFadedIn ? "modal-content faded-in" : "modal-content"}>
          <h2>Settings</h2>
          <div className="midi-settings">
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
