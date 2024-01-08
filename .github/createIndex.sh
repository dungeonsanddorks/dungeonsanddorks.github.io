#!/bin/bash

cd ./blog/post-data

dir="/posts"
for f in "$dir"/*; do
  echo "$f"
done

echo "" > "index.json"