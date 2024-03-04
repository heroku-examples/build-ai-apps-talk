export const APP_NAME = "AI Patterns Examples";

export function title(pageTitle?: string) {
	if (!pageTitle) return APP_NAME;

	return `${pageTitle} | ${APP_NAME}`;
}
