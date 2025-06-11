export const NotificationType = {
	error: "error",
	alert: "alert",
	info: "info",
	reminder: "reminder",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const MetricType = {
	water_level: "water_level",
	temperature: "temperature",
	composition: "composition",
	ph: "ph",
	light: "light",
	feeding: "feeding",
} as const;

export type MetricType = (typeof MetricType)[keyof typeof MetricType];

export type NotificationNew = {
	notificationId: string;
	message: string;
	createdDate: string;
	snapshotId: string;
	aquariumId: string;
	unread: boolean;
};

export type NotificationListResponse = {
	notifications: NotificationResponse[];
};

export type NotificationResponse = {
	id: string;
	message: string;
	createdDate: string;
	snapshotId: string;
	aquariumId: string;
};
