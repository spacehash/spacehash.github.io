import HologramMesh from '../HologramMesh';

// Pioneer DJM-A9 4-channel mixer
function DJMA9({ wireOnly = false }) {
  const channelXs = [-0.39, -0.13, 0.13, 0.39];

  return (
    <group>
      {/* Main body */}
      <HologramMesh args={[1.08, 0.38, 1.68]} wireOnly={wireOnly} />

      {/* Channel fader tracks */}
      {channelXs.map((x, i) => (
        <HologramMesh key={`ftrack-${i}`} args={[0.05, 0.06, 0.46]} position={[x, 0.24, 0.44]} wireOnly={wireOnly} />
      ))}

      {/* Channel fader knobs */}
      {channelXs.map((x, i) => (
        <HologramMesh key={`fknob-${i}`} args={[0.11, 0.07, 0.09]} position={[x, 0.28, 0.36]} wireOnly={wireOnly} />
      ))}

      {/* Crossfader track */}
      <HologramMesh args={[0.68, 0.05, 0.06]} position={[0, 0.24, 0.72]} wireOnly={wireOnly} />

      {/* Crossfader knob */}
      <HologramMesh args={[0.13, 0.07, 0.1]} position={[-0.08, 0.29, 0.72]} wireOnly={wireOnly} />

      {/* EQ knobs: High / Mid / Low per channel */}
      {channelXs.map((x, ci) =>
        [-0.26, -0.06, 0.14].map((z, ri) => (
          <HologramMesh
            key={`eq-${ci}-${ri}`}
            type="cylinder"
            args={[0.046, 0.046, 0.08, 10]}
            position={[x, 0.24, z]}
            wireOnly={wireOnly}
          />
        ))
      )}

      {/* Filter knobs */}
      {channelXs.map((x, i) => (
        <HologramMesh key={`filter-${i}`} type="cylinder" args={[0.055, 0.055, 0.08, 10]} position={[x, 0.24, -0.44]} wireOnly={wireOnly} />
      ))}

      {/* Gain knobs */}
      {channelXs.map((x, i) => (
        <HologramMesh key={`gain-${i}`} type="cylinder" args={[0.048, 0.048, 0.08, 10]} position={[x, 0.24, -0.6]} wireOnly={wireOnly} />
      ))}

      {/* Master volume */}
      <HologramMesh type="cylinder" args={[0.072, 0.072, 0.09, 12]} position={[0.38, 0.26, -0.74]} wireOnly={wireOnly} />

      {/* Booth monitor */}
      <HologramMesh type="cylinder" args={[0.055, 0.055, 0.08, 12]} position={[0.18, 0.25, -0.74]} wireOnly={wireOnly} />

      {/* Headphone cue buttons */}
      {channelXs.map((x, i) => (
        <HologramMesh key={`cue-${i}`} type="cylinder" args={[0.038, 0.038, 0.06, 8]} position={[x, 0.24, 0.64]} wireOnly={wireOnly} />
      ))}

      {/* Send/return section */}
      <HologramMesh args={[0.1, 0.06, 0.28]} position={[0.42, 0.24, -0.3]} wireOnly={wireOnly} />
    </group>
  );
}

export default DJMA9;
