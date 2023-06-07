import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { OpenAI } from "langchain";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const input = await req.text();
  try {
    // Initialize the LLM to use to answer the question.
    const model = new OpenAI({});

    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: "asia-southeast1-gcp",
    });

    const pineconeIndex = client.Index("museee");
    const namespace = "Museee-1-hxcore-test";

    // Emedding the text

    // const jsonDirectory = path.join(process.cwd(), "public");
    // const text = fs.readFileSync(
    //   jsonDirectory + "/hxcore_release_manager.txt",
    //   "utf8"
    // );
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 600,
    //   chunkOverlap: 100,
    // });

    // const docs = await textSplitter.createDocuments([text]);
    // //embed the PDF documents
    // return await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    //   pineconeIndex: pineconeIndex,
    //   namespace: namespace,
    //   textKey: 'text',
    // });

    // Retrieve the data from Pinecone.
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: pineconeIndex,
        textKey: "text",
        namespace: namespace,
      }
    );

    // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const res = await chain.call({
      query: input,
    });

    console.log(res);

    return NextResponse.json(res.text);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json(
      "I was not able to find the answer through search. I should try a different approach.\nAction: none"
    );
  }
}
