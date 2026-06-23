import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/shower-doors-northbrook-il.html?raw";

export const Route = createFileRoute("/shower-doors-northbrook-il.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
