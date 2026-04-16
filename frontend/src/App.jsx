import React, { useState, useEffect } from 'react';
import MazeGrid from './components/MazeGrid';

function App() {
  const [grid, setGrid] = useState([]);
  const [width, setWidth] = useState(21);
  const [height, setHeight] = useState(21);
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const [endPos, setEndPos] = useState([19, 19]);
  
  const [shortestPath, setShortestPath] = useState([]);
  const [showPath, setShowPath] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [score, setScore] = useState(0);

  // New states for junction-based movement
  const [isMoving, setIsMoving] = useState(false);
  const [availableMoves, setAvailableMoves] = useState([]);
  const [visitedMap, setVisitedMap] = useState({});

  const fetchMaze = async (w, h) => {
    setIsLoading(true);
    setHasWon(false);
    setShowPath(false);
    setTimerActive(false);
    setTime(0);
    setShortestPath([]);
    setIsMoving(false);
    setVisitedMap({});
    
    try {
      const res = await fetch(`http://localhost:8000/generate-maze?width=${w}&height=${h}`);
      if (!res.ok) throw new Error("Backend not running");
      const data = await res.json();
      setGrid(data.grid);
      setPlayerPos([1, 1]);
      setEndPos([data.width - 2, data.height - 2]);
      setVisitedMap({ "1,1": true });
      setTimerActive(true);
    } catch (e) {
      console.error(e);
      setGrid([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMaze(25, 25);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive && !hasWon) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, hasWon]);

  // Movement Logic Helpers
  const getWalkableNeighbors = (x, y) => {
    if (!grid || grid.length === 0) return [];
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const neighbors = [];
    for (let [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length && grid[nx][ny] === 0) {
        neighbors.push([nx, ny, dx, dy]);
      }
    }
    return neighbors;
  };

  // Recalculate available indicator dots whenever player stops moving
  useEffect(() => {
    if (hasWon || isMoving || grid.length === 0) {
      setAvailableMoves([]);
      return;
    }
    const [px, py] = playerPos;
    const neighbors = getWalkableNeighbors(px, py);
    setAvailableMoves(neighbors);
  }, [playerPos, isMoving, hasWon, grid]);

  // Core Junction Auto-Scrolling logic
  const handleMoveClick = async (clickedDir) => {
    if (isMoving || hasWon) return;
    
    // clickedDir is [nx, ny, dx, dy] 
    let [currX, currY, dx, dy] = clickedDir;
    let pathSeq = [[currX, currY]];
    
    setIsMoving(true);

    while (true) {
      // Reached goal?
      if (currX === endPos[0] && currY === endPos[1]) {
        break;
      }
      
      let neighbors = getWalkableNeighbors(currX, currY);
      // Filter out the cell we just came from
      let forwardNeighbors = neighbors.filter(n => !(n[0] === currX - dx && n[1] === currY - dy));

      if (forwardNeighbors.length === 0) {
        // Dead end
        break;
      } else if (forwardNeighbors.length > 1) {
        // Intersection - player must decide next move
        break;
      } else {
        // Exactly one way forward, automatic cornering
        let nextStep = forwardNeighbors[0];
        currX = nextStep[0];
        currY = nextStep[1];
        dx = nextStep[2];
        dy = nextStep[3];
        pathSeq.push([currX, currY]);
      }
    }

    // Animate the path sequence cell by cell
    let currentMap = { ...visitedMap };
    for (let i = 0; i < pathSeq.length; i++) {
        const point = pathSeq[i];
        setPlayerPos([point[0], point[1]]);
        currentMap[`${point[0]},${point[1]}`] = true;
        setVisitedMap({ ...currentMap });
        
        // Wait CSS transition duration (75ms defined in MazeGrid transition class)
        await new Promise(res => setTimeout(res, 75));

        if (point[0] === endPos[0] && point[1] === endPos[1]) {
            setHasWon(true);
            setTimerActive(false);
            setScore(Math.max(1000 - time * 10, 100));
            break;
        }
    }

    setIsMoving(false);
  };

  const handleFetchSolve = async () => {
    if (showPath) {
      setShowPath(false);
      return;
    }
    if (shortestPath.length > 0) {
      setShowPath(true);
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/solve-maze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid: grid,
          start: playerPos,
          end: endPos
        })
      });
      const data = await res.json();
      setShortestPath(data.path);
      setShowPath(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDifficulty = (level) => {
    setDifficulty(level);
    let size = 25;
    if (level === 'Easy') size = 15;
    if (level === 'Medium') size = 25;
    if (level === 'Hard') size = 35;
    setWidth(size);
    setHeight(size);
    fetchMaze(size, size);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white font-sans w-full max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-2 tracking-widest text-[#ff2e2e] drop-shadow-[0_0_15px_rgba(255,46,46,0.8)] uppercase">
        Neon Maze
      </h1>
      <p className="text-gray-400 mb-6 text-sm tracking-wider">Reach the pulsating portal</p>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-6 bg-[#1a0000] p-4 rounded-xl border border-red-900/50 shadow-[0_0_20px_rgba(255,46,46,0.1)]">
        <div className="flex space-x-2">
          {['Easy', 'Medium', 'Hard'].map((lvl) => (
            <button 
              key={lvl}
              onClick={() => handleDifficulty(lvl)}
              className={`px-4 py-1 rounded transition-all duration-300 ${
                difficulty === lvl 
                ? 'bg-red-600 text-white shadow-[0_0_10px_#ff0000]' 
                : 'bg-red-950 text-red-300 hover:bg-red-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-red-900 hidden sm:block"></div>
        <button 
          onClick={handleFetchSolve} 
          className="px-4 py-1 bg-yellow-600/20 text-yellow-500 border border-yellow-600 rounded hover:bg-yellow-600 hover:text-white transition-all shadow-[0_0_10px_rgba(202,138,4,0.3)]"
          disabled={isLoading || hasWon || isMoving}
        >
          {showPath ? 'Hide Path' : 'Show Hint'}
        </button>
        <button 
          onClick={() => fetchMaze(width, height)} 
          className="px-4 py-1 bg-blue-600/20 text-blue-400 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)]"
          disabled={isMoving}
        >
          Restart
        </button>
      </div>

      <div className="flex justify-between w-full max-w-sm mb-4 text-xl">
        <div className="text-red-400 font-mono">Time: <span className="text-white">{time}s</span></div>
        <div className="text-red-400 font-mono">Score: <span className="text-white">{score}</span></div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm">
            <div className="text-2xl animate-pulse text-red-500">Generating Grid...</div>
          </div>
        )}
        
        {hasWon && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-xl backdrop-blur-md border border-cyan-500 shadow-[0_0_30px_#00ffff]">
            <h2 className="text-5xl font-bold text-white shadow-neon-white drop-shadow-[0_0_10px_#00ffff] mb-4">ESCAPED!</h2>
            <p className="text-xl mb-6 text-gray-300">Time: {time}s | Score: {score}</p>
            <button 
              onClick={() => fetchMaze(width, height)} 
              className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-all font-bold shadow-[0_0_15px_#00ffff]"
            >
              Play Again
            </button>
          </div>
        )}

        {grid.length > 0 ? (
          <MazeGrid 
            grid={grid} 
            playerPos={playerPos} 
            endPos={endPos} 
            shortestPath={showPath ? shortestPath : []} 
            availableMoves={availableMoves}
            onMoveClick={handleMoveClick}
            visitedMap={visitedMap}
          />
        ) : (
          !isLoading && <div className="text-red-500 mt-10">Failed to connect to backend. Please ensure Python server is running on :8000</div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Click the white dots to rapidly traverse the corridors.</p>
      </div>
    </div>
  );
}

export default App;
