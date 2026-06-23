import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/glass-railings.html?raw";

export const Route = createFileRoute("/glass-railings.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
