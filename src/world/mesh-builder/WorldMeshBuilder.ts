import * as THREE from "three";

import CellType from "../map/CellType";
import { Rectangle, MapLoaderResult, Edge } from "../map/loader/IMapLoader";
import IWorldMeshBuilder from "./IWorldMeshBuilder";
import IMap from "../map/IMap";
import IAssetService from "../../asset/IAssetService";

const CellSize = 1;
const WallHeight = 4;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);
const TexScale = 16;

export default class WorldMeshBuilder implements IWorldMeshBuilder {
	private _map: IMap;
	private _rectangles: Rectangle[];
	private _edges: Edge[];
	private _rootMesh: THREE.Object3D;
	private _geometries: { [key: string]: THREE.BufferGeometry };
	private _materials: { [key: string]: THREE.Material };

	constructor(private _assetService: IAssetService) {
		this._geometries = {};
		this._materials = {};

		this.initGeometriesAndMaterials();
	}

	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D {
		this._map = mapLoaderResult.map;
		this._rectangles = mapLoaderResult.rectangles;
		this._edges = mapLoaderResult.edges;
		this._rootMesh = new THREE.Object3D();

		this._rectangles.forEach(rectangle => {
			if (rectangle.type === CellType.Void) {
				return;
			}

			const geometry = this.getFloorGeometry(rectangle);
			const material = rectangle.type === CellType.EmptyFloor ? this._materials.floorConcrete : this._materials.ceilingConcrete;

			const floorMesh = new THREE.Mesh(geometry, material);
			if (rectangle.type === CellType.Concrete) {
				floorMesh.position.y = WallHeight;
			}

			this._rootMesh.add(floorMesh);
		});

		this._edges.forEach(edge => {
			const geometry = this.getWallGeometry(edge);
			const material = this._materials.wallConcrete;

			const wallMesh = new THREE.Mesh(geometry, material);

			this._rootMesh.add(wallMesh);
		});

		console.log("world mesh count", this._rootMesh.children.length);

		return this._rootMesh;
	}

	private getFloorGeometry(rectangle: Rectangle) {
		const geometry = new THREE.Geometry();

		const x0 = rectangle.x0;
		const z0 = rectangle.y0;
		const x1 = rectangle.x1;
		const z1 = rectangle.y1;

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, 0, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, 0, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, 0, z1 - CellSize / 2));

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, 0, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, 0, z1 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, 0, z1 - CellSize / 2));

		geometry.faces.push(new THREE.Face3(2, 1, 0));
		geometry.faces.push(new THREE.Face3(5, 4, 3));

		geometry.faceVertexUvs = [[]];

		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(x1 / TexScale, z1 / TexScale),
			new THREE.Vector2(x1 / TexScale, z0 / TexScale),
			new THREE.Vector2(x0 / TexScale, z0 / TexScale)
		]);

		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(x0 / TexScale, z1 / TexScale),
			new THREE.Vector2(x1 / TexScale, z1 / TexScale),
			new THREE.Vector2(x0 / TexScale, z0 / TexScale)
		]);

		geometry.computeVertexNormals();

		return new THREE.BufferGeometry().fromGeometry(geometry);
	}

	private getWallGeometry(edge: Edge) {
		const geometry = new THREE.Geometry();

		const x0 = edge.x0;
		const z0 = edge.y0;
		const x1 = edge.x1;
		const z1 = edge.y1;

		const length = new THREE.Vector2(x0, z0).distanceTo(new THREE.Vector2(x1, z1)) / TexScale;
		const height = WallHeight / TexScale;

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, 0, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, WallHeight, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, 0, z1 - CellSize / 2));

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, WallHeight, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, WallHeight, z1 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, 0, z1 - CellSize / 2));

		geometry.faces.push(new THREE.Face3(2, 1, 0));
		geometry.faces.push(new THREE.Face3(5, 4, 3));

		geometry.faceVertexUvs = [[]];

		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0, length),
			new THREE.Vector2(height, 0),
			new THREE.Vector2(0, 0)
		]);

		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0, length),
			new THREE.Vector2(height, length),
			new THREE.Vector2(height, 0)
		]);

		geometry.computeVertexNormals();

		return new THREE.BufferGeometry().fromGeometry(geometry);
	}

	private initGeometriesAndMaterials() {
		this._materials.floorConcrete = this.getMaterial("metal", "normalMetal", FloorColor);
		this._materials.ceilingConcrete = this.getMaterial("metal", "normalMetal", WallColor);
		this._materials.wallConcrete = this.getMaterial("metal", "normalMetal", WallColor);
	}

	private getMaterial(textureName: string, normalMapName: string, color = new THREE.Color(1, 1, 1)) {
		const material = new THREE.MeshPhongMaterial({ color });

		material.map = this._assetService.assets[textureName].content as THREE.Texture;
		material.map.wrapS = THREE.RepeatWrapping;
		material.map.wrapT = THREE.RepeatWrapping;
		material.normalMap = this._assetService.assets[normalMapName].content as THREE.Texture;
		material.normalMap.wrapS = THREE.RepeatWrapping;
		material.normalMap.wrapT = THREE.RepeatWrapping;

		return material;
	}
}
