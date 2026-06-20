import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/custom-shower-glass.html?raw";

export const Route = createFileRoute("/custom-shower-glass.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
