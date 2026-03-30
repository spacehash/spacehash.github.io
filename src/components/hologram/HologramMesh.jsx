import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LineSegments2 }    from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { LineMaterial }     from 'three/examples/jsm/lines/LineMaterial';
import './HologramMaterial'; // registers <hologramMaterial> as a JSX element

const DARK_COLOR  = '#00ff41';
const LIGHT_COLOR = '#006b1a'; // darker green — readable on light backgrounds

/**
 * Renders a single hologram-shaded mesh with crisp edge lines.
 *
 * Props:
 *   type      — 'box' (default) | 'cylinder'
 *   args      — geometry constructor args array, e.g. [2.4, 0.26, 1.68]
 *   position  — [x, y, z]
 *   rotation  — [x, y, z] in radians
 *   wireOnly  — when true, skip the face shader and render edges only (qty=0 style)
 *   lightMode — when true, use darker colour for visibility on light backgrounds
 */
function HologramMesh({ type = 'box', args = [], position, rotation, wireOnly = false, lightMode = false }) {
  const matRef     = useRef();
  const geoRef     = useRef();
  const edgesRef   = useRef();
  const lineGeoRef = useRef();
  const lineMatRef = useRef();
  const lineSegsRef = useRef();

  const { size } = useThree();

  // Lazy-init — geometry and line objects are static for the lifetime of the mesh.
  if (!geoRef.current) {
    const baseGeo = type === 'cylinder'
      ? new THREE.CylinderGeometry(...args)
      : new THREE.BoxGeometry(...args);
    geoRef.current = baseGeo;

    // Standard EdgesGeometry for the face mesh (used only by hologramMaterial)
    edgesRef.current = new THREE.EdgesGeometry(baseGeo, 15);

    // LineSegmentsGeometry — extracts edge positions for Line2-style thick rendering
    const lineGeo = new LineSegmentsGeometry();
    lineGeo.setPositions(edgesRef.current.attributes.position.array);
    lineGeoRef.current = lineGeo;

    // LineMaterial renders lines as quads, supporting real pixel-width linewidth
    const lineMat = new LineMaterial({
      color:       lightMode ? LIGHT_COLOR : DARK_COLOR,
      linewidth:   2.5,                           // px — works cross-browser
      resolution:  new THREE.Vector2(size.width, size.height),
      transparent: true,
      opacity:     wireOnly ? 0.55 : 1.0,
    });
    lineMatRef.current = lineMat;

    lineSegsRef.current = new LineSegments2(lineGeo, lineMat);
  }

  // Keep resolution in sync so linewidth stays correct when canvas is resized
  useEffect(() => {
    if (lineMatRef.current) {
      lineMatRef.current.resolution.set(size.width, size.height);
    }
  }, [size]);

  // Update colour when theme mode switches
  useEffect(() => {
    if (lineMatRef.current) {
      lineMatRef.current.color.set(lightMode ? LIGHT_COLOR : DARK_COLOR);
    }
  }, [lightMode]);

  const geo   = geoRef.current;
  const edges = edgesRef.current;

  // Clean up GPU resources on unmount
  useEffect(() => () => {
    geo.dispose();
    edges.dispose();
    lineGeoRef.current?.dispose();
    lineMatRef.current?.dispose();
  }, [geo, edges]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Transparent face layer — scanlines + Fresnel glow (hidden when wireOnly) */}
      {!wireOnly && (
        <mesh geometry={geo}>
          <hologramMaterial ref={matRef} uColor={lightMode ? LIGHT_COLOR : DARK_COLOR} />
        </mesh>
      )}

      {/* Thick edge outline via LineSegments2 */}
      <primitive object={lineSegsRef.current} />
    </group>
  );
}

export default HologramMesh;
