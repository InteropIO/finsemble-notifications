import { SpawnParams } from "services/window/Launcher/launcher";

export interface NotificationsConfig {
	filter?: {
		include?: [];
		exclude?: [];
	};
	position?: {};
	animation?: {
		displayDuration: number;
		animateIn: string;
		animateOut: string;
	};
	isTransparent?: boolean;
	notificationsHistory?: boolean;
	applyMuteFilters?: boolean;
}

export default interface WindowConfig {
	window: SpawnParams & NotificationsConfig;
}
