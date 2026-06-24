import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/other-custom-glass-guide.html?raw";

export const Route = createFileRoute("/other-custom-glass-guide.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
