import { BufferGeometry, BufferAttribute } from 'three';

export interface TransferGeometry {
  materials: Float32Array;
  vertices: Float32Array;
  shadows: Float32Array;
}

export function geometryFromArrays(transferGeometry: TransferGeometry): BufferGeometry {
  var geometry = new BufferGeometry();
  geometry.addAttribute('material', new BufferAttribute(transferGeometry.materials, 1));
  geometry.addAttribute('position', new BufferAttribute(transferGeometry.vertices, 3));
  geometry.addAttribute('shadow', new BufferAttribute(transferGeometry.shadows, 1));
  //geometry.computeVertexNormals(); // Not needed unless lighting is added.
  geometry.computeBoundingBox();

  return geometry;
}
