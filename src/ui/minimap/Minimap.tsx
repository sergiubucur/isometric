import React, { Component } from "react";

import IWorld from "../../world/IWorld";
import IPlayer from "../../entity/player/IPlayer";
import CellType from "../../world/map/CellType";

interface Props {
	world: IWorld,
	player: IPlayer
}

type CellInfo = {
	id: number,
	exists: boolean,
	type?: CellType,
	player?: boolean,
	monster?: boolean
};

const Size = 32;
const CellSize = 8;
const RefreshRateMs = Math.floor(1 / 30 * 1000);

export default class Minimap extends Component<Props> {
	private _intervalId: NodeJS.Timeout;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			this.forceUpdate();
		}, RefreshRateMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	private renderCell(cell: CellInfo) {
		let background = "#404040";

		if (!cell.exists) {
			background = "#000";
		} else {
			if (cell.type === CellType.Void) {
				background = "#fff";
			} else {
				if (cell.player) {
					background = "#bada55";
				} else {
					if (cell.monster) {
						background = "#ff0000";
					}
				}
			}
		}

		return (
			<div key={cell.id} style={{ width: CellSize, height: CellSize, background }}></div>
		);
	}

	render() {
		const { world, player } = this.props;

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

		const playerPosition = world.map.convertToMapPosition(player.position);

		const cells = [];
		for (let z = 0; z < Size; z++) {
			for (let x = 0; x < Size; x++) {
				let x0 = playerPosition.x - Size / 2 + x;
				let z0 = playerPosition.z - Size / 2 + z;

				const cell = world.map.getCell(x0, z0);
				if (!cell) {
					cells.push({
						id: z * Size + x,
						exists: false
					});
					continue;
				}

				const id = world.map.occupiedCells[z0][x0];

				cells.push({
					id: z * Size + x,
					exists: true,
					type: cell.type,
					player: id === player.id,
					monster: id !== player.id && id !== 0
				});
			}
		}

		return(
			<div style={styles}>
				{cells.map(x => this.renderCell(x))}
			</div>
		);
	}
}
