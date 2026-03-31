const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function getMessageFromBody(body) {
  if (!body) {
    return "";
  }

  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      return typeof parsed.message === "string" ? parsed.message.trim() : "";
    } catch (_error) {
      return "";
    }
  }

  if (typeof body === "object" && typeof body.message === "string") {
    return body.message.trim();
  }

  return "";
}

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  const fragments = [];

  for (const item of data.output) {
    if (!item || !Array.isArray(item.content)) {
      continue;
    }
    for (const contentItem of item.content) {
      if (contentItem && typeof contentItem.text === "string" && contentItem.text.trim()) {
        fragments.push(contentItem.text.trim());
      }
    }
  }

  return fragments.join("\n").trim();
}

module.exports = async function handler(req, res) {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing OPENAI_API_KEY." });
  }

  const message = getMessageFromBody(req.body);
  if (!message) {
    return res.status(400).json({ error: "Missing or empty 'message' field." });
  }

  try {
    const upstreamResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: message
              }
            ]
          }
        ]
      })
    });

    const responseData = await upstreamResponse.json().catch(() => ({}));

    if (!upstreamResponse.ok) {
      return res.status(502).json({ error: "Upstream OpenAI request failed." });
    }

    const reply = extractOutputText(responseData);
    if (!reply) {
      return res.status(502).json({ error: "OpenAI returned no reply text." });
    }

    return res.status(200).json({ reply });
  } catch (_error) {
    return res.status(500).json({ error: "Unexpected server error." });
  }
};
