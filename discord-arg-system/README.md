# Discord ARG One-Channel Persona System

Lightweight one-scene runner that posts scripted dialogue to one Discord channel using 3 webhooks (A/B/C personas).

## 1) Create the Discord webhooks

1. Open your target Discord server and channel.
2. Channel settings -> Integrations -> Webhooks.
3. Create **three** webhooks for the same channel.
4. Copy each webhook URL.

## 2) Install and configure

```bash
npm install
```

Create `.env` from `.env.example` and fill:

```env
WEBHOOK_A=...
WEBHOOK_B=...
WEBHOOK_C=...
DRY_RUN=false
ENABLE_DELAY_JITTER=true
DELAY_JITTER_PCT=0.2
```

## 3) Edit personas and dialogue

Edit `config.js`:

- `sceneLabel`: manual fake-date label (example: `03/32/2026`)
- `profiles.A/B/C.name`: display names
- `profiles.A/B/C.avatar`: avatar URLs
- `script`: ordered dialogue entries as:
  - `[speakerId, lineText, delayAfterMs]`

Example entry:

```js
["A", "朋友们，我创了个 server，先在这里聊计划。", 4000]
```

## 4) Run

```bash
npm start
```

The runner will:

1. Validate config and webhooks
2. Print scene label + mode
3. Post lines in order
4. Wait per-line delay before the next line

## Optional polish controls

- `DRY_RUN=true`: preview lines without sending
- `ENABLE_DELAY_JITTER=true`: adds random timing variation
- `DELAY_JITTER_PCT=0.2`: 20% delay variance cap (bounded and safe)

## Error behavior

- Missing `WEBHOOK_A/B/C` -> fails fast with clear message
- Invalid speaker (not A/B/C) -> fails with script line index
- Discord rejection -> logs failing line index and HTTP status

## Pacing guidance

- Short reactions: 1–3 sec
- Normal lines: 3–6 sec
- Long exposition: 6–10 sec
- Panic bursts: 0.8–2 sec

Keep the prank-to-corruption beat quick by giving the corruption line a short delay right after the prank line.
