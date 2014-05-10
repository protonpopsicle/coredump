#!/usr/bin/python

import json
"""
      n
    k   l
  w   *   e
    j   m
      s
"""

directions = ('n', 's', 'e', 'w', 'j', 'k', 'l', 'm')

def neighbor(point, direction):
    row, col = point[0], point[1]
    if direction == 'n':
        return row-1, col
    elif direction == 's':
        return row+1, col
    elif direction == 'e':
        return row, col+1
    elif direction == 'w':
        return row, col-1
    elif direction == 'j':
        return row+1, col-1
    elif direction == 'k':
        return row-1, col-1
    elif direction == 'l':
        return row-1, col+1
    elif direction == 'm':
        return row+1, col+1

def start_point(char_map):
    for row_idx, row in enumerate(char_map):
        for col_idx, char in enumerate(row):
            if char in directions:
                return row_idx, col_idx

# this should be iterative instead of recursive
def scan_map(char_map, point=None, direction=None, path=[]):
    if not point:
        point = start_point(char_map)

    char = char_map[point[0]][point[1]]

    if char in directions:
        if point in path:
            return path
        path.append(point)
        direction = char

    new_point = neighbor(point, direction)
    return scan_map(char_map, new_point, direction, path)

def format_path(path):
    return [{'x': point[1], 'y': point[0]} for point in path]

# TODO: take arguments
if __name__ == '__main__':
    with open('/Users/scott/Desktop/coredump/dungeon.txt') as f:
        content = [line.rstrip() for line in f.readlines()]

    path = scan_map(content)
    print json.dumps(format_path(path))

    # write out points to json file

