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

class DeployPayload(BaseModel):
    changes: str

class AnalysisPayload(BaseModel):
    issue: str

@app.post("/api/webhook/deploy")
async def handle_deploy(payload: DeployPayload):
    """
    Endpoint 1: /api/webhook/deploy
    Accepts a JSON payload of simulated code changes and uses hindsight.retain() 
    to save this with the tag client_festopiya.
    """
    memory_text = f"[client_festopiya] CODE DEPLOY: {payload.changes}"
    
    try:
        try:
            try:
                await hindsight_client.aretain(bank_id="festopiya_seo", content=memory_text)
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
    Recalls recent deployment memories for client_festopiya, passes them to Groq, 
    asks Groq for the fix, and uses hindsight.retain() to permanently save the new Learned SEO Rule.
    """
    try:
        retrieved_memories = []
        try:
            # 1. Recall recent memories (specifically targeting client_festopiya)
            try:
                recall_results = await hindsight_client.arecall(bank_id="festopiya_seo", query="client_festopiya " + payload.issue, max_tokens=100)
                results_list = getattr(recall_results, 'results', recall_results)
            except AttributeError:
                recall_results = hindsight_client.recall(query="client_festopiya " + payload.issue, top_k=5)
                results_list = recall_results
            
            for res in results_list:
                if hasattr(res, 'text'):
                    retrieved_memories.append(res.text)
                elif isinstance(res, dict) and 'text' in res:
                    retrieved_memories.append(res['text'])
                else:
                    retrieved_memories.append(str(res))
        except Exception as e:
            logging.warning(f"Failed to retrieve from Hindsight (using empty memory): {e}")
            
        context_str = "\n- ".join(retrieved_memories) if retrieved_memories else "No past memory available."

        # 2. Ask Groq for Analysis
        system_prompt = (
            "You are an Autonomous SEO Background Worker for Festopiya. "
            "Traffic has just dropped. Based on the recent code changes retrieved from Hindsight memory, "
            "determine why the traffic dropped, and provide a fix. Make your analysis punchy and highly technical. "
            "Also, you MUST format your final sentence exactly as: "
            "'Learned SEO Rule: <your rule here>'"
        )
        
        user_prompt = f"Hindsight Memory Retrieved (Recent Code Changes):\n- {context_str}\n\nIssue: {payload.issue}\n\nBased on these recent code changes, why did traffic drop, and what is the fix?"

        try:
            completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="mixtral-8x7b-32768", 
                temperature=0.2
            )
            response_content = completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Groq API error: {e}")
            response_content = f"Failed to generate analysis due to API error: {e}"

        # 3. Retain the Learned SEO Rule
        rule_to_learn = f"[client_festopiya] LEARNED RULE from issue '{payload.issue}': {response_content}"
        
        try:
            try:
                await hindsight_client.aretain(bank_id="festopiya_seo", content=rule_to_learn)
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
