import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./components/Navbar/Navbar";
import Piano from "./components/Piano/Piano";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Navbar />
        <main>
          <Piano />
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
