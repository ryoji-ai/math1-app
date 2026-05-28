import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "数学I 練習帳",
    short_name: "数学I",
    description:
      "高校1年の数学I・三角比の「どの公式を使うか」を鍛える方針選択ドリル。AIヒント・段階解説つき。",
    start_url: "/",
    display: "standalone",
    background_color: "#f3fafb",
    theme_color: "#0e7490",
    lang: "ja",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
