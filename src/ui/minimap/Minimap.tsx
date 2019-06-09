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

const Size = 48;
const CellSize = 4;
const RefreshRateMs = Math.floor(1 / 30 * 1000);

export default class Minimap extends Component<Props> {
	private _intervalId: NodeJS.Timeout;
	private _ref: RefObject<HTMLDivElement>;

	constructor(props: Props) {
		super(props);

		this._ref = React.createRef<HTMLDivElement>();
	}

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const time = performance.now();

			this.renderCells();

			this.props.logger.logBounds("renderCells", performance.now() - time);
		}, RefreshRateMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	private renderCells() {
		const { world, player } = this.props;

		const playerPosition = world.map.convertToMapPosition(player.position);
		const cells = Array.from(this._ref.current.children) as HTMLDivElement[];

		let k = 0;
		for (let z = 0; z < Size; z++) {
			for (let x = 0; x < Size; x++) {
				let x0 = playerPosition.x - Size / 2 + x;
				let z0 = playerPosition.z - Size / 2 + z;

				const cell = world.map.getCell(x0, z0);
				let background = "#404040";

				if (!cell) {
					background = "#000";
				} else {
					if (cell.type === CellType.Void) {
						background = "#fff";
					} else {
						const id = world.map.occupiedCells[z0][x0];

						if (id === player.id) {
							background = "#bada55";
						} else {
							if (id !== player.id && id !== 0) {
								background = "#ff0000";
							}
						}
					}
				}

				const div = cells[k];
				div.style.background = background;

				k++;
			}
		}
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

		const cells = [];
		for (let i = 0; i < Size * Size; i++) {
			cells.push(true);
		}

		return(
			<div ref={this._ref} style={styles}>
				{cells.map((x, i) => <div key={i} style={{ width: CellSize, height: CellSize }}></div>)}
			</div>
		);
	}
}
