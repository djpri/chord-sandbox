import React from "react";
import { useEffect } from "react";
import Piano from "./components/Piano/Piano";
import useMidi from "./piano/useMidi";

function App() {
  const { onMIDISuccess, onMIDIFailure } = useMidi();
  useEffect(() => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, []);

  return (
    <div>
      <Piano />
    </div>
  );
}

export default App;
