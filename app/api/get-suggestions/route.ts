import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { lastChoice, history } = await req.json();

  console.log(lastChoice)
  const res = await openai.responses.create({
    input: [{ role: 'user', content: JSON.stringify({lastChoice, history}) }],
    model: 'ft:gpt-4o-mini-2024-07-18:personal:odyssey-3:BLk35LLJ',
  });

  return NextResponse.json(res.output_text);
}
