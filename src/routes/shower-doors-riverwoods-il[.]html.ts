import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/shower-doors-riverwoods-il.html?raw";

export const Route = createFileRoute("/shower-doors-riverwoods-il.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
