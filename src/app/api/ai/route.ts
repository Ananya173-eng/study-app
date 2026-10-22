import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// List of Gemini model candidates in priority order
const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

async function callGemini(apiKey: string, prompt: string, expectJson: boolean = false) {
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      };

      if (expectJson) {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error?.message || `HTTP ${res.status}`;
        console.warn(`Gemini API call to ${model} failed (${res.status}): ${errorMsg}`);
        lastError = data?.error || { message: errorMsg, code: res.status };
        // If it's a 404 (model not found), continue to try next model in fallback list
        if (res.status === 404) {
          continue;
        }
        // If it's an auth error or rate limit, break and report
        break;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { success: true, text, model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Network error querying Gemini model ${model}:`, err.message);
    }
  }

  return { success: false, error: lastError };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, apiKey } = body;

    const resolvedApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY?.trim() ||
      '';

    if (!resolvedApiKey) {
      return NextResponse.json({ status: 'no_api_key_use_fallback' }, { status: 200 });
    }

    let prompt = '';
    let expectJson = false;

    if (action === 'summarize') {
      const { title, content, style, depth } = payload;
      const truncatedContent = (content || '').slice(0, 20000);

      if (style === 'key-concepts') {
        prompt = `You are a distinguished university professor and academic tutor. 
Analyze the study material titled "${title}".
TASK: Extract and explain 4 to 8 DISTINCT and UNIQUE Key Concepts covered in the material.
Depth level: ${depth}.

CRITICAL REQUIREMENTS:
- Each concept MUST be distinct with its own specific heading (e.g. "### 💡 Concept 1: [Exact Name]").
- Give a thorough, concrete explanation of how each mechanism works based on the text.
- Highlight the real-world significance and exam-relevance for each concept.
- DO NOT repeat the same explanations or boilerplate across concepts.

DOCUMENT CONTENT:
${truncatedContent}`;
      } else if (style === 'bullet-points') {
        prompt = `You are an expert academic tutor. Summarize "${title}" into structured, high-yield bullet points with ${depth} depth.
Highlight core principles, formulas/algorithms, and critical conclusions.
DOCUMENT CONTENT:
${truncatedContent}`;
      } else if (style === 'study-guide') {
        prompt = `You are an academic mentor. Create a comprehensive, exam-ready Study Guide for "${title}".
Depth: ${depth}.
Include:
1. Executive Overview
2. Foundational Principles & Theorems
3. Critical Mechanics & Constraints
4. High-Yield Exam Takeaways & Self-Test Questions.
DOCUMENT CONTENT:
${truncatedContent}`;
      } else {
        // executive
        prompt = `You are an academic researcher. Provide an executive summary of "${title}" with ${depth} detail.
Synthesize the thesis, supporting evidence, architectural or biological mechanisms, and implications.
DOCUMENT CONTENT:
${truncatedContent}`;
      }
    } else if (action === 'generateQuiz') {
      expectJson = true;
      const count = Number(payload.count) || 5;
      const difficulty = (payload.difficulty || 'medium').toLowerCase();
      const truncatedContent = (payload.content || '').slice(0, 20000);

      prompt = `You are an expert exam professor.
TASK: Generate EXACTLY ${count} Multiple Choice Questions (MCQs) of "${difficulty.toUpperCase()}" difficulty based strictly on the study content of "${payload.title}".

DIFFICULTY GUIDELINES:
- EASY: Clear definitions, direct recall of terms, basic concepts.
- MEDIUM: Trade-offs, comparison between components, operational steps, cause-and-effect.
- HARD: Edge cases, failure modes, subtle constraints, boundary conditions, and mathematical/logical deductions.

STRICT SCHEMA (Return a JSON array with EXACTLY ${count} items):
[
  {
    "id": "q1",
    "question": "Clear, precise question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Detailed pedagogical explanation of why this answer is correct and why other options fail."
  }
]

STUDY CONTENT:
${truncatedContent}`;
    } else if (action === 'generateFlashcards') {
      expectJson = true;
      const count = Number(payload.count) || 8;
      const truncatedContent = (payload.content || '').slice(0, 20000);

      prompt = `You are an active-recall learning specialist.
TASK: Extract EXACTLY ${count} high-yield study flashcards from the material titled "${payload.title}".

CRITICAL REQUIREMENTS:
- You must generate EXACTLY ${count} unique flashcards.
- Each flashcard should test an essential definition, theorem, formula, algorithm step, or mechanism.
- Avoid duplicate or generic flashcards.

STRICT SCHEMA (Return a JSON array with EXACTLY ${count} items):
[
  {
    "id": "c1",
    "term": "Concept or Question",
    "definition": "Accurate, concise explanation or definition",
    "category": "${payload.title}"
  }
]

STUDY CONTENT:
${truncatedContent}`;
    } else if (action === 'chat') {
      const sourcesText = (payload.contextSources || [])
        .map(
          (s: { title: string; content: string }) =>
            `--- SOURCE: ${s.title} ---\n${(s.content || '').slice(0, 7000)}`
        )
        .join('\n\n');

      prompt = `You are the AI Academic Study Assistant for a student using Retrieval-Augmented Generation (RAG).
The student is asking: "${payload.query}".

KNOWLEDGE CONTEXT RETRIEVED FROM STUDENT'S LIBRARY:
${sourcesText}

CONVERSATION HISTORY:
${(payload.history || []).map((h: any) => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}

INSTRUCTIONS:
1. Provide a comprehensive, clear, pedagogical answer directly addressing the student's question.
2. Ground your answer in the provided study sources whenever possible.
3. Explicitly cite the source document name (e.g. "[Source: CS401_Distributed_Systems...]") when mentioning key concepts.
4. If the exact answer is not in the excerpts, synthesize the most accurate academic explanation while noting what was found in their documents.`;
    } else if (action === 'planGoal') {
      expectJson = true;
      prompt = `You are an academic productivity coach.
TASK: Create a structured study milestone roadmap to achieve the goal: "${payload.goal}" in ${payload.subject || 'academics'} across ${payload.timeframeDays || 7} days.

STRICT SCHEMA (Return JSON):
{
  "overview": "Roadmap summary describing the study pacing and milestones",
  "tasks": [
    {
      "id": "t1",
      "title": "Actionable task title",
      "description": "Specific study activities, pages to read, or problems to solve",
      "category": "${payload.subject || 'Study'}",
      "priority": "high",
      "estimatedHours": 2,
      "suggestedDeadline": "2026-10-20T18:00"
    }
  ]
}`;
    }

    // Call Gemini API
    const geminiResult = await callGemini(resolvedApiKey, prompt, expectJson);

    if (geminiResult.success && geminiResult.text) {
      const rawText = geminiResult.text;

      if (action === 'summarize') {
        return NextResponse.json({ result: rawText, model: geminiResult.model });
      }

      if (action === 'generateQuiz') {
        try {
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const questions = JSON.parse(cleanJson);
          if (Array.isArray(questions) && questions.length > 0) {
            return NextResponse.json({ questions, model: geminiResult.model });
          }
        } catch (jsonErr) {
          console.warn('Quiz JSON parse error from Gemini output:', jsonErr);
        }
      }

      if (action === 'generateFlashcards') {
        try {
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const cards = JSON.parse(cleanJson);
          if (Array.isArray(cards) && cards.length > 0) {
            return NextResponse.json({ cards, model: geminiResult.model });
          }
        } catch (jsonErr) {
          console.warn('Flashcards JSON parse error from Gemini output:', jsonErr);
        }
      }

      if (action === 'chat') {
        return NextResponse.json({
          answer: rawText,
          model: geminiResult.model,
          sources: (payload.contextSources || []).slice(0, 3).map((s: any) => ({
            title: s.title,
            type: s.type,
            snippet: (s.content || '').slice(0, 220) + '...',
          })),
        });
      }

      if (action === 'planGoal') {
        try {
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const planData = JSON.parse(cleanJson);
          return NextResponse.json({ ...planData, model: geminiResult.model });
        } catch (jsonErr) {
          console.warn('Planner JSON parse error from Gemini output:', jsonErr);
        }
      }
    }

    // If Gemini had an error (e.g. rate limit, quota, network), return structured error info so client fallback can run seamlessly
    return NextResponse.json({
      status: 'use_fallback',
      geminiError: geminiResult.error ? (geminiResult.error.message || String(geminiResult.error)) : undefined,
    });
  } catch (error: any) {
    console.error('AI Route Handler Error:', error);
    return NextResponse.json(
      { status: 'use_fallback', error: error?.message || 'Internal AI Route Error' },
      { status: 200 }
    );
  }
}
