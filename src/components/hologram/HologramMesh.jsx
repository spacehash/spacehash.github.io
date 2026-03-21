import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './HologramMaterial'; // registers <hologramMaterial> as a JSX element

/**
 * Renders a single hologram-shaded mesh with crisp edge lines.
 *
 * Props:
 *   type     — 'box' (default) | 'cylinder'
 *   args     — geometry constructor args array, e.g. [2.4, 0.26, 1.68]
 *   position — [x, y, z]
 *   rotation — [x, y, z] in radians
 *   wireOnly — when true, skip the face shader and render edges only (qty=0 style)
 */
function HologramMesh({ type = 'box', args = [], position, rotation, wireOnly = false }) {
  const matRef  = useRef();
  const geoRef  = useRef();
  const edgesRef = useRef();

  // Lazy initializer — geometry is static for the lifetime of the mesh.
  if (!geoRef.current) {
    geoRef.current  = type === 'cylinder'
      ? new THREE.CylinderGeometry(...args)
      : new THREE.BoxGeometry(...args);
    edgesRef.current = new THREE.EdgesGeometry(geoRef.current, 15);
  }

  const geo   = geoRef.current;
  const edges = edgesRef.current;

  // Dispose on unmount to avoid GPU memory leaks.
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Transparent face layer — scanlines + Fresnel glow (hidden when wireOnly) */}
      {!wireOnly && (
        <mesh>
          <primitive object={geo} attach="geometry" />
          <hologramMaterial ref={matRef} />
        </mesh>
      )}

      {/* Crisp edge outline — the schematic blueprint look */}
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color="#00ff41" transparent opacity={wireOnly ? 0.45 : 0.9} />
      </lineSegments>
    </group>
  );
}

export default HologramMesh;
