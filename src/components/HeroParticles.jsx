import React, { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Use slim, it's more stable

const HeroParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    // This loads the slim version which is lightweight and avoids version conflicts
    await loadSlim(engine);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Particles
        id="heroParticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 40 },
            color: { value: "#22d3ee" }, // Your accent color
            links: { 
              enable: true, 
              color: "#22d3ee", 
              distance: 140, 
              opacity: 0.3 
            },
            move: { 
              enable: true, 
              speed: 0.7 
            },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="h-full w-full"
      />
    </div>
  );
};

export default HeroParticles;