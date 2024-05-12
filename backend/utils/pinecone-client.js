import path from 'path';
import dotenv from 'dotenv';
import { PineconeClient } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { makeChain } from '../utils/makechain';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone';

dotenv.config({ path: path.join(__dirname, '../.env') });

// const filePath = 'uploads';

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

export const initPinecone = async () => {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
};

export const run = async (filePath, meta) => {
  try {
    const ext = path.extname(filePath);
    let loader;
    switch (ext) {
      case '.pdf':
        loader = new PDFLoader(filePath);
        break;

      case '.docx':
        loader = new DocxLoader(filePath);
        break;

      default:
        break;
    }
    const pinecone = await initPinecone();
    const rawDocs = await loader.load();
    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: meta,
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

export const chatWithCustomFile = async (question, meta, history) => {
  console.log('question', question);

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  try {
    const pinecone = await initPinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
      pineconeIndex: index,
      textKey: meta,
      namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
    });

    //create chain
    const chain = makeChain(vectorStore);
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });
    return response;
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};
