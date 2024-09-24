export const APP_NAME = "Building AI Apps with Node.js and LangChain";

export function title(pageTitle?: string) {
  if (!pageTitle) return APP_NAME;

  return `${pageTitle} | ${APP_NAME}`;
}
