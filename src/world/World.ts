import * as THREE from "three";

import Map from "./map/Map";
import TestMap from "./map/TestMap";
import IWorldMeshBuilder from "./mesh-builder/IWorldMeshBuilder";
import IWorld from "./IWorld";
import IWorldComponent from "./IWorldComponent";
import IMapLoader from "./map/IMapLoader";

export default class World implements IWorld, IWorldComponent {
	readonly scene: THREE.Scene;
	map: Map;

	private readonly _mapLoader: IMapLoader;
	private readonly _worldMeshBuilder: IWorldMeshBuilder;

	constructor(mapLoader: IMapLoader, worldMeshBuilder: IWorldMeshBuilder) {
		this._mapLoader = mapLoader;
		this._worldMeshBuilder = worldMeshBuilder;

		this.scene = new THREE.Scene();
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.initMap();
			this.initWorldMesh();
			this.initLights();

			setTimeout(() => {
				resolve();
			});
		});
	}

	update() {
	}

	addMesh(mesh: THREE.Mesh): void {
		this.scene.add(mesh);
	}

	private initMap() {
		this.map = this._mapLoader.loadMap(TestMap);
	}

	private initWorldMesh() {
		const worldMesh = this._worldMeshBuilder.buildWorldMesh(this.map);

		this.scene.add(worldMesh);
	}

	private initLights() {
		const ambLight = new THREE.AmbientLight(new THREE.Color(0.25, 0.25, 0.25));
		this.scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(new THREE.Color(1, 0.85, 0.7));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);
	}
}
