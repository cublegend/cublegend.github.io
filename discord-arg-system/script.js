require("dotenv").config();

const { sceneLabel, profiles, script } = require("./config");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseBoolean(value, fallback = false) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  return fallback;
}

function parseNumber(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function applyJitter(delayMs, jitterEnabled, jitterPct) {
  if (!jitterEnabled || jitterPct <= 0) {
    return Math.max(0, Math.floor(delayMs));
  }
  const boundedPct = Math.min(Math.max(jitterPct, 0), 0.9);
  const spread = delayMs * boundedPct;
  const offset = (Math.random() * 2 - 1) * spread;
  return Math.max(0, Math.floor(delayMs + offset));
}

function buildWebhookProfiles() {
  const webhookBySpeaker = {
    A: process.env.WEBHOOK_A,
    B: process.env.WEBHOOK_B,
    C: process.env.WEBHOOK_C
  };

  for (const speakerId of ["A", "B", "C"]) {
    if (!webhookBySpeaker[speakerId]) {
      throw new Error(`Missing required environment variable WEBHOOK_${speakerId}.`);
    }
  }

  return {
    A: { ...profiles.A, webhook: webhookBySpeaker.A },
    B: { ...profiles.B, webhook: webhookBySpeaker.B },
    C: { ...profiles.C, webhook: webhookBySpeaker.C }
  };
}

function validateScript(mergedProfiles) {
  if (!Array.isArray(script) || script.length === 0) {
    throw new Error("script must be a non-empty array.");
  }

  script.forEach((entry, index) => {
    if (!Array.isArray(entry) || entry.length !== 3) {
      throw new Error(`Invalid script entry at line ${index + 1}. Expected [speakerId, text, delayMs].`);
    }

    const [speakerId, text, delayMs] = entry;
    if (!mergedProfiles[speakerId]) {
      throw new Error(`Invalid speaker '${speakerId}' at line ${index + 1}. Allowed: A, B, C.`);
    }
    if (typeof text !== "string" || text.trim() === "") {
      throw new Error(`Invalid text at line ${index + 1}.`);
    }
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      throw new Error(`Invalid delay at line ${index + 1}. Delay must be a number >= 0.`);
    }
  });
}

async function postViaWebhook(webhookUrl, payload, lineIndex) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Discord rejected line ${lineIndex + 1} (HTTP ${response.status}). Body: ${errorBody || "<empty>"}`
    );
  }
}

async function run() {
  const dryRun = parseBoolean(process.env.DRY_RUN, false);
  const jitterEnabled = parseBoolean(process.env.ENABLE_DELAY_JITTER, true);
  const jitterPct = parseNumber(process.env.DELAY_JITTER_PCT, 0.2);

  const mergedProfiles = buildWebhookProfiles();
  validateScript(mergedProfiles);

  console.log(`Scene trigger label: ${sceneLabel}`);
  console.log(`Dry run: ${dryRun ? "enabled" : "disabled"}`);
  console.log(`Delay jitter: ${jitterEnabled ? `enabled (${jitterPct})` : "disabled"}`);

  for (let i = 0; i < script.length; i += 1) {
    const [speakerId, text, delayMs] = script[i];
    const speaker = mergedProfiles[speakerId];
    const effectiveDelay = applyJitter(delayMs, jitterEnabled, jitterPct);

    const payload = {
      content: text,
      username: speaker.name,
      avatar_url: speaker.avatar
    };

    console.log(`[${i + 1}/${script.length}] ${speakerId} (${speaker.name}): ${text}`);

    try {
      if (dryRun) {
        console.log(`  -> DRY RUN (no send). Delay ${effectiveDelay}ms`);
      } else {
        await postViaWebhook(speaker.webhook, payload, i);
        console.log(`  -> Sent. Delay ${effectiveDelay}ms`);
      }
    } catch (error) {
      console.error(`Failed on line ${i + 1}: ${error.message}`);
      throw error;
    }

    if (i < script.length - 1) {
      await sleep(effectiveDelay);
    }
  }

  console.log("Scene complete.");
}

run().catch((error) => {
  console.error(`Run aborted: ${error.message}`);
  process.exitCode = 1;
});
