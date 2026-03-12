import { NextRequest } from 'next/server'

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  const modelId = process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2'

  if (!apiKey || !voiceId) {
    return new Response(null, { status: 204 })
  }

  const body = (await request.json().catch(() => null)) as { text?: string } | null
  const text = body?.text?.trim()

  if (!text) {
    return Response.json({ error: 'Missing text' }, { status: 400 })
  }

  const voiceResponse = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text.slice(0, 320),
      model_id: modelId,
      language_code: 'es',
      voice_settings: {
        stability: 0.48,
        similarity_boost: 0.78,
        style: 0.26,
        use_speaker_boost: true,
      },
    }),
  })

  if (!voiceResponse.ok || !voiceResponse.body) {
    const errorText = await voiceResponse.text().catch(() => 'Unable to synthesize speech')
    return Response.json({ error: errorText }, { status: 502 })
  }

  return new Response(voiceResponse.body, {
    headers: {
      'Content-Type': voiceResponse.headers.get('content-type') ?? 'audio/mpeg',
      'Cache-Control': 'private, max-age=0, s-maxage=86400',
    },
  })
}
