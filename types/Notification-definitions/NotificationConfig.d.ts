import { SpawnParams } from "@chartiq/finsemble/dist/types/services/window/Launcher/launcher";

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
}

export interface PurgeConfig {
	maxNotificationsToRetain: number;
	maxNotificationRetentionPeriodSeconds: number | false;
}

export default interface WindowConfig {
	window: SpawnParams & NotificationsConfig;
}
