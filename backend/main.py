from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
from maze_generator import generate_maze
from dijkstra import find_shortest_path

app = FastAPI(title="Neon Maze Game API")

# Add CORS so React frontend can fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    grid: List[List[int]]
    start: Tuple[int, int]
    end: Tuple[int, int]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/generate-maze")
def get_maze(width: int = 21, height: int = 21):
    # Enforce odd dimensions
    if width % 2 == 0: width += 1
    if height % 2 == 0: height += 1
    
    grid = generate_maze(width, height)
    return {"grid": grid, "width": len(grid), "height": len(grid[0])}

@app.post("/solve-maze")
def solve_maze(request: SolveRequest):
    grid = request.grid
    start_x, start_y = request.start
    end_x, end_y = request.end
    
    path = find_shortest_path(grid, start_x, start_y, end_x, end_y)
    return {"path": path}

# Run locally using: uvicorn main:app --reload
