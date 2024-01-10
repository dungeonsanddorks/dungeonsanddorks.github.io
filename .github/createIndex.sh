#!/bin/bash

rm ./blog/post-data/index.json

echo "{" >> ./blog/post-data/index.json;

for f in ./blog/post-data/posts/*; do [[ -f "$f" ]] && echo "\"${f##./}\": true
," | sed 's/blog\/post-data\/posts\/post-//' | sed 's/.json//' >> ./blog/post-data/index.json; done

sed -i '$d' ./blog/post-data/index.json
echo "}" >> ./blog/post-data/index.json;

