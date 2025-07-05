import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { content, type, subject, difficulty } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'flashcards':
        systemPrompt = `You are an expert educator. Create effective flashcards from the given content. 
        Each flashcard should have a clear question on the front and a concise answer on the back.
        Format as JSON array with 'question' and 'answer' fields.`;
        userPrompt = `Create flashcards from this content: ${content}
        Subject: ${subject || 'general'}
        Number of flashcards: 10`;
        break;
      
      case 'quiz':
        systemPrompt = `You are an expert quiz creator. Generate a comprehensive quiz based on the given content.
        Include multiple choice questions with 4 options each, and provide the correct answer.
        Format as JSON with questions array containing question, options, and correctAnswer.`;
        userPrompt = `Create a quiz from this content: ${content}
        Subject: ${subject || 'general'}
        Difficulty: ${difficulty || 'medium'}
        Number of questions: 10`;
        break;
      
      case 'studyplan':
        systemPrompt = `You are an expert study planner. Create a structured study plan based on the given content.
        Break down the material into manageable sections with time estimates and learning objectives.`;
        userPrompt = `Create a study plan for: ${content}
        Subject: ${subject || 'general'}
        Time available: 2 weeks`;
        break;
      
      case 'explain':
        systemPrompt = `You are an expert teacher. Explain the given concept in simple, easy-to-understand terms.
        Use analogies, examples, and step-by-step explanations to make complex topics accessible.`;
        userPrompt = `Explain this concept: ${content}
        Target audience: Students
        Make it easy to understand with examples`;
        break;
      
      case 'summarize':
        systemPrompt = `You are an expert summarizer. Create a comprehensive summary of the given content.
        Highlight key points, main concepts, and important details in a structured format.`;
        userPrompt = `Summarize this content: ${content}
        Include key points and main concepts`;
        break;
      
      default:
        systemPrompt = `You are an expert learning assistant. Help students understand and learn from the given content.`;
        userPrompt = content;
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({
      result: completion.data.choices?.[0]?.message?.content || '',
      type: type,
      subject: subject
    });

  } catch (error) {
    console.error('Learning assistance error:', error);
    return NextResponse.json(
      { error: 'Failed to process learning request' },
      { status: 500 }
    );
  }
} 