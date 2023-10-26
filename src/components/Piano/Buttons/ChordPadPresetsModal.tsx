import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

function ChordPadPresetsModal({ onClose }) {
  const [isFadedIn, setIsFadedIn] = useState(false);
  const insideContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFadedIn(true);
  }, []);

  return ReactDOM.createPortal(
    <div
      className={isFadedIn ? "modal-overlay faded-in" : "modal-overlay"}
      onClick={(e) => {
        if (!insideContent?.current?.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        className={isFadedIn ? "modal-content faded-in" : "modal-content"}
        ref={insideContent}
      >
        chord pad presets
      </div>
    </div>,
    document.getElementById("root") as HTMLElement
  );
}

export default ChordPadPresetsModal;
