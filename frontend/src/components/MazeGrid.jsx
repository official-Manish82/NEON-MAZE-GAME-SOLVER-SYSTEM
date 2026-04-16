import React from 'react';

const MazeGrid = ({ grid, playerPos, endPos, shortestPath, availableMoves, onMoveClick, visitedMap }) => {
  if (!grid || grid.length === 0) return null;
  const width = grid.length;
  const height = grid[0].length;

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isEnd = endPos[0] === x && endPos[1] === y;
      let cellType = grid[x][y]; // 1 = wall, 0 = path
      let isShortestPath = shortestPath.some(p => p[0] === x && p[1] === y);
      let isVisited = visitedMap[`${x},${y}`];
      
      // Is there an available move dot here?
      let moveDir = availableMoves.find(m => m[0] === x && m[1] === y);

      cells.push({ x, y, cellType, isEnd, isShortestPath, isVisited, moveDir });
    }
  }

  return (
    <div 
      className="inline-grid p-2 bg-[#0d0000] rounded-xl shadow-2xl border border-red-900 mx-auto relative"
      style={{
        gridTemplateColumns: `repeat(${width}, 20px)`,
        gridTemplateRows: `repeat(${height}, 20px)`,
        gap: '0px'
      }}
    >
      {cells.map((cell) => {
        let baseClass = cell.cellType === 1 ? 'cell-wall' : 'cell-path';
        
        let content = null;
        if (cell.isEnd) {
          content = <div className="w-full h-full rounded-full bg-purple-500 portal-anim scale-90 z-0 relative pointer-events-none"></div>;
        } else if (cell.isShortestPath) {
          content = <div className="w-full h-full cell-shortest-path scale-50 z-0 relative opacity-80 pointer-events-none"></div>;
        } else if (cell.moveDir) {
          // Render Clickable Dot
          content = (
            <div 
              onClick={() => onMoveClick(cell.moveDir)}
              className="w-full h-full rounded-full bg-white scale-50 cursor-pointer animate-pulse drop-shadow-[0_0_8px_white] z-30 relative hover:scale-75 transition-transform"
              title="Click to move here"
            ></div>
          );
        } else if (cell.isVisited && cell.cellType === 0) {
          // Visited paint
          content = <div className="w-full h-full bg-[#ff2e2e] opacity-20 pointer-events-none"></div>;
        }

        return (
          <div 
            key={`${cell.x}-${cell.y}`} 
            className={`w-[20px] h-[20px] m-0 ${baseClass} flex items-center justify-center relative`}
          >
            {content}
          </div>
        );
      })}

      {/* Floating Player Absolute Positioned */}
      <div 
        className="absolute z-20 w-[20px] h-[20px] pointer-events-none flex items-center justify-center transition-all duration-75 ease-linear"
        style={{
          left: `calc(8px + ${playerPos[0] * 20}px)`,
          top: `calc(8px + ${playerPos[1] * 20}px)`
        }}
      >
        <div className="w-full h-full rounded-full bg-white shadow-neon-white scale-75 relative"></div>
      </div>
    </div>
  );
};

export default MazeGrid;
