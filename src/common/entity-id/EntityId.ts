export default class EntityId {
	private _id: number;

	constructor() {
		this._id = 0;
	}

	getNewId() {
		return ++this._id;
	}
}
