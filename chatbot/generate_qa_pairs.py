generate_qa_pairs.py
import json
import numpy as np
from rag_bot import MultilingualRAGBot  

class QAGenerator:
    def __init__(self, pdf_path):
        self.bot = MultilingualRAGBot(pdf_path)
        self.bot.initialize()
        
    def generate_qa_pairs(self, questions):
        """Generate answers for a list of questions"""
        qa_pairs = {}
        for question in questions:
            answer = self.bot.generate_answer(question)
            qa_pairs[question] = answer
            print(f"Processed: {question[:50]}...")
        return qa_pairs
    
    def save_with_embeddings(self, qa_pairs, output_file):
        """Save Q&A pairs with question embeddings"""
        questions = list(qa_pairs.keys())
        embeddings = self.bot.embedding_model.encode(questions)
        
        data = {
            "questions": questions,
            "answers": [qa_pairs[q] for q in questions],
            "embeddings": embeddings.tolist()
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(questions)} Q&A pairs to {output_file}")

if __name__ == "__main__":
    generator = QAGenerator("./pdfs/rag.pdf")
    
    questions = [
        "What is the main purpose of this document?",
        "Who are the intended users of this system?",
        "What are the key features mentioned?",
        "यस प्रणालीको मुख्य उद्देश्य के हो?",
        "प्रलेखमा उल्लेखित प्रमुख विशेषताहरू के के हुन्?",
        "How does the authentication work?",
        "कृपया सारांश प्रदान गर्नुहोस्",
        "What languages are supported?",
        "के यो प्रणालीले नेपाली भाषा समर्थन गर्छ?"
    ]
    
    qa_pairs = generator.generate_qa_pairs(questions)
    generator.save_with_embeddings(qa_pairs, "qa_data.json")