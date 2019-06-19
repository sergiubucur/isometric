import AuraType from "./AuraType";

export type AuraIconInfo = {
	iconName: string;
	flipIcon: boolean;
};

const AuraIcon = {
	[AuraType.Cloaked]: { iconName: "ra-hood", flipIcon: false },
	[AuraType.HealthBoost]: { iconName: "ra-hearts", flipIcon: false },
	[AuraType.ManaBoost]: { iconName: "ra-lightning-bolt", flipIcon: false }
}

export default AuraIcon;
