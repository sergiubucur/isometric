import * as THREE from "three";

import CellType from "../map/CellType";
import { Rectangle, MapLoaderResult, Edge } from "../map/loader/IMapLoader";
import IWorldMeshBuilder from "./IWorldMeshBuilder";
import IAssetService from "../../asset/IAssetService";

const CellSize = 1;
const WallHeight = 4;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);
const MovingColor = new THREE.Color(0, 0.25, 0.5);
const TexScale = 16;

export default class WorldMeshBuilder implements IWorldMeshBuilder {
	private _material: { [key: string]: THREE.Material };

	constructor(private _assetService: IAssetService) {
		this._material = {};

		this.initPrimitives();
	}

	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D {
		const { edges, rectangles } = mapLoaderResult;
		const rootMesh = new THREE.Object3D();

		rectangles.forEach(rectangle => {
			if (rectangle.type === CellType.Void) {
				return;
			}

			if (rectangle.type === CellType.Moving) {
				const mesh = this.getMovingMesh(rectangle);
				mesh.position.y -= WallHeight;

				rootMesh.add(mesh);
				return;
			}

			const geometry = this.getFloorGeometry(rectangle, rectangle.type === CellType.Concrete ? WallHeight : 0);
			const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
			const material = rectangle.type === CellType.EmptyFloor ? this._material.floorConcrete : this._material.ceilingConcrete;

			const floorMesh = new THREE.Mesh(bufferGeometry, material);

			rootMesh.add(floorMesh);
		});

		// TODO: remove occluded walls
		edges.forEach(edge => {
			const geometry = this.getWallGeometry(edge);
			const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
			const material = this._material.wallConcrete;

			const wallMesh = new THREE.Mesh(bufferGeometry, material);

			rootMesh.add(wallMesh);
		});

		return rootMesh;
	}

	private getMovingMesh(rectangle: Rectangle) {
		let geometry = new THREE.Geometry();

		const floorGeometry = this.getFloorGeometry(rectangle, WallHeight);
		geometry.merge(floorGeometry);

		const wallGeometry1 = this.getWallGeometry({ x0: rectangle.x0, y0: rectangle.y0, x1: rectangle.x0, y1: rectangle.y1, type: rectangle.type });
		geometry.merge(wallGeometry1);

		const wallGeometry2 = this.getWallGeometry({ x0: rectangle.x0, y0: rectangle.y1, x1: rectangle.x1, y1: rectangle.y1, type: rectangle.type });
		geometry.merge(wallGeometry2);

		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

		const mesh = new THREE.Mesh(bufferGeometry, this._material.movingConcrete);

		return mesh;
	}

	private getFloorGeometry(rectangle: Rectangle, height: number) {
		const geometry = new THREE.Geometry();

		const x0 = rectangle.x0;
		const z0 = rectangle.y0;
		const x1 = rectangle.x1;
		const z1 = rectangle.y1;

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, height, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, height, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, height, z1 - CellSize / 2));

		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, height, z0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x1 - CellSize / 2, height, z1 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(x0 - CellSize / 2, height, z1 - CellSize / 2));

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

		return geometry;
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

		return geometry;
	}

	private initPrimitives() {
		this._material.floorConcrete = this.getMaterial("metal", "normalMetal", FloorColor);
		this._material.ceilingConcrete = this.getMaterial("metal", "normalMetal", WallColor);
		this._material.wallConcrete = this.getMaterial("metal", "normalMetal", WallColor);
		this._material.movingConcrete = this.getMaterial("metal", "normalMetal", MovingColor);
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

	dispose() {
		Object.keys(this._material).forEach(key => {
			this._material[key].dispose();
		});
		this._material = null;
	}
}
