import Piano from "./components/Piano/Piano";
import useMidi from "./piano/useMidi";
import { useAppSelector } from "./redux/hooks";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  const deviceList = useAppSelector((state) => state.midi.deviceList);
  const selectedDevice = useAppSelector((state) => state.midi.selectedDevice);

  const requestMIDIAccess = () => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  };

  return (
    <div>
      <Navbar />
      <main>
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
        <Piano />
      </main>
    </div>
  );
}

export default App;
