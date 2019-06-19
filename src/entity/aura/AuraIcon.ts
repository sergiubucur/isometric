import AuraType from "./AuraType";

export type AuraIconInfo = {
	iconName: string;
	flipIcon: boolean;
};

const AuraIcon = {
	[AuraType.Cloaked]: { iconName: "ra-hood", flipIcon: true }
}

export default AuraIcon;
