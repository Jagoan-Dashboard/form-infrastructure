
import { isRouteErrorResponse } from "react-router";
import type { Route } from "../+types/root";
import { MainLayout } from "~/layout/main-layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Form Infrastruktur" },
    { name: "form infrastruktur", content: "Welcome to Form Infrastuktur" },
  ];
}

export default function RootLayout() {
  return <MainLayout />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container flex items-center justify-center w-screen h-screen mx-auto text-center ">
      <div className="">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}