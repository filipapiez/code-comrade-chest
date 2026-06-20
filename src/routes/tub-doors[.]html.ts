import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/tub-doors.html?raw";

export const Route = createFileRoute("/tub-doors.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
