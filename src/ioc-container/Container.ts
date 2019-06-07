type TypeInfo = {
	name: string,
	type: object,
	dependencies: string[],
	singleton: boolean
};

const FactoryPrefix = "Factory_";

export function Factory(name: string) {
	return FactoryPrefix + name;
}

export default class Container {
	_types: { [key: string]: TypeInfo };
	_singletons: { [key: string]: object };

	constructor() {
		this._types = {};
		this._singletons = {};
	}

	register(name: string, type: object, ...dependencies: string[]) {
		this.registerType(name, type, dependencies);
	}

	registerSingleton(name: string, type: object, ...dependencies: string[]) {
		this.registerType(name, type, dependencies, true);
	}

	private registerType(name: string, type: object, dependencies: string[], singleton = false) {
		this._types[name] = {
			name,
			type,
			dependencies,
			singleton
		};
	}

	resolve(name: string): object {
		const type = this._types[name];

		if (!type) {
			throw new Error("unregistered type");
		}

		if (type.dependencies.length > 0) {
			const dependencies = type.dependencies.map(x => {
				if (x.indexOf(FactoryPrefix) === 0) {
					x = x.substr(FactoryPrefix.length);
					return () => this.resolve(x);
				}

				return this.resolve(x);
			});

			// @ts-ignore
			return this._singleton(type, () => new (Function.prototype.bind.apply(type.type, [null, ...dependencies]))); // eslint-disable-line
		}

		// @ts-ignore
		return this._singleton(type, () => new type.type());
	}

	_singleton(type: TypeInfo, callback: () => object) {
		if (type.singleton) {
			if (!this._singletons[type.name]) {
				this._singletons[type.name] = callback();
			}

			return this._singletons[type.name];
		}

		return callback();
	}
}
