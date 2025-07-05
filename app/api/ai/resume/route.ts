import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { name, email, experience, skills, targetRole, template } = await req.json();

    const systemPrompt = `You are an expert resume writer and career coach. Create a professional, ATS-friendly resume based on the provided information. 
    Format the response as clean HTML that can be easily converted to PDF. Use modern, professional styling.
    
    Guidelines:
    - Use action verbs and quantifiable achievements
    - Optimize for ATS (Applicant Tracking Systems)
    - Include relevant keywords for the target role
    - Keep it concise and impactful
    - Use professional formatting`;

    const userPrompt = `Create a professional resume for:
    Name: ${name}
    Email: ${email}
    Target Role: ${targetRole}
    Experience: ${experience}
    Skills: ${skills}
    
    Template Style: ${template || 'modern'}
    
    Please format the response as clean HTML with professional styling.`;

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
      max_tokens: 3000,
    });

    // Generate PDF-ready HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${name} - Resume</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 2.5em;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .contact {
          font-size: 1.1em;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 1.3em;
          font-weight: bold;
          color: #2563eb;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .experience-item, .skill-item {
          margin-bottom: 15px;
        }
        .job-title {
          font-weight: bold;
          color: #374151;
        }
        .company {
          color: #6b7280;
          font-style: italic;
        }
        .date {
          color: #9ca3af;
          font-size: 0.9em;
        }
        ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .skill-category {
          background: #f3f4f6;
          padding: 10px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      ${completion.data.choices?.[0]?.message?.content || ''}
    </body>
    </html>
    `;

    return NextResponse.json({
      html: htmlContent,
      name: name,
      targetRole: targetRole
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
} 