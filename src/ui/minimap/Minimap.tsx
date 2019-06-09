import React, { Component, RefObject } from "react";

import IWorld from "../../world/IWorld";
import IPlayer from "../../entity/player/IPlayer";
import CellType from "../../world/map/CellType";
import ILogger from "../../common/logger/ILogger";

interface Props {
	world: IWorld,
	player: IPlayer,
	logger: ILogger
}

type Color = {
	r: number,
	g: number,
	b: number
};

const Size = 48;
const CellSize = 6;

export default class Minimap extends Component<Props> {
	private _animationFrameId: number;
	private _canvasRef: RefObject<HTMLCanvasElement>;
	private _ctx: CanvasRenderingContext2D;

	constructor(props: Props) {
		super(props);

		this._canvasRef = React.createRef<HTMLCanvasElement>();
	}

	componentDidMount() {
		this.draw();
	}

	componentWillUnmount() {
		cancelAnimationFrame(this._animationFrameId);
	}

	private draw() {
		this._animationFrameId = requestAnimationFrame(() => this.draw());
		const time = performance.now();

		this.renderCells();

		this.props.logger.logBounds("renderCells", performance.now() - time);
	}

	private renderCells() {
		const { world, player } = this.props;

		if (!this._ctx) {
			this._ctx = this._canvasRef.current.getContext("2d", { alpha: false });
		}

		const playerPosition = world.map.convertToMapPosition(player.position);
		const imageData = this._ctx.getImageData(0, 0, Size, Size);
		const color = { r: 0, g: 0, b: 0 };

		for (let z = 0; z < Size; z++) {
			for (let x = 0; x < Size; x++) {
				let x0 = playerPosition.x - Size / 2 + x;
				let z0 = playerPosition.z - Size / 2 + z;

				const cell = world.map.getCell(x0, z0);
				color.r = 64;
				color.g = 64;
				color.b = 64;

				if (!cell) {
					color.r = 0;
					color.g = 0;
					color.b = 0;
				} else {
					if (cell.type === CellType.Void) {
						color.r = 255;
						color.g = 255;
						color.b = 255;
					} else {
						const id = world.map.occupiedCells[z0][x0];

						if (id === player.id) {
							color.r = 186;
							color.g = 218;
							color.b = 85;
						} else {
							if (id !== player.id && id !== 0) {
								color.r = 255;
								color.g = 0;
								color.b = 0;
							}
						}
					}
				}

				this.setPixel(imageData, x, z, color);
			}

			this._ctx.putImageData(imageData, 0, 0);
		}
	}

	private setPixel(imageData: ImageData, x: number, y: number, color: Color) {
		const data = imageData.data;
		const i = (y * Size + x) * 4;

		data[i] = color.r;
		data[i + 1] = color.g;
		data[i + 2] = color.b;
		data[i + 3] = 0;
	}

	render() {
		const styles: any = {
			position: "absolute",
			right: 0,
			top: 0,
			width: CellSize * Size,
			height: CellSize * Size,
			display: "flex",
			flexWrap: "wrap",
			opacity: 0.75,
			borderLeft: "1px solid #808080",
			borderBottom: "1px solid #808080"
		};

		const canvasStyles: any = {
			width: Size * CellSize,
			height: Size * CellSize,
			imageRendering: "pixelated"
		};

		const cells = [];
		for (let i = 0; i < Size * Size; i++) {
			cells.push(true);
		}

		return(
			<div style={styles}>
				<canvas
					ref={this._canvasRef}
					width={Size}
					height={Size}
					style={canvasStyles}></canvas>
			</div>
		);
	}
}
