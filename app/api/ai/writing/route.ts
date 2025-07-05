import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { text, type, style, targetAudience } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'write':
        systemPrompt = `You are an expert content writer. Create engaging, well-structured content that matches the specified style and target audience. 
        Focus on clarity, coherence, and engaging writing.`;
        userPrompt = `Write content about: ${text}
        Style: ${style || 'professional'}
        Target Audience: ${targetAudience || 'general'}`;
        break;
      
      case 'grammar':
        systemPrompt = `You are a grammar expert and writing coach. Review the text for grammar, punctuation, spelling, and clarity issues. 
        Provide corrections and explanations for each issue found.`;
        userPrompt = `Check and correct the grammar in this text:\n${text}`;
        break;
      
      case 'improve':
        systemPrompt = `You are a writing improvement expert. Enhance the given text by improving style, flow, clarity, and impact while maintaining the original meaning. 
        Focus on making it more engaging and professional.`;
        userPrompt = `Improve the style and clarity of this text:\n${text}`;
        break;
      
      case 'translate':
        systemPrompt = `You are a professional translator. Translate the given text accurately while maintaining the original tone and meaning.`;
        userPrompt = `Translate this text to ${style || 'English'}:\n${text}`;
        break;
      
      default:
        systemPrompt = `You are an expert writing assistant. Help improve the given text.`;
        userPrompt = text;
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
      originalText: text
    });

  } catch (error) {
    console.error('Writing assistance error:', error);
    return NextResponse.json(
      { error: 'Failed to process writing request' },
      { status: 500 }
    );
  }
} 