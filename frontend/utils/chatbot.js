import qaData from "../data/qa_data.json";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

export class StaticChatbot {
  constructor() {
    this.questions = qaData.questions;
    this.answers = qaData.answers;
    this.embeddings = tf.tensor(qaData.embeddings);
    this.model = null;
  }

  async initialize() {
    await tf.ready();
    // Load the Universal Sentence Encoder
    this.model = await tf.loadGraphModel(
      "https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder-lite/1/default/1",
      { fromTFHub: true }
    );
  }

  async findAnswer(query) {
    if (!this.model) await this.initialize();

    // Exact match check
    const exactMatchIndex = this.questions.indexOf(query);
    if (exactMatchIndex !== -1) {
      return this.answers[exactMatchIndex];
    }

    // Semantic similarity search
    const queryEmbedding = await this.model.predict(tf.tensor1d([query]));
    const similarities = tf
      .matMul(queryEmbedding, this.embeddings, false, true)
      .dataSync();

    const bestMatchIndex = similarities.indexOf(Math.max(...similarities));
    if (similarities[bestMatchIndex] > 0.6) {
      // Similarity threshold
      return this.answers[bestMatchIndex];
    }

    return "Sorry, I don't have information about that specific question.";
  }
}
