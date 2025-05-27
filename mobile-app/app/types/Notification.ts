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

export type Notification = {
	type: NotificationType;
	metric_type?: MetricType;
	title: string;
	description: string;
	timestamp: string;
	unread: boolean;
};
