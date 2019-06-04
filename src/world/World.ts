import * as THREE from "three";

import Map from "./map/Map";
import MapLoader from "./map/MapLoader";
import TestMap from "./map/TestMap";
import WorldMeshBuilder from "./mesh-builder/WorldMeshBuilder";
import IWorld from "./IWorld";
import IWorldComponent from "./IWorldComponent";

export default class World implements IWorld, IWorldComponent {
	readonly scene: THREE.Scene;
	map: Map;

	constructor() {
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

	private initMap() {
		const mapLoader = new MapLoader();
		this.map = mapLoader.loadMap(TestMap);
	}

	private initWorldMesh() {
		const worldMeshBuilder = new WorldMeshBuilder(this.map);
		const worldMesh = worldMeshBuilder.buildWorldMesh();

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
