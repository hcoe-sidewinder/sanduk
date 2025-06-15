import re
import numpy as np
import faiss
import warnings
from langdetect import detect, DetectorFactory
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch
from PyPDF2 import PdfReader
from googletrans import Translator

self.translator = Translator()


try:
    import pdfplumber
    USE_PDFPLUMBER = True
except ImportError:
    USE_PDFPLUMBER = False
    print("Warning: pdfplumber not installed. Falling back to PyPDF2.")
    from PyPDF2 import PdfReader

DetectorFactory.seed = 0
warnings.filterwarnings("ignore")

class MultilingualRAGBot:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.chunks = []
        self.embeddings = None
        self.index = None
        
        self.embedding_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-mpnet-base-v2')
        
        self.ne_to_en_tokenizer = AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-ne-en")
        self.ne_to_en_model = AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-ne-en")
        
        self.en_to_ne_tokenizer = AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-ne")
        self.en_to_ne_model = AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-en-ne")
        
        self.qa_tokenizer = AutoTokenizer.from_pretrained("deepset/roberta-base-squad2")
        self.qa_model = AutoModelForSeq2SeqLM.from_pretrained("deepset/roberta-base-squad2")

    def extract_text_from_pdf(self):
        """Extract text from PDF with error handling"""
        text = ""
        try:
            if USE_PDFPLUMBER:
                with pdfplumber.open(self.pdf_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() + "\n"
            else:
                with open(self.pdf_path, 'rb') as file:
                    reader = PdfReader(file)
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
        except Exception as e:
            print(f"Error reading PDF: {str(e)}")
        return text

    def preprocess_text(self, text):
        """Split text into semantic chunks"""
        text = re.sub(r'\s+', ' ', text).strip()
        
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s', text)
        
        chunks = []
        current_chunk = ""
        for sentence in sentences:
            if len(current_chunk.split()) + len(sentence.split()) < 400:  # Smaller chunks work better
                current_chunk += sentence + " "
            else:
                chunks.append(current_chunk.strip())
                current_chunk = sentence + " "
        if current_chunk:
            chunks.append(current_chunk.strip())
        return chunks

    def create_vector_store(self, chunks):
        """Create FAISS vector index"""
        self.chunks = chunks
        self.embeddings = self.embedding_model.encode(chunks, show_progress_bar=False)
        self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
        self.index.add(self.embeddings.astype(np.float32))

    def initialize(self):
        """Initialize the RAG system"""
        print("Processing PDF...")
        text = self.extract_text_from_pdf()
        if not text:
            raise ValueError("Failed to extract text from PDF")
            
        chunks = self.preprocess_text(text)
        print(f"Created {len(chunks)} text chunks")
        self.create_vector_store(chunks)
        print("Vector store created. Ready for queries!")

    def detect_language(self, text):
        """Safe language detection with fallback"""
        try:
            return detect(text)
        except:
            return 'en'  # Default to English

    def translate(self, text, src_lang, tgt_lang):
        """Translate text between languages using model directly"""
        if src_lang == 'ne' and tgt_lang == 'en':
            tokenizer = self.ne_to_en_tokenizer
            model = self.ne_to_en_model
        elif src_lang == 'en' and tgt_lang == 'ne':
            tokenizer = self.en_to_ne_tokenizer
            model = self.en_to_ne_model
        else:
            return text  # for translation not supported
        
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        outputs = model.generate(**inputs)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)

    def translate_to_english(self, text):
        """Translate Nepali to English"""
        if self.detect_language(text) == 'ne':
            return self.translate(text, 'ne', 'en')
        return text

    def translate_to_nepali(self, text):
        """Translate English to Nepali"""
        if self.detect_language(text) == 'en':
            return self.translate(text, 'en', 'ne')
        return text

    def retrieve_context(self, query_embedding, k=5):
        """Retrieve relevant context chunks"""
        distances, indices = self.index.search(query_embedding, k)
        return " ".join([self.chunks[i] for i in indices[0]])

    def answer_question(self, question, context):
        """Answer question using context"""
        inputs = self.qa_tokenizer(
            question,
            context,
            padding=True,
            truncation=True,
            return_tensors="pt"
        )
        
        with torch.no_grad():
            outputs = self.qa_model(**inputs)
        
        answer_start = torch.argmax(outputs.start_logits)
        answer_end = torch.argmax(outputs.end_logits) + 1
        answer = self.qa_tokenizer.convert_tokens_to_string(
            self.qa_tokenizer.convert_ids_to_tokens(inputs["input_ids"][0][answer_start:answer_end])
        )
        return answer

    def generate_answer(self, query):
        """Generate answer in query's language"""
       
        lang = self.detect_language(query)
        translated_query = self.translate_to_english(query) if lang == 'ne' else query
        
       
        query_embedding = self.embedding_model.encode([translated_query])
        context = self.retrieve_context(query_embedding)
        
        # Generate answer in English
        try:
            answer = self.answer_question(translated_query, context)
        except:
            answer = "Sorry, I couldn't find an answer in the document."
        
        # Translate back to Nepali if original was Nepali
        return self.translate_to_nepali(answer) if lang == 'ne' else answer

if __name__ == "__main__":
   
    bot = MultilingualRAGBot("./pdfs/rag.pdf")
    bot.initialize()
    
    print("Chat with the document (type 'exit' to quit):")
    while True:
        query = input("\nYou: ")
        if query.lower() == 'exit':
            break
            
        response = bot.generate_answer(query)
        print(f"Bot: {response}")