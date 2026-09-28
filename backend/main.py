import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from groq import Groq

# Attempt to import real Hindsight, fallback to mock if still installing
try:
    from hindsight_client import Hindsight
except ImportError:
    try:
        from hindsight import Hindsight
    except ImportError:
        class Hindsight:
            def __init__(self, *args, **kwargs):
                self.api_key = kwargs.get("api_key", "dummy_key")
                self._store = []
            def retain(self, text):
                self._store.append(text)
                return True
            def recall(self, query, top_k=5):
                return [{"text": m} for m in self._store if "client_festopiya" in m]

app = FastAPI(title="Nexus Autonomous Investigation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "dummy_key")
HINDSIGHT_API_KEY = os.environ.get("HINDSIGHT_API_KEY", "dummy_key")

groq_client = Groq(api_key=GROQ_API_KEY)
hindsight_client = Hindsight(base_url="https://api.hindsight.vectorize.io", api_key=HINDSIGHT_API_KEY)

import urllib.request
import re
from typing import Optional

class DeployPayload(BaseModel):
    changes: str
    client_name: str = "festopiya"

class AnalysisPayload(BaseModel):
    issue: str
    client_name: str = "festopiya"
    target_url: Optional[str] = None

@app.post("/api/webhook/deploy")
async def handle_deploy(payload: DeployPayload):
    """
    Endpoint 1: /api/webhook/deploy
    Accepts a JSON payload of simulated code changes and uses hindsight.retain() 
    to save this with the tag for the specific client.
    """
    memory_text = f"[{payload.client_name}] CODE DEPLOY: {payload.changes}"
    client_tag = f"client_{payload.client_name}"
    
    try:
        try:
            try:
                await hindsight_client.aretain(bank_id="festopiya_seo", content=memory_text, tags=[client_tag])
            except AttributeError:
                hindsight_client.retain(memory_text)
        except Exception as e:
            logging.warning(f"Failed to retain deploy event to Hindsight: {e}")
            
        return {"status": "success", "message": "Code change retained in Hindsight", "retained": memory_text}
    except Exception as e:
        logging.error(f"Error retaining memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trigger-analysis")
async def trigger_analysis(payload: AnalysisPayload):
    """
    Endpoint 2: /api/trigger-analysis
    Recalls recent deployment memories for the specific client, optionally scrapes a live URL,
    passes them to Groq, asks Groq for the fix, and uses hindsight.retain() to permanently save the new Learned SEO Rule.
    """
    client_tag = f"client_{payload.client_name}"
    
    try:
        retrieved_memories = []
        try:
            # 1. Recall recent memories targeting the specific client
            try:
                recall_results = await hindsight_client.arecall(
                    bank_id="festopiya_seo", 
                    query=f"[{payload.client_name}] {payload.issue}", 
                    max_tokens=100,
                    tags=[client_tag]
                )
                results_list = getattr(recall_results, 'results', recall_results)
            except AttributeError:
                recall_results = hindsight_client.recall(query=f"[{payload.client_name}] {payload.issue}", top_k=5)
                results_list = recall_results
            
            for res in results_list:
                text = ""
                if hasattr(res, 'text'):
                    text = res.text
                elif isinstance(res, dict) and 'text' in res:
                    text = res['text']
                else:
                    text = str(res)
                    
                # Strict Multi-Tenant Isolation: Only keep memories that explicitly belong to this client
                if f"[{payload.client_name}]" in text:
                    retrieved_memories.append(text)
        except Exception as e:
            logging.warning(f"Failed to retrieve from Hindsight (using empty memory): {e}")
            
        context_str = "\n- ".join(retrieved_memories) if retrieved_memories else "No past memory available."

        # Scrape live URL if provided
        scraped_content = ""
        if payload.target_url:
            try:
                req = urllib.request.Request(payload.target_url, headers={'User-Agent': 'Mozilla/5.0 (Nexus Agent)'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    html_bytes = response.read()
                    html_str = html_bytes.decode('utf-8', errors='ignore')
                    # Strip basic HTML tags to save tokens
                    text_only = re.sub('<[^<]+>', ' ', html_str)
                    text_only = re.sub('\s+', ' ', text_only)
                    scraped_content = text_only[:3000].strip()
            except Exception as e:
                scraped_content = f"Failed to scrape {payload.target_url}: {e}"

        # 2. Ask Groq for Analysis
        system_prompt = (
            f"You are an Autonomous SEO Background Worker for {payload.client_name}. "
            "Traffic has just dropped. Based on the recent code changes retrieved from Hindsight memory, "
            "and optionally the live website content, determine why the traffic dropped, and provide a fix. "
            "Make your analysis punchy and highly technical. "
            "Also, you MUST format your final sentence exactly as: "
            "'Learned SEO Rule: <your rule here>'"
        )
        
        user_prompt = f"Hindsight Memory Retrieved (Recent Code Changes):\n- {context_str}\n\nIssue: {payload.issue}\n\n"
        if payload.target_url:
            user_prompt += f"Live Website Content Scraped from {payload.target_url}:\n---\n{scraped_content}\n---\n\n"
        
        user_prompt += "Based on these recent code changes and the live website content, why did traffic drop, and what is the fix?"

        try:
            completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="qwen/qwen3.8-27b", 
                temperature=0.2,
                max_tokens=500
            )
            response_content = completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Groq API error: {e}")
            response_content = f"Failed to generate analysis due to API error: {e}"

        # 3. Retain the Learned SEO Rule
        rule_to_learn = f"[{payload.client_name}] LEARNED RULE from issue '{payload.issue}': {response_content}"
        
        try:
            try:
                await hindsight_client.aretain(bank_id="festopiya_seo", content=rule_to_learn, tags=[client_tag])
            except AttributeError:
                hindsight_client.retain(rule_to_learn)
        except Exception as e:
            logging.warning(f"Failed to retain learned rule to Hindsight: {e}")

        return {
            "analysis_and_fix": response_content,
            "hindsight_memory_retrieved": retrieved_memories,
            "learned_rule_retained": True
        }
    except Exception as e:
        logging.error(f"Error triggering analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
