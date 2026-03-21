import { useRef } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CDJ3000 from './models/CDJ3000';
import DJMA9   from './models/DJMA9';
import RX3     from './models/RX3';

extend({ OrbitControls });

const MODEL_MAP = {
  cdj3000: CDJ3000,
  djma9:   DJMA9,
  rx3:     RX3,
};

// Layout per visible instance count.
// Offsets are in unscaled world units — the outer group applies scale.
// Designed for the widest model (RX3 ≈ 3.42 units) so no overlap at any scale.
const LAYOUTS = {
  1: { scale: 1.00, offsets: [[0, 0, 0]] },
  2: { scale: 0.47, offsets: [[-1.1, 0, -0.28], [1.1, 0, 0.28]] },
  3: { scale: 0.38, offsets: [[-1.2, 0, 0.38], [0, 0, -0.38], [1.2, 0, 0.38]] },
  4: { scale: 0.32, offsets: [[-1.0, 0, 0.62], [1.0, 0, 0.62], [-1.0, 0, -0.52], [1.0, 0, -0.52]] },
};

export function getModelKey(itemName) {
  if (!itemName) return 'cdj3000';
  const n = itemName.toLowerCase();
  if (n.includes('cdj'))                        return 'cdj3000';
  if (n.includes('djm') || n.includes('mixer')) return 'djma9';
  if (n.includes('rx')  || n.includes('ddj'))   return 'rx3';
  return 'cdj3000';
}

function Controls() {
  const { camera, gl } = useThree();
  const ref = useRef();
  useFrame(() => ref.current?.update());

  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enablePan={false}
      enableZoom
      enableDamping
      dampingFactor={0.08}
      autoRotate
      autoRotateSpeed={1.8}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={1.5}
      maxDistance={8}
    />
  );
}

/**
 * Props:
 *   itemName — equipment name string
 *   qty      — selected quantity (0 = wire outline only, 1+ = filled, 2+ = multiple copies)
 */
function GearHologram({ itemName, qty = 1 }) {
  const Model    = MODEL_MAP[getModelKey(itemName)];
  const wireOnly = qty === 0;
  const count    = wireOnly ? 1 : Math.min(qty, 4);
  const layout   = LAYOUTS[count] || LAYOUTS[4];

  return (
    <>
      <Controls />
      {layout.offsets.map(([ox, oy, oz], i) => (
        <group key={i} position={[ox, oy, oz]} scale={layout.scale}>
          {/* Y nudge applied inside scale so it stays proportional */}
          <group position={[0, -0.12, 0]}>
            <Model wireOnly={wireOnly} />
          </group>
        </group>
      ))}
    </>
  );
}

export default GearHologram;
