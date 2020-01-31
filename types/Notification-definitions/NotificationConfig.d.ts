import { SpawnParams } from "./../../../finsemble-notifications-seed/finsemble/services/window/Launcher/launcher";

type SpawnParamsWithoutData = Omit<SpawnParams, "data">;

export interface NotificationsConfig {
	notifications?: {
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
	};
}

export interface WindowParams extends SpawnParamsWithoutData {
	data: NotificationsConfig | any;
}

export default interface WindowConfig {
	window: WindowParams;
}
