import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Message {
  role: string;
  content: string;
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { lastChoice, history } = await req.json(); 
  let messageChain = history;

  if(messageChain.length > 0){
    messageChain.push({ role: "user", content: lastChoice, })
      messageChain = (function(){
      return messageChain.map((msg: Message) => {
        let newContent = msg.content;
        if (typeof newContent !== "string") {
          newContent = JSON.stringify(newContent);
        }
        return { ...msg, content: newContent };
      })
    })()
  }else{
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
    const ipCheck = await fetch(`https://ipapi.co/${ip}/json`);
    //const { city, region } = await ipCheck.json();

    messageChain = [
      { role: 'developer', content: `You are a helpful AI trip planner. You will be helping people plan something fun, it could be a whole trip, or be as casual as helping them figure out what they are doing today. Your recommendations must be around the city Los Angeles, California. The user will start with an initial prompt. Everything should end with a list of 4-6 places that fit the person's mood and area, you will get these results by going back and forth with the person to understand the user's vibe. It is up to you to ask the person for additional follow up prompts, once you have enough information, generate the list of places. You can only respond using JSON only! You must use the JSON response templates below. The person will respond with one of the options you provided them. 
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

  const model = await openai.responses.create({model: 'ft:gpt-4o-mini-2024-07-18:personal:odyssey-4:BLm1vaJY', input: messageChain});
  const responseMessage = JSON.parse(model.output_text.replaceAll("`", "").replaceAll("json", ""));
  messageChain.push({ role: "assistant", content: responseMessage })
  return NextResponse.json(messageChain);
}
