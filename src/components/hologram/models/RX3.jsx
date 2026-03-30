import HologramMesh from '../HologramMesh';

// Pioneer DDJ-RX3 4-channel performance controller (very wide, flat)
function RX3({ wireOnly = false, lightMode = false }) {
  const leftX   = -1.14;
  const rightX  =  1.14;
  const faderXs = [-0.29, -0.1, 0.1, 0.29];

  return (
    <group>
      {/* Main body */}
      <HologramMesh args={[3.42, 0.19, 1.38]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Left jog wheel */}
      <HologramMesh type="cylinder" args={[0.43, 0.43, 0.09, 48]} position={[leftX, 0.17, -0.08]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh type="cylinder" args={[0.1, 0.1, 0.07, 16]}   position={[leftX, 0.22, -0.08]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Right jog wheel */}
      <HologramMesh type="cylinder" args={[0.43, 0.43, 0.09, 48]} position={[rightX, 0.17, -0.08]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh type="cylinder" args={[0.1, 0.1, 0.07, 16]}   position={[rightX, 0.22, -0.08]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Center mixer section */}
      <HologramMesh args={[0.88, 0.13, 1.36]} position={[0, 0.16, 0]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Channel faders */}
      {faderXs.map((x, i) => (
        <HologramMesh key={`ftrack-${i}`} args={[0.055, 0.07, 0.36]} position={[x, 0.28, 0.4]} wireOnly={wireOnly} lightMode={lightMode} />
      ))}
      {faderXs.map((x, i) => (
        <HologramMesh key={`fknob-${i}`} args={[0.1, 0.07, 0.08]} position={[x, 0.32, 0.32]} wireOnly={wireOnly} lightMode={lightMode} />
      ))}

      {/* Crossfader */}
      <HologramMesh args={[0.52, 0.05, 0.07]} position={[0, 0.28, 0.61]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh args={[0.11, 0.07, 0.09]} position={[-0.06, 0.33, 0.61]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Center EQ knobs */}
      {faderXs.map((x, ci) =>
        [-0.08, 0.08, 0.24].map((z, ri) => (
          <HologramMesh
            key={`eq-${ci}-${ri}`}
            type="cylinder"
            args={[0.042, 0.042, 0.07, 10]}
            position={[x, 0.28, z]}
            wireOnly={wireOnly}
          />
        ))
      )}

      {/* Pitch faders */}
      <HologramMesh args={[0.055, 0.09, 0.42]} position={[leftX + 0.58, 0.17, 0.36]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh args={[0.055, 0.09, 0.42]} position={[rightX - 0.58, 0.17, 0.36]} wireOnly={wireOnly} lightMode={lightMode} />

      {/* Left performance pads (4×2) */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <HologramMesh
            key={`lpad-${col}-${row}`}
            args={[0.12, 0.07, 0.12]}
            position={[leftX - 0.26 + col * 0.155, 0.16, 0.4 + row * 0.16]}
            wireOnly={wireOnly}
          />
        ))
      )}

      {/* Right performance pads (4×2) */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <HologramMesh
            key={`rpad-${col}-${row}`}
            args={[0.12, 0.07, 0.12]}
            position={[rightX - 0.62 + col * 0.155, 0.16, 0.4 + row * 0.16]}
            wireOnly={wireOnly}
          />
        ))
      )}

      {/* Play + cue buttons per deck */}
      <HologramMesh type="cylinder" args={[0.07, 0.07, 0.07, 14]}   position={[leftX + 0.28, 0.17, 0.2]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh type="cylinder" args={[0.055, 0.055, 0.07, 14]} position={[leftX + 0.46, 0.17, 0.2]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh type="cylinder" args={[0.07, 0.07, 0.07, 14]}   position={[rightX - 0.28, 0.17, 0.2]} wireOnly={wireOnly} lightMode={lightMode} />
      <HologramMesh type="cylinder" args={[0.055, 0.055, 0.07, 14]} position={[rightX - 0.46, 0.17, 0.2]} wireOnly={wireOnly} lightMode={lightMode} />
    </group>
  );
}

export default RX3;
