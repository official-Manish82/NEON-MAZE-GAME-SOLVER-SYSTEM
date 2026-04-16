# Design and Analysis of Algorithms (DAA) - Project Report

## Project Title: Neon Maze Game & Solver (DFS & Dijkstra)

---

### **Abstract**
The "Neon Maze Game" is an interactive web-based application built to explore and demonstrate the practical implementation of core algorithmic components taught in the Design and Analysis of Algorithms (DAA). The project utilizes a modern web tech stack with a React/Vite frontend and a Python/FastAPI backend. We implemented the **Depth-First Search (DFS)** algorithm to dynamically generate solvable mazes of varying dimensions, and **Dijkstra's Algorithm** to calculate and visualize the shortest possible path to the maze's exit. The project emphasizes time complexity analysis, algorithm correctness, and provides a graphical visualizer to enhance the learning of these algorithms.

---

## **1. Introduction**
In computational theory, graphs and grids are widely used to represent map-like structures. Mazes serve as excellent mediums for visualizing traversing algorithms. This project creates an aesthetic "Neon" style maze game. The user spawns at the starting point and navigates towards a portal at the exit. The game implements complex algorithmic concepts inside high-performing API routines, while users interact fluidly through junction-based auto-scrolling mechanics.

**Objectives of the Project:**
* To implement a recursive Depth First Search (DFS) for randomized valid maze generation.
* To implement Dijkstra’s algorithm using Priority Queues to find the shortest path dynamically.
* To build a decoupled architecture comprising an API backend (Python) and a graphical interactive UI (React).

---

## **2. System Architecture & Technology Stack**

The project follows a standard decoupled Client-Server architecture:

**Backend (Python/FastAPI):**
*   **FastAPI:** A high-performance Python framework used to serve API endpoints (`/generate-maze`, `/solve-maze`).
*   **CORS Middleware:** Enabled to seamlessly handle HTTP requests from the frontend client.
*   **Pytest:** Utilized to write unit testing suites ensuring the algorithmic correctness.

**Frontend (React/Vite):**
*   **React 19:** State-driven UI for handling grid generation, scoring, and movement logic.
*   **Vite:** Ultra-fast bundler and development server.
*   **Tailwind CSS:** Used for responsive styling, integrating dynamic glass-morphic elements and neon glows/shadows.

---

## **3. Algorithms and Data Structures Used**

This application extensively relies on fundamental graph theory traversal methods:

### **3.1 Maze Generation: Depth-First Search (DFS)**
*   **Approach:** We model the maze as a 2D grid matrix initialized entirely as "walls" (1). Using recursive backtracking (a form of DFS), the algorithm carves "paths" (0).
*   **Mechanism:** From a given cell, the algorithm looks at neighboring cells in random order. If a neighboring cell and its intermediate wall are untouched blockages, the algorithm converts them to paths and recursively moves to that cell. 
*   **Time Complexity:** \(O(V + E)\) where \(V\) is the number of vertices (cells) and \(E\) is the number of edges. Since exploring nodes in a grid scales linearly with size, it translates to \(O(N \times M)\) for an \(N \times M\) grid.
*   **Space Complexity:** \(O(N \times M)\) due to the maximum depth of the call stack required during deep recursion paths.

### **3.2 Pathfinding: Dijkstra's Algorithm**
*   **Approach:** Dijkstra is used to compute the Single-Source Shortest Path to reach the end portal. Because our step costs are uniform (distance between adjacent grid paths is 1), it acts similarly to a Breath-First Search with prioritization.
*   **Data Structures:** 
    *   **Min-Heap (Priority Queue):** Used to efficiently pop the node with the current shortest distance `(heapq.heappop)`.
    *   **Distance Hash Map & Came_From Map:** Used to trace back the optimized path nodes once the target is found.
*   **Time Complexity:** \(O(V + E \log V)\) mapped to a grid logic, making it \(O(K \log K)\), where \(K\) is the number of available path nodes derived from the maze generation.
*   **Space Complexity:** \(O(N \times M)\) for the maps logging visited distances and tracing the sequence.

---

## **4. Implementation Details**

### **Backend Application Flow**
1.  **`/generate-maze` Endpoint**: Accepts `width` and `height`. It sanitizes values to require odd numbers allowing proper wall/path ratios. It initializes a 2D matrix, executes the recursive DFS carver, and forcefully clears the endpoint bounds.
2.  **`/solve-maze` Endpoint**: Receives the entire parsed grid matrix along with starting and ending vectors. Dijkstra calculates the most optimal path, maps coordinates, trims non-shortest steps, and returns an array coordinate sequence as JSON.

### **Frontend Implementation Flow**
1.  **State Management**: React (`useState`, `useEffect`) holds grid layouts, active endpoints, timers, dynamic score calculation, and shortest path coordinates.
2.  **Difficulty Manager**: Standardizes bounds into 15x15 (Easy), 25x25 (Medium), 35x35 (Hard) matrices.
3.  **Junction-Based Auto-Scrolling Mechanism**: Instead of making the user click through every individual point, the frontend determines "available directions". Upon clicking a path, the game auto-completes intermediate paths until it reaches a junction (a cell with more than one possible forward direction) or a dead end. This greatly increases the fluidity of user experience.
4.  **UI & Graphics**: Grid visualization dynamically renders `div` elements customized via Tailwind constraints `[width:20px, height:20px]`. Classes trigger neon CSS pulses (`animate-pulse`, `portal-anim`) with box-shadows.

---

## **5. System Testing and Validation**

We utilized **Pytest** to create regression and logic testing for the backend code:

*   **Maze Dimension Integrity:** Asserted generation limits ensuring matrices maintain the user constraints precisely (`len(maze) == width`).
*   **Path Reachability:** A known standard 5x5 layout was hard-coded in testing parameters (`test_algo.py`). Output lengths and edge validation proved Dijkstra operates flawlessly outputting exactly 5 steps.
*   **No-Path Handling:** Evaluated grid partitions without valid linkage bounds. Proved Dijkstra terminates accurately and catches unreachable nodes by returning the empty configuration `[]`.

---

## **6. Conclusion and Future Scope**

### **Conclusion**
The Neon Maze Game successfully demonstrates the application of academic algorithms within a full-stack engineering pipeline. It effectively visualizes how graph traversal (DFS) generates structured randomness and how shortest path calculation (Dijkstra) efficiently solves it in real-time. The optimized APIs alongside interactive React UI produce an intuitive end-user experience.

### **Future Enhancements**
*   **A* (A-Star) Algorithm:** Upgrading Dijkstra to an A* search utilizing Heuristics (Manhattan distance) for exponentially faster resolution times.
*   **Multiple Themes:** Modifying state mechanisms to swap Tailwind configurations for various aesthetic skins beyond Neon.
*   **Real-time Multi-player Race:** Using WebSockets to pit users head-to-head on the identically generated graph.

---
_Submitted as partial fulfillment for the Design and Analysis of Algorithms (DAA) module._
