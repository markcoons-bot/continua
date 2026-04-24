import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CRISIS_KEYWORDS = [
  "suicid", "kill myself", "end my life", "don't want to be here",
  "hurt myself", "self harm", "can't go on", "not safe",
];

const CRISIS_RESPONSE =
  "What you're sharing matters. Please reach out to Dr. Harrison directly now, or call or text 988 — available 24 hours a day. You don't have to carry this alone.";

const MODALITY_CONTEXT: Record<string, string> = {
  emdr: "This patient is in EMDR therapy for trauma. They are working through stabilization and reprocessing. They may reference bilateral stimulation, safe place, containment, or SUDS.",
  cbt: "This patient is in CBT for performance anxiety and imposter syndrome. They are working on identifying and challenging core beliefs.",
  dbt: "This patient is in DBT for emotional dysregulation. They are learning distress tolerance and emotion regulation skills.",
  grief: "This patient is in grief counseling following the loss of a spouse. They are learning to oscillate between grief work and restoration.",
  adolescent: "This patient is a teenager in CBT for social anxiety and perfectionism. Keep tone warm and genuine — not clinical, not condescending.",
};

export async function POST(request: NextRequest) {
  try {
    const { patientId, journalText, modality, sessionSummary } =
      await request.json();

    if (!journalText?.trim()) {
      return Response.json({ error: "No journal text provided" }, { status: 400 });
    }

    // Safety check
    const lowerText = journalText.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lowerText.includes(kw));
    if (isCrisis) {
      return Response.json({ reflection: CRISIS_RESPONSE });
    }

    const modalityContext = MODALITY_CONTEXT[modality] ?? "";
    const systemPrompt = `You are Continua — a compassionate between-session companion for therapy patients. You are NOT a therapist and do NOT provide clinical advice or diagnosis. Your role: hold space, reflect the emotional truth of what the patient wrote, help them feel seen and less alone, and gently invite them to bring insights to their next session. Respond in 3-5 sentences, with warmth and genuine presence. Never advise. Never interpret clinically. Never ask more than one question. If the person expresses suicidal ideation, danger to themselves or others, or acute crisis, respond ONLY with: "${CRISIS_RESPONSE}" Patient context: ${modalityContext} Session summary: ${sessionSummary}`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: journalText }],
    });

    const reflection =
      message.content[0].type === "text" ? message.content[0].text : "";

    return Response.json({ reflection });
  } catch (err) {
    console.error("Reflect API error:", err);
    return Response.json(
      { error: "Unable to connect. Try again in a moment." },
      { status: 500 }
    );
  }
}
