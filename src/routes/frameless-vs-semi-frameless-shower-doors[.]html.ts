import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/frameless-vs-semi-frameless-shower-doors.html?raw";

export const Route = createFileRoute("/frameless-vs-semi-frameless-shower-doors.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
