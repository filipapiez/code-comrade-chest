import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/office-partitions-guide.html?raw";

export const Route = createFileRoute("/office-partitions-guide.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
