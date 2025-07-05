import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, language } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'generate':
        systemPrompt = `You are an expert programmer. Generate clean, efficient, and well-documented code in ${language || 'JavaScript'}. Always include comments explaining the logic.`;
        userPrompt = `Generate code for: ${prompt}`;
        break;
      case 'debug':
        systemPrompt = `You are a debugging expert. Analyze the code and identify issues, then provide the corrected version with explanations.`;
        userPrompt = `Debug this code:\n${prompt}`;
        break;
      case 'review':
        systemPrompt = `You are a senior code reviewer. Provide constructive feedback on code quality, performance, security, and best practices.`;
        userPrompt = `Review this code:\n${prompt}`;
        break;
      default:
        systemPrompt = `You are an expert programmer. Help with the following programming task.`;
        userPrompt = prompt;
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
      type: type
    });

  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
} 