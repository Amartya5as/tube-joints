import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { buildHollowTube } from '../utils/geometry';

export default function Tube({ spec, selected, onPointerDown, wireframe=false }) {
  const ref = useRef();
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: selected ? 0x4d90fe : 0x999999,
    metalness: 0.2,
    roughness: 0.6,
    transparent: false,
  }), [selected]);

  // create mesh once
  const mesh = useMemo(() => {
    return buildHollowTube(spec.width, spec.height, spec.thickness, spec.length, material);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.width, spec.height, spec.thickness, spec.length]);

  useEffect(() => {
    if (!ref.current) return;
    // replace primitive object if changed
    ref.current.clear();
    ref.current.add(mesh);
  }, [mesh]);

  useEffect(() => {
    if (!ref.current) return;
    const three = ref.current;
    three.position.set(...(spec.position || [0,0,0]));
    three.rotation.set(...(spec.rotation || [0,0,0]));
  }, [spec.position, spec.rotation]);

  return (
    <group ref={ref} onPointerDown={(e) => { e.stopPropagation(); onPointerDown && onPointerDown(spec.id); }}>
      <primitive object={mesh} />
      {wireframe && <mesh>
        <edgesGeometry args={[mesh.geometry]} />
      </mesh>}
    </group>
  );
}
