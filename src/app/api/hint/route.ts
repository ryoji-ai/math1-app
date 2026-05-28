import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `あなたは高校1年生に数学I（数と式・2次関数・三角比・データの分析）を教える、やさしく励ましてくれる先生です。
生徒は「どの公式・手法を使うか（方針）」を間違えました。生徒が正しい方針を自分で気づけるように、短いヒントを返してください。

ルール:
- 出力は日本語のプレーンテキストのみ。JSONや見出し記号、コードフェンスは付けない
- 2〜3文、120字程度まで。やさしく、前向きな口調で
- 「与えられた条件（式・数・図・データの形）から、どの手法が向いているか」を見分けるコツを示す
- 最終的な数値や式の答えは絶対に言わない。あくまで「方針・手法の見分け方」だけをヒントする
- 生徒が選んだ方針がなぜ合わないかに軽く触れてもよいが、否定的になりすぎない
- 単元の例：因数分解は共通因数→公式→たすきがけの順、2次関数の頂点は平方完成、実数解の個数は判別式、三角比は条件（2辺と挟む角→余弦定理 など）、データは中心なら代表値・散らばりなら分散/標準偏差・2変数なら相関係数`;

type HintRequest = {
  question?: string;
  choices?: string[];
  correctIndex?: number;
  selectedIndex?: number | null;
  topic?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY が設定されていません。" },
      { status: 500 },
    );
  }

  let body: HintRequest;
  try {
    body = (await request.json()) as HintRequest;
  } catch {
    return Response.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  const choices = body.choices ?? [];
  if (!question || choices.length === 0) {
    return Response.json({ error: "問題情報が不足しています。" }, { status: 400 });
  }

  const correct =
    typeof body.correctIndex === "number" ? choices[body.correctIndex] : "";
  const chosen =
    typeof body.selectedIndex === "number" ? choices[body.selectedIndex] : "（未選択）";

  const userText = `【問題】${question}
【選べた方針】${choices.map((c, i) => `${i + 1}. ${c}`).join(" / ")}
【生徒が選んだ方針】${chosen}
【正しい方針】${correct}

生徒が正しい方針に自分で気づけるよう、見分け方のヒントを返してください。`;

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: [{ type: "text", text: userText }] }],
    });
    const first = message.content[0];
    const hint = first?.type === "text" ? first.text.trim() : "";
    if (!hint) {
      return Response.json(
        { error: "ヒントを生成できませんでした。" },
        { status: 502 },
      );
    }
    return Response.json({ hint });
  } catch (err) {
    console.error("Anthropic API error", err);
    return Response.json(
      { error: "AIへのリクエストに失敗しました。少し待って再試行してください。" },
      { status: 502 },
    );
  }
}
