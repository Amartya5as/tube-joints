import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import Tube from './Tube';
import useSceneStore from '../store/sceneStore';
import * as THREE from 'three';
import { computeIntersection } from '../utils/geometry';

function SceneInner({ wireframe }) {
  const tubes = useSceneStore(s => s.tubes);
  const select = useSceneStore(s => s.select);
  const updateTube = useSceneStore(s => s.updateTube);
  const selectedId = useSceneStore(s => s.selectedId);
  const setTubesDirect = useSceneStore(s => s.setTubesDirect);
  const [draggingId, setDraggingId] = useState(null);
  const [previewMesh, setPreviewMesh] = useState(null);
  const previewRef = useRef();

  const handlePointerDown = (id) => {
    select(id);
  };

  // Build canonical three meshes to use for CSG. For preview, we'll create quick clones.
  useEffect(() => {
    // clear preview when selection or tubes change
    setPreviewMesh(null);
  }, [tubes, selectedId]);

  // on each animation frame, optionally compute intersection between dragging object and others
  useEffect(() => {
    let raf = null;
    function tick() {
      if (draggingId) {
        const moved = tubes.find(t => t.id === draggingId);
        if (moved) {
          try {
            const movedMesh = buildQuickMesh(moved);
            let bestInter = null;
            for (const other of tubes) {
              if (other.id === draggingId) continue;
              const otherMesh = buildQuickMesh(other);
              const inter = computeIntersection(movedMesh, otherMesh, new THREE.MeshStandardMaterial({ color: 0xff8a00, transparent:true, opacity:0.45 }));
              if (inter) { bestInter = inter; break; }
            }
            setPreviewMesh(bestInter);
          } catch (err) {
            // ignore
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draggingId, tubes]);

  function buildQuickMesh(spec) {
    // quick outer box for CSG: same extents as used in buildHollowTube but simpler
    const outer = new THREE.BoxGeometry(spec.width, spec.height, spec.length);
    const mesh = new THREE.Mesh(outer);
    mesh.position.set(...(spec.position || [0,0,0]));
    mesh.rotation.set(...(spec.rotation || [0,0,0]));
    mesh.updateMatrix();
    mesh.geometry.applyMatrix4(mesh.matrix);
    mesh.matrix.identity();
    return mesh;
  }

  // Apply preview mesh to scene group
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[50,50,50]} intensity={0.7} />
      <Grid args={[2000, 2000]} sectionColor="#ddd" />
      {tubes.map(t => (
        <group key={t.id}>
          <Tube spec={t} selected={t.id === selectedId} onPointerDown={handlePointerDown} wireframe={wireframe} />
        </group>
      ))}

      {previewMesh && <primitive object={previewMesh} />}

    </>
  );
}

export default function Workspace({ wireframe=false }) {
  return (
    <Canvas camera={{ position: [300, 200, 400], fov: 50 }}>
      <Suspense fallback={null}>
        <SceneInner wireframe={wireframe} />
      </Suspense>
      <ambientLight intensity={0.4} />
      <OrbitControls />
    </Canvas>
  );
}
