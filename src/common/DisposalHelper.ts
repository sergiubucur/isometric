import * as THREE from "three";

export default class DisposalHelper {
	static disposeMesh(mesh: THREE.Mesh) {
		mesh.geometry.dispose();

		if (Array.isArray(mesh.material)) {
			const materials = mesh.material as THREE.Material[];
			materials.forEach(x => x.dispose());
		} else {
			mesh.material.dispose();
		}
	}

	static disposeObject3D(object: THREE.Object3D) {
		object.traverse((x) => {
			if (x.type === "Mesh") {
				DisposalHelper.disposeMesh(x as THREE.Mesh);
			}

			if ((x as any).dispose) {
				(x as any).dispose();
			}
		});
	}
}
