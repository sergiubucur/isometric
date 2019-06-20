import ILoadingDisplay from "./ILoadingDisplay";

const DomElementId = "loading";

export default class LoadingDisplay implements ILoadingDisplay {
	show(text = "Loading...") {
		let div = this.getDomElement();

		if (!div) {
			div = this.constructDomElement();
		}

		div.innerHTML = text;
	}

	hide() {
		const div = this.getDomElement();

		if (!div) {
			return;
		}

		document.body.removeChild(div);
	}

	private getDomElement() {
		return document.getElementById(DomElementId);
	}

	private constructDomElement() {
		const div = document.createElement("div");

		div.id = DomElementId;
		div.style.position = "fixed";
		div.style.left = "50%";
		div.style.top = "50%";
		div.style.transform = "translateX(-50%) translateY(-50%)";
		div.style.fontSize = "30px";
		div.style.userSelect = "none";
		div.style.textAlign = "center";
		div.style.color = "#fff";

		document.body.appendChild(div);

		return div;
	}
}
