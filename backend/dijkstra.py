import heapq

def find_shortest_path(grid, start_x, start_y, end_x, end_y):
    width = len(grid)
    height = len(grid[0]) if width > 0 else 0

    # Distance map to store the shortest distance to each cell
    # Initialize with infinity
    distances = { (x, y): float('inf') for x in range(width) for y in range(height) }
    distances[(start_x, start_y)] = 0

    # Path reconstruction map
    came_from = {}

    # Priority queue: (distance, (x, y))
    pq = [(0, start_x, start_y)]

    # Directions: Up, Down, Left, Right
    directions = [(0, -1), (0, 1), (-1, 0), (1, 0)]

    while pq:
        current_distance, cx, cy = heapq.heappop(pq)

        # Reached the end
        if cx == end_x and cy == end_y:
            break

        # If we found a shorter path previously, skip
        if current_distance > distances[(cx, cy)]:
            continue

        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy

            # Check boundaries and if it's a path (0)
            if 0 <= nx < width and 0 <= ny < height and grid[nx][ny] == 0:
                distance = current_distance + 1 # Each step cost is 1

                if distance < distances[(nx, ny)]:
                    distances[(nx, ny)] = distance
                    came_from[(nx, ny)] = (cx, cy)
                    heapq.heappush(pq, (distance, nx, ny))

    # Reconstruct path
    path = []
    curr = (end_x, end_y)
    
    if curr not in came_from and curr != (start_x, start_y):
        return [] # No path found

    while curr in came_from:
        path.append(list(curr))
        curr = came_from[curr]
    
    path.append(list((start_x, start_y)))
    path.reverse() # Start to End

    return path
