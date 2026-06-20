import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/index.html?raw";

export const Route = createFileRoute("/index.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
