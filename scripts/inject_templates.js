const fs = require('fs');
const filePath = 'C:/Users/saali/Skill2Hire/app/student/projects/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const aiTemplates = `
  'prec_ai_1': {
    'orchestrator.py': \`import asyncio
from langgraph.graph import StateGraph, END
from agents import PlannerAgent, CoderAgent, ReviewerAgent

class WorkflowState(dict):
    task: str
    plan: list
    code: str
    review_passed: bool
    iterations: int

async def run_multi_agent_system(task_prompt: str):
    print(f"[ORCHESTRATOR] Initiating autonomous workflow for task: {task_prompt}")
    graph = StateGraph(WorkflowState)
    
    graph.add_node('planner', PlannerAgent.generate_subtasks)
    graph.add_node('coder', CoderAgent.synthesize_code)
    graph.add_node('reviewer', ReviewerAgent.audit_security)
    
    graph.set_entry_point('planner')
    graph.add_edge('planner', 'coder')
    graph.add_edge('coder', 'reviewer')
    
    def review_condition(state):
        if state.get('review_passed') or state.get('iterations', 0) >= 3:
            return END
        return 'coder'
        
    graph.add_conditional_edges('reviewer', review_condition)
    app = graph.compile()
    
    final_state = await app.ainvoke({'task': task_prompt, 'iterations': 0})
    print("[ORCHESTRATOR] Autonomous pipeline completed successfully!")
    return final_state
\`,
    'agents.py': \`class PlannerAgent:
    @staticmethod
    def generate_subtasks(state):
        print("[PLANNER] Decomposing goal into verifiable milestones...")
        state['plan'] = [
            '1. Define API interface schema',
            '2. Implement business logic with edge validation',
            '3. Write automated unit test assertions'
        ]
        return state

class CoderAgent:
    @staticmethod
    def synthesize_code(state):
        print("[CODER] Synthesizing AST-compliant solution...")
        state['code'] = "def execute_solution():\\n    return {'status': 'success', 'code': 200}\\n"
        state['iterations'] = state.get('iterations', 0) + 1
        return state

class ReviewerAgent:
    @staticmethod
    def audit_security(state):
        print("[REVIEWER] Inspecting generated syntax tree for security invariants...")
        state['review_passed'] = True
        return state
\`,
    'main.py': \`import asyncio
from orchestrator import run_multi_agent_system

if __name__ == '__main__':
    asyncio.run(run_multi_agent_system('Build scalable OAuth2 PKCE authentication flow'))
\`
  },
  'prec_ai_2': {
    'rag_engine.py': \`from vector_store import ChromaVectorDatabase
from hybrid_search import reciprocal_rank_fusion

class EnterpriseRAGPipeline:
    def __init__(self, collection_name='enterprise_docs'):
        self.db = ChromaVectorDatabase(collection_name)
        print("[RAG] Initialized dense-sparse vector hybrid indexing store.")
        
    def query(self, user_question: str, top_k: int = 5):
        dense_results = self.db.similarity_search(user_question, k=top_k)
        sparse_results = self.db.bm25_search(user_question, k=top_k)
        fused_passages = reciprocal_rank_fusion(dense_results, sparse_results)
        
        context = "\\n---\\n".join([p['text'] for p in fused_passages[:3]])
        prompt = f"Context:\\n{context}\\n\\nQuestion: {user_question}\\nAnswer with source citations:"
        return {'prompt': prompt, 'sources': [p['doc_id'] for p in fused_passages[:3]]}
\`,
    'vector_store.py': \`class ChromaVectorDatabase:
    def __init__(self, collection):
        self.collection = collection
        self.docs = [
            {'doc_id': 'sec_policy_v2', 'text': 'All API tokens require 128-bit entropy and TLS 1.3 encryption.'},
            {'doc_id': 'cloud_infra_guide', 'text': 'Microservices deploy to private VPC subnets with NAT egress.'}
        ]
    def similarity_search(self, query, k=3):
        return self.docs
    def bm25_search(self, query, k=3):
        return self.docs
\`,
    'hybrid_search.py': \`def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    scores = {}
    for rank, doc in enumerate(dense_ranks):
        scores[doc['doc_id']] = scores.get(doc['doc_id'], 0) + 1.0 / (k + rank + 1)
    for rank, doc in enumerate(sparse_ranks):
        scores[doc['doc_id']] = scores.get(doc['doc_id'], 0) + 1.0 / (k + rank + 1)
    return sorted(dense_ranks, key=lambda d: scores.get(d['doc_id'], 0), reverse=True)
\`
  },
  'prec_ai_3': {
    'voice_server.py': \`import asyncio
from fastapi import FastAPI, WebSocket
from vad_stream import SileroVADProcessor

app = FastAPI(title="Real-Time Voice AI Stream")
vad = SileroVADProcessor()

@app.websocket("/ws/audio")
async def audio_stream_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[VOICE] WebRTC real-time audio channel connected.")
    try:
        while True:
            chunk = await websocket.receive_bytes()
            is_speech = vad.process_chunk(chunk)
            if is_speech:
                await websocket.send_json({'type': 'speech_detected', 'status': 'listening'})
    except Exception as e:
        print(f"[VOICE] Stream closed: {e}")
\`,
    'vad_stream.py': \`class SileroVADProcessor:
    def __init__(self, sample_rate=16000):
        self.sample_rate = sample_rate
    def process_chunk(self, audio_bytes):
        return len(audio_bytes) > 512
\`
  },
  'prec_ai_4': {
    'copilot_bot.py': \`import requests
from ast_parser import parse_git_diff_ast

def process_pull_request_webhook(payload):
    pr_number = payload.get('pull_request', {}).get('number')
    diff_url = payload.get('pull_request', {}).get('diff_url')
    print(f"[DEEPSEEK-BOT] Auditing PR #{pr_number} diff: {diff_url}")
    
    findings = parse_git_diff_ast(diff_url)
    review_body = f"### 🤖 DeepSeek Code Review Telemetry\\n\\n**Status:** {len(findings)} recommendations found.\\n\\n"
    for f in findings:
        review_body += f"- ⚠️ **Line {f['line']}**: {f['message']}\\n"
    return review_body
\`,
    'ast_parser.py': \`def parse_git_diff_ast(diff_url):
    return [
        {'line': 42, 'message': 'Potential SQL injection risk. Prefer parameterized queries over raw f-strings.'},
        {'line': 88, 'message': 'Missing error handling for remote timeout exception.'}
    ]
\`
  },
  'prec_ai_5': {
    'defect_detector.py': \`import cv2
import numpy as np

class IndustrialDefectDetector:
    def __init__(self, onnx_model_path='models/yolov8_defects.onnx'):
        print(f"[YOLOv8-ONNX] Loaded edge inference model: {onnx_model_path}")
        self.classes = ['Scratch', 'Micro-Crack', 'Void', 'Discoloration']
        
    def infer_frame(self, frame_bgr):
        h, w = frame_bgr.shape[:2]
        boxes = [
            {'label': 'Micro-Crack', 'confidence': 0.94, 'box': [w//4, h//4, w//2, h//2]}
        ]
        return boxes
\`
  },
  'prec_ai_6': {
    'semantic_matcher.py': \`import spacy
from sentence_transformers import SentenceTransformer, util

class ResumeSemanticEngine:
    def __init__(self):
        print("[NLP] Initializing all-MiniLM-L6-v2 vector embeddings...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
    def match_resume_to_jd(self, resume_text: str, jd_text: str):
        emb_resume = self.model.encode(resume_text, convert_to_tensor=True)
        emb_jd = self.model.encode(jd_text, convert_to_tensor=True)
        similarity = util.cos_sim(emb_resume, emb_jd).item()
        match_score = round(similarity * 100, 1)
        print(f"[MATCH] Computed ATS compatibility score: {match_score}%")
        return match_score
\`
  },
`;

const insertMarker = 'const PROJECT_FILES: Record<string, Record<string, string>> = {';
const insertPos = content.indexOf(insertMarker);
if (insertPos !== -1) {
  const afterMarker = insertPos + insertMarker.length;
  content = content.slice(0, afterMarker) + aiTemplates + content.slice(afterMarker);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully injected AI project templates into app/student/projects/[id]/page.tsx');
} else {
  console.error('Marker not found in file');
}
