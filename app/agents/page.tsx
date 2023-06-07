"use client";

import { useState } from "react";
export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const action = async () => {
    fetch("http://localhost:3000/api/agent", {
      method: "POST",
      body: JSON.stringify({ input: input }),
    })
      .then((res) => res.json())
      .then((result) => {
        setOutput(result);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        <div className="text-6xl font-bold">Agents</div>
        <div className="flex items-center mt-10">
          <input
            className="text-xl mt-2 border-2 border-gray-200 rounded-md p-2 w-96 ml-2"
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
          onClick={action}
        >
          CALL
        </button>
      </div>
    </main>
  );
}
