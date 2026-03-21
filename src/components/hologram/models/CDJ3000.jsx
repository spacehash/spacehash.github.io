import HologramMesh from '../HologramMesh';

// Pioneer CDJ-3000 media player (~320mm wide × 415mm deep × 65mm tall)
function CDJ3000({ wireOnly = false }) {
  return (
    <group>
      {/* Main body */}
      <HologramMesh args={[2.4, 0.26, 1.68]} wireOnly={wireOnly} />

      {/* Jog wheel platter */}
      <HologramMesh type="cylinder" args={[0.63, 0.63, 0.1, 52]} position={[-0.38, 0.2, 0.06]} wireOnly={wireOnly} />

      {/* Jog wheel hub */}
      <HologramMesh type="cylinder" args={[0.13, 0.13, 0.08, 18]} position={[-0.38, 0.27, 0.06]} wireOnly={wireOnly} />

      {/* Screen */}
      <HologramMesh args={[0.74, 0.07, 0.54]} position={[0.58, 0.18, -0.2]} wireOnly={wireOnly} />

      {/* Screen outer bezel */}
      <HologramMesh args={[0.82, 0.02, 0.62]} position={[0.58, 0.21, -0.2]} wireOnly={wireOnly} />

      {/* Pitch fader track */}
      <HologramMesh args={[0.06, 0.06, 0.58]} position={[1.09, 0.18, 0.1]} wireOnly={wireOnly} />

      {/* Pitch fader knob */}
      <HologramMesh args={[0.14, 0.07, 0.1]} position={[1.09, 0.23, 0.1]} wireOnly={wireOnly} />

      {/* Play button */}
      <HologramMesh type="cylinder" args={[0.09, 0.09, 0.06, 18]} position={[0.38, 0.19, 0.56]} wireOnly={wireOnly} />

      {/* Cue button */}
      <HologramMesh type="cylinder" args={[0.07, 0.07, 0.06, 18]} position={[0.63, 0.19, 0.56]} wireOnly={wireOnly} />

      {/* Hot cue / loop pads */}
      {[-0.16, 0.06, 0.28, 0.50].map((x, i) => (
        <HologramMesh key={i} args={[0.14, 0.06, 0.1]} position={[x, 0.19, 0.64]} wireOnly={wireOnly} />
      ))}

      {/* USB slot */}
      <HologramMesh args={[0.2, 0.07, 0.04]} position={[-0.82, 0.06, 0.84]} wireOnly={wireOnly} />

      {/* Browse knob */}
      <HologramMesh type="cylinder" args={[0.07, 0.07, 0.08, 14]} position={[0.14, 0.21, 0.42]} wireOnly={wireOnly} />
    </group>
  );
}

export default CDJ3000;
