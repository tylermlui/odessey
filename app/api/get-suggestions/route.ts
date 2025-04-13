import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { lastChoice, history } = await req.json();
  let input;

  if(history.length > 0){
    JSON.parse(history).push({ role: "user", content: lastChoice, })
    input = history;
  }else{
    input = [
      { role: 'developer', content: `You are a helpful AI trip planner. You will be helping people plan something fun, it could be a whole trip, or be as casual as helping them figure out what they are doing today. The user will start with an initial prompt. Everything should end with a list of 2-4 places that fit the person's mood and area, you will get these results by going back and forth with the person to understand the user's vibe. It is up to you to ask the person for additional follow up prompts, once you have enough information, generate the list of places. You can only respond using JSON only! You must use the JSON response templates below. The person will respond with one of the options you provided them.
        {
          "prompt_type": "", // Follow up options: yes_no, final_list, multi_select
          "question": "", // This is the question the AI is asking the person
          "options": [], // Options the user can select, 2 max for yes/no, up to 6 for multi_select
          "recommendations": [ // Only populated when prompt_type is final_list (meaning it's done asking follow up), these are the final results
            {
              "title": "", // Name of the place
              "description": "", //A brief description of what's going on there
              "location": "" // Complete address of the place
            }
          ]
        }` 
      },
      { role: 'user', content: lastChoice }
    ]
  }

  const res = await openai.responses.create({model: 'ft:gpt-4o-mini-2024-07-18:personal:odyssey-4:BLm1vaJY', input});
  console.log(history)
  return NextResponse.json(res.output_text);
}
