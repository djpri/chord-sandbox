import Piano from "./components/Piano/Piano";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Piano />
      </main>
    </div>
  );
}

export default App;
