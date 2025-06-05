import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { GlobalPendingIndicator } from "@/components/global-pending-indicator";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

import "./globals.css";

function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalPendingIndicator />
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    switch (error.status) {
      case 404:
        message = "Page Not Found";
        break;
      case 403:
        message = "Access Forbidden";
        break;
      case 401:
        message = "Unauthorized";
        break;
      case 500:
        message = "Internal Server Error";
        break;
      default:
        message = error.statusText || `Error ${error.status}`;
    }
  } else {
    console.error(error);
    // Extract meaningful error message from the error object
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object" && "message" in error) {
      message = String(error.message);
    }
  }

  return (
    <App>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">{status}</h1>
          <p className="text-xl text-gray-600">{message}</p>
          <div className="mt-8">
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </div>
      </div>
    </App>
  );
}
