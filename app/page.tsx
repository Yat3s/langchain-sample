"use client";

import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { useState } from "react";

const OpenAIApiKey = "your api key";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const callLLM = async () => {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      openAIApiKey: OpenAIApiKey,
    });
    const chainForName = new LLMChain({
      llm,
      prompt: new PromptTemplate({
        template: `What is a good name for a new App that related to {about}?`,
        inputVariables: ["about"],
      }),
    });

    const chainForSlogan = new LLMChain({
      llm: new OpenAI({
        temperature: 0,
        openAIApiKey: OpenAIApiKey,
      }),
      prompt: new PromptTemplate({
        template: `What is a good slogan for a app that named as {appName}?`,
        inputVariables: ["appName"],
      }),
    });

    const overallChain = new SimpleSequentialChain({
      chains: [chainForName, chainForSlogan],
      verbose: true,
    });
    const result = await overallChain.run(input);
    setOutput(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        <div className="text-6xl font-bold">Chains</div>
        <div className="flex items-center mt-10">
          <div>What is a good slogan for a new App that related to: </div>
          <input
            className="text-xl mt-2 border-2 border-gray-200 rounded-md p-2 w-36 ml-2"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></input>
        </div>

        <div className="bg-gray-100 p-4 mt-10 rounded">
          <div className="font-bold text-lg">Output:</div>
          <div>{output}</div>
        </div>
        <button
          className="rounded px-4 py-2 bg-blue-500 text-white mt-10 w-full"
          onClick={callLLM}
        >
          CALL
        </button>
      </div>
    </main>
  );
}
