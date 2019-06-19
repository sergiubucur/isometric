import AuraType from "./AuraType";
import Cloaked from "./aura/Cloaked";
import Energized from "./aura/Energized";

export default function getAuras() {
	return {
		[AuraType.Cloaked]: new Cloaked(),
		[AuraType.Energized]: new Energized()
	};
}
