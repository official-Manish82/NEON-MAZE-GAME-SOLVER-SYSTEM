import pytest
from maze_generator import generate_maze
from dijkstra import find_shortest_path

def test_maze_generator():
    width, height = 21, 21
    maze = generate_maze(width, height)
    
    # Check dimensions
    assert len(maze) == width
    assert len(maze[0]) == height
    
    # Check start and goal are open
    assert maze[1][1] == 0
    assert maze[width - 2][height - 2] == 0

def test_dijkstra_finds_path():
    # Simple 5x5 maze with a clear path
    grid = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ]
    start_x, start_y = 1, 1
    end_x, end_y = 3, 3
    
    path = find_shortest_path(grid, start_x, start_y, end_x, end_y)
    
    # Path should exist
    assert len(path) > 0
    # Needs to be continuous
    assert path[0] == [start_x, start_y]
    assert path[-1] == [end_x, end_y]
    
    # Shortest path trace
    # 1,1 -> 1,2 -> 1,3 -> 2,3 -> 3,3  = 5 steps
    assert len(path) == 5

def test_dijkstra_no_path():
    grid = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ]
    start_x, start_y = 1, 1
    end_x, end_y = 3, 1
    
    path = find_shortest_path(grid, start_x, start_y, end_x, end_y)
    
    # No path between the two open spots
    assert path == []
