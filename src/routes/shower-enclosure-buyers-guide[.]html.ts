import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/shower-enclosure-buyers-guide.html?raw";

export const Route = createFileRoute("/shower-enclosure-buyers-guide.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
