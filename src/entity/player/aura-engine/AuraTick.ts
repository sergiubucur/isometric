export const TicksPerSecond = 10;
export const FramesPerSecond = 60;
export const FramesPerTick = FramesPerSecond / TicksPerSecond;

export function secondsToTicks(seconds: number) {
	return seconds * TicksPerSecond;
}
