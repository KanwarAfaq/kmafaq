import React, { useEffect, useState } from "react";

const CustomCursor = ({ color = "#6366f1" }) => { // Defaulted to your accent indigo
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    
    const addHover = () => setHoveringInteractive(true);
    const removeHover = () => setHoveringInteractive(false);

    window.addEventListener("pointermove", move);
    
    const elements = document.querySelectorAll("a, button, [role='button'], [data-cursor='interactive']");
    elements.forEach((el) => {
      el.addEventListener("pointerenter", addHover);
      el.addEventListener("pointerleave", removeHover);
    });

    return () => {
      window.removeEventListener("pointermove", move);
      elements.forEach((el) => {
        el.removeEventListener("pointerenter", addHover);
        el.removeEventListener("pointerleave", removeHover);
      });
    };
  }, []);

  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference transition-transform duration-75"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, backgroundColor: color }}
      />
      <div
        className={`pointer-events-none fixed z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-opacity-70 mix-blend-difference transition-all duration-150 ${hoveringInteractive ? "scale-150 bg-opacity-10" : "scale-100"}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, borderColor: color }}
      />
    </>
  );
};
export default CustomCursor;