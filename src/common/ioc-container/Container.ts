type TypeInfo = {
	id: number,
	type: object,
	dependencies: number[],
	singleton: boolean
};

const FactoryPrefix = 1000000;

export function Factory(id: number) {
	return FactoryPrefix + id;
}

export default class Container {
	_types: { [key: number]: TypeInfo };
	_singletons: { [key: number]: object };

	constructor() {
		this._types = {};
		this._singletons = {};
	}

	register(id: number, type: object, ...dependencies: number[]) {
		this.registerType(id, type, dependencies);
	}

	registerSingleton(id: number, type: object, ...dependencies: number[]) {
		this.registerType(id, type, dependencies, true);
	}

	private registerType(id: number, type: object, dependencies: number[], singleton = false) {
		this._types[id] = {
			id,
			type,
			dependencies,
			singleton
		};
	}

	resolve(id: number): object {
		const type = this._types[id];

		if (!type) {
			throw new Error("unregistered type");
		}

		if (type.dependencies.length > 0) {
			return this.singleton(type, () => {
				const dependencies = type.dependencies.map(x => {
					if (x >= FactoryPrefix) {
						x = x - FactoryPrefix;
						return () => this.resolve(x);
					}

					return this.resolve(x);
				});

				// @ts-ignore
				return new (Function.prototype.bind.apply(type.type, [null, ...dependencies])); // eslint-disable-line
			});
		}

		// @ts-ignore
		return this.singleton(type, () => new type.type());
	}

	private singleton(type: TypeInfo, callback: () => object) {
		if (type.singleton) {
			if (!this._singletons[type.id]) {
				this._singletons[type.id] = callback();
			}

			return this._singletons[type.id];
		}

		return callback();
	}
}
