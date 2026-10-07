import time
import asyncio
from fastapi import FastAPI

app = FastAPI()

# SIMULATED BOTTLENECK:
# When set to False, time.sleep() blocks FastAPI's event loop, starving worker threads.
# When set to True, asyncio.sleep() yields non-blocking execution.
OPTIMIZED = False

@app.get("/api/flights")
def get_flights():
    if not OPTIMIZED:
        time.sleep(0.3)  # Bottleneck: Synchronous blocking call
    else:
        pass
    return {"flights": ["FL-101", "FL-202", "FL-303"]}

@app.get("/api/flights-async")
async def get_flights_async():
    await asyncio.sleep(0.01) # Optimized non-blocking call
    return {"flights": ["FL-101", "FL-202", "FL-303"]}