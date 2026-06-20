import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/replacement-glass.html?raw";

export const Route = createFileRoute("/replacement-glass.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
