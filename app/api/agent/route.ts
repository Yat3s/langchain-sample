import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { OpenAI } from "langchain";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const input = await req.text();
  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const tools = [
      new SerpAPI(process.env.SERPAPI_API_KEY, {
        location: "Austin,Texas,United States",
        hl: "en",
        gl: "us",
      }),
      new Calculator(),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, llm, {
      agentType: "zero-shot-react-description",
      verbose: true,
    });

    const result = await executor.call({ input });
    return NextResponse.json(result.output);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json(
      "I was not able to find the answer through search. I should try a different approach.\nAction: none"
    );
  }
}
