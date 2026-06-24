import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/glass-railings-buyers-guide.html?raw";

export const Route = createFileRoute("/glass-railings-buyers-guide.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
