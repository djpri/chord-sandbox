import React from "react";
import { useEffect } from "react";
import Piano from "./components/Piano/Piano";
import useMidi from "./piano/useMidi";

function App() {
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  const requestMIDIAccess = () => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  };

  return (
    <div>
      <button onClick={requestMIDIAccess} style={{ cursor: "pointer" }}>
        Request Midi Access
      </button>
      <Piano />
    </div>
  );
}

export default App;
