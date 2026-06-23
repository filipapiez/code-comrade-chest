import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/mirrors.html?raw";

export const Route = createFileRoute("/mirrors.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
