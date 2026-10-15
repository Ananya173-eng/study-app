import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, apiKey } = body;

    const resolvedApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!resolvedApiKey) {
      // Let client use intelligent fallback
      return NextResponse.json({ status: 'no_api_key_use_fallback' }, { status: 200 });
    }

    // If Gemini key is available (starts with AIza or user configured)
    if (resolvedApiKey.startsWith('AIza') || process.env.GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${resolvedApiKey}`;
        let prompt = '';

        if (action === 'summarize') {
          prompt = `You are an expert academic tutor. Summarize the following document titled "${payload.title}" in ${payload.style} format with ${payload.depth} detail.\n\nDocument Content:\n${payload.content.slice(0, 15000)}`;
        } else if (action === 'generateQuiz') {
          prompt = `You are a university professor. Generate ${payload.count} high-quality Multiple Choice Questions (MCQs) of ${payload.difficulty} difficulty based on this study content: "${payload.title}".
Format strictly as JSON with this schema:
[
  {
    "id": "q1",
    "question": "question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswerIndex": 0,
    "explanation": "why this is correct"
  }
]
Content:
${payload.content.slice(0, 15000)}
Return ONLY raw JSON, no markdown backticks.`;
        } else if (action === 'generateFlashcards') {
          prompt = `Extract ${payload.count} high-yield study flashcards from this text: "${payload.title}".
Format strictly as JSON array:
[
  {
    "id": "c1",
    "term": "Concept or Term",
    "definition": "Clear concise definition or explanation",
    "category": "${payload.title}"
  }
]
Content:
${payload.content.slice(0, 15000)}
Return ONLY raw JSON, no markdown backticks.`;
        } else if (action === 'chat') {
          const sourcesText = payload.contextSources
            .map((s: { title: string; content: string }) => `--- SOURCE: ${s.title} ---\n${s.content.slice(0, 5000)}`)
            .join('\n\n');
          prompt = `You are an AI Academic Study Assistant using RAG. Answer the student's question based strictly on their study materials.\n\nContext Sources:\n${sourcesText}\n\nStudent Question: ${payload.query}\nProvide a clear, pedagogical answer with citations to the source material where applicable.`;
        } else if (action === 'planGoal') {
          prompt = `Create a structured study milestone roadmap to achieve this goal: "${payload.goal}" in ${payload.subject || 'academics'} over ${payload.timeframeDays} days.
Format strictly as JSON:
{
  "overview": "roadmap summary paragraph",
  "tasks": [
    {
      "id": "t1",
      "title": "task title",
      "description": "actionable task details",
      "category": "${payload.subject || 'Study'}",
      "priority": "high",
      "estimatedHours": 2,
      "suggestedDeadline": "2026-10-20T18:00"
    }
  ]
}
Return ONLY raw JSON.`;
        }

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4 },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

          if (action === 'summarize') {
            return NextResponse.json({ result: rawText });
          } else if (action === 'generateQuiz') {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const questions = JSON.parse(cleanJson);
            return NextResponse.json({ questions });
          } else if (action === 'generateFlashcards') {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const cards = JSON.parse(cleanJson);
            return NextResponse.json({ cards });
          } else if (action === 'chat') {
            return NextResponse.json({
              answer: rawText,
              sources: payload.contextSources.map((s: { title: string; type: string; content: string }) => ({
                title: s.title,
                type: s.type,
                snippet: s.content.slice(0, 160) + '...',
              })),
            });
          } else if (action === 'planGoal') {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const planData = JSON.parse(cleanJson);
            return NextResponse.json(planData);
          }
        }
      } catch (geminiErr) {
        console.error('Gemini API call failed, falling back to local engine:', geminiErr);
      }
    }

    return NextResponse.json({ status: 'use_fallback' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
