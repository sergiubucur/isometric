import * as THREE from "three";

import Map from "./map/Map";
import IWorldMeshBuilder from "./mesh-builder/IWorldMeshBuilder";
import IWorld from "./IWorld";
import IWorldComponent from "./IWorldComponent";
import IMapLoader from "./map/loader/IMapLoader";
import IAssetService from "../asset/IAssetService";

export default class World implements IWorld, IWorldComponent {
	readonly scene: THREE.Scene;
	map: Map;

	constructor(private _assetService: IAssetService, private _mapLoader: IMapLoader, private _worldMeshBuilder: IWorldMeshBuilder) {
		this.scene = new THREE.Scene();
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.initMap();
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
		const result = this._mapLoader.loadMap(this._assetService.assets.test.content as HTMLImageElement);
		this.map = result.map;

		const worldMesh = this._worldMeshBuilder.buildWorldMesh(result);
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
