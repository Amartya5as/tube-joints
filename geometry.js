import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * Build a hollow rectangular tube mesh (outer box minus inner box)
 */
export function buildHollowTube(width, height, thickness, length, material) {
  const outer = new THREE.BoxGeometry(width, height, length);
  const innerWidth = Math.max(1, width - 2 * thickness);
  const innerHeight = Math.max(1, height - 2 * thickness);
  const inner = new THREE.BoxGeometry(innerWidth, innerHeight, length + 0.02);

  const outerMesh = new THREE.Mesh(outer);
  const innerMesh = new THREE.Mesh(inner);

  const bspOuter = CSG.fromMesh(outerMesh);
  const bspInner = CSG.fromMesh(innerMesh);
  const sub = bspOuter.subtract(bspInner);
  const mesh = CSG.toMesh(sub, outerMesh.matrix, material);
  mesh.geometry.computeVertexNormals();
  return mesh;
}

/**
 * Compute intersection mesh between two THREE.Mesh objects (returns null if no intersection)
 */
export function computeIntersection(meshA, meshB, material) {
  try {
    const bspA = CSG.fromMesh(meshA);
    const bspB = CSG.fromMesh(meshB);
    const inter = bspA.intersect(bspB);
    if (!inter) return null;
    const interMesh = CSG.toMesh(inter, meshA.matrix, material);
    interMesh.geometry.computeVertexNormals();
    return interMesh;
  } catch (err) {
    console.warn('CSG intersection error', err);
    return null;
  }
}
