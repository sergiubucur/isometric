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
	type: CellType,
	passable: boolean
};

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

		if (cell.type === CellType.Void) {
			background = "#fff";
		} else {
			if (!cell.passable) {
				background = "#bada55";
			}
		}

		return (
			<div key={cell.id} style={{ width: CellSize, height: CellSize, background }}></div>
		);
	}

	render() {
		const { world } = this.props;
		const size = world.map.size;

		const styles: any = {
			position: "absolute",
			right: 0,
			top: 0,
			width: CellSize * size,
			height: CellSize * size,
			display: "flex",
			flexWrap: "wrap"
		};

		const cells = [];
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				cells.push({
					id: y * size + x,
					type: world.map.cells[y][x].type,
					passable: world.map.isCellPassable(x, y)
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
