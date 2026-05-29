import { ImageResponse } from "next/og";

// iPhone のホーム画面用アイコン（apple-touch-icon）。SVG は iOS で使えないため PNG を生成する。
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e7490",
          color: "#f3fafb",
          fontSize: 92,
          fontWeight: 700,
          fontStyle: "italic",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        sin
      </div>
    ),
    { ...size },
  );
}
