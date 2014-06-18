#!/usr/bin/python

import argparse
import json
import os
import yaml

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

def scan_map(char_map):
    path = []
    point = start_point(char_map)
    direction = None

    while True:
        char = char_map[point[0]][point[1]]

        if char in directions:
            if point in path:
                return path
            path.append(point)
            direction = char

        point = neighbor(point, direction)
        
def format_path(path):
    return [{'x': point[1], 'y': point[0]} for point in path]

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('map_file', type=str)
    args = parser.parse_args()
    current_dir = os.path.dirname(os.path.realpath(__file__))

    with open(os.path.join(current_dir, args.map_file)) as f:
        data = yaml.load(f)

    for d in data['regions']:
        path = scan_map(d['path'].splitlines())
        d['path'] = format_path(path)

    print json.dumps(data)
