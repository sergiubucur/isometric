import AuraType from "./AuraType";

export type AuraIconInfo = {
	iconName: string;
	flipIcon: boolean;
};

const AuraIcon = {
	[AuraType.Cloaked]: { iconName: "ra-hood", flipIcon: false },
	[AuraType.Energized]: { iconName: "ra-lightning-bolt", flipIcon: false }
}

export default AuraIcon;
