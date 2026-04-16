import random

def generate_maze(width: int, height: int):
    # Ensure dimensions are odd
    if width % 2 == 0: width += 1
    if height % 2 == 0: height += 1

    # Initialize grid with walls (1)
    grid = [[1 for _ in range(height)] for _ in range(width)]

    def carve_passages_from(cx, cy):
        directions = [(0, -2), (0, 2), (-2, 0), (2, 0)]
        random.shuffle(directions)

        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy

            if 1 <= nx < width - 1 and 1 <= ny < height - 1 and grid[nx][ny] == 1:
                # Carve through to cell and the intermediate wall
                grid[cx + dx // 2][cy + dy // 2] = 0
                grid[nx][ny] = 0
                carve_passages_from(nx, ny)

    # Start carving from (1, 1)
    start_x, start_y = 1, 1
    grid[start_x][start_y] = 0
    carve_passages_from(start_x, start_y)

    # Ensure start and end are 0 (open path)
    # Goal will preferably be bottom-right open cell
    goal_x, goal_y = width - 2, height - 2
    grid[start_x][start_y] = 0
    grid[goal_x][goal_y] = 0

    # Ensure a path to goal if it somehow ended up walled off. 
    # Not strictly necessary for DFS but good sanity measure.
    # DFS guarantees spanning tree, so all non-wall cells are connected.
    
    return grid
