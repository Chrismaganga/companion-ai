import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, size } = await req.json();

    // Enhance the prompt based on style
    let enhancedPrompt = prompt;
    switch (style) {
      case 'realistic':
        enhancedPrompt = `Photorealistic image: ${prompt}`;
        break;
      case 'artistic':
        enhancedPrompt = `Artistic, creative interpretation: ${prompt}`;
        break;
      case 'cartoon':
        enhancedPrompt = `Cartoon style, animated: ${prompt}`;
        break;
      case 'abstract':
        enhancedPrompt = `Abstract, modern art style: ${prompt}`;
        break;
      default:
        enhancedPrompt = prompt;
    }

    const response = await openai.createImage({
      prompt: enhancedPrompt,
      n: 1,
      size: size || "1024x1024",
      // model, quality, style are not supported in v3.x createImage
    });

    return NextResponse.json({
      imageUrl: response.data.data?.[0]?.url || '',
      prompt: enhancedPrompt
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 