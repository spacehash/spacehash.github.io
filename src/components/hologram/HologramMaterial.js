import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const vertexShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vWorldPos;

  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vWorldPos   = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;

  varying vec3 vViewNormal;
  varying vec3 vWorldPos;

  void main() {
    // Fresnel — stronger opacity at silhouette edges
    float fresnel = pow(1.0 - abs(vViewNormal.z), 2.2);

    // Horizontal scanlines scrolling
    float scan = sin(vWorldPos.y * 48.0 - uTime * 2.2) * 0.1 + 0.9;

    // Bright sweep line that travels upward periodically
    float phase = fract(vWorldPos.y * 0.35 - uTime * 0.22);
    float sweep = smoothstep(0.016, 0.0, abs(phase - 0.5) - 0.484);

    // Multi-frequency flicker
    float flicker = 0.96
      + sin(uTime * 19.7) * 0.018
      + sin(uTime *  7.3) * 0.012
      + sin(uTime *  3.1) * 0.008;

    float alpha = (fresnel * 0.6 + 0.06) * scan * flicker + sweep * 0.38;
    alpha = clamp(alpha, 0.0, 0.90);

    vec3 col = uColor * (scan * 0.38 + 0.62) + uColor * sweep * 0.75;
    gl_FragColor = vec4(col, alpha);
  }
`;

// Subclass ShaderMaterial so R3F can use it as <hologramMaterial ref={...} />.
// Getters/setters let R3F update uniforms via props (e.g. uTime={t}).
class HologramMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color('#00ff41') },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });
  }

  get uTime()  { return this.uniforms.uTime.value; }
  set uTime(v) { this.uniforms.uTime.value = v; }

  get uColor()  { return this.uniforms.uColor.value; }
  set uColor(v) { this.uniforms.uColor.value.set(v); }
}

extend({ HologramMaterial });
