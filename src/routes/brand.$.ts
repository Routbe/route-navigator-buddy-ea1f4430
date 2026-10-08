import { createFileRoute } from "@tanstack/react-router";

/**
 * Vaste ROUT-URL voor merkbestanden (perskit, deel-afbeeldingen):
 * `/brand/og/home.jpg`, `/brand/press/rout-icon.svg`.
 * Bestanden staan in de interne Scaleway-bucket onder `brand/`; we sturen door
 * naar een kortlevende ondertekende link. Zonder opslag valt de route terug op
 * de lokale kopie in `public/`, zodat een gedeelde link nooit breekt.
 */
const FILE_RE = /^(og|press)\/[a-z0-9-]+\.(jpg|png|svg|ico)$/;

export const Route = createFileRoute("/brand/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String(params._splat ?? "");
        if (!FILE_RE.test(path)) return new Response("Not found", { status: 404 });
        const fallback = `/${path}`;
        try {
          const { storageConfigured, presignedGetUrl } = await import("@/lib/storage/s3.server");
          if (storageConfigured("internal")) {
            const url = await presignedGetUrl("internal", `brand/${path}`, 60 * 60 * 24);
            return new Response(null, {
              status: 302,
              headers: { location: url, "cache-control": "public, max-age=3600" },
            });
          }
        } catch (error) {
          console.error("[brand] presign failed", error);
        }
        return new Response(null, { status: 302, headers: { location: fallback, "cache-control": "public, max-age=300" } });
      },
    },
  },
});
