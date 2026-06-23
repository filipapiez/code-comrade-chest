import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/wine-cigar-rooms.html?raw";

export const Route = createFileRoute("/wine-cigar-rooms.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
