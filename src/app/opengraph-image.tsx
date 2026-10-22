import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/config/site.config";

export const runtime = "nodejs";
export const alt = "VOUQUET.ID";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const config = getSiteConfig();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFF5F8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          border: "24px solid #F3C9D6",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 24px",
            background: "#FDE4EC",
            borderRadius: 30,
            marginBottom: 24,
            border: "2px solid #F3C9D6",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#C2336B",
              letterSpacing: 2,
            }}
          >
            BUKET BUNGA SEGAR
          </span>
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#3B1D2A",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {config.store.name}
        </h1>

        <p
          style={{
            fontSize: 28,
            color: "#7A5565",
            textAlign: "center",
            maxWidth: 800,
            marginTop: 20,
          }}
        >
          {config.store.tagline || config.store.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 40,
            fontSize: 22,
            color: "#3B1D2A",
            fontWeight: 600,
          }}
        >
          <span>Pesan Mudah via WhatsApp</span>
          <span>•</span>
          <span>Pengiriman Cepat</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
