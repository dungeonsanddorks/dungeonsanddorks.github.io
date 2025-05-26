#!/bin/bash

# Main Blog Index
rm ./blog/post-data/index.json

echo "{" >> ./blog/post-data/index.json;

for f in ./blog/post-data/posts/*; do [[ -f "$f" ]] && echo "\"${f##./}\": true
," | sed 's/blog\/post-data\/posts\/post-//' | sed 's/.json//' >> ./blog/post-data/index.json; done

sed -i '$d' ./blog/post-data/index.json
echo "}" >> ./blog/post-data/index.json;

# Archive Index
rm ./archive/blog/post-data/index.json

echo "{" >> ./archive/blog/post-data/index.json;

for f in ./archive/blog/post-data/posts/*; do [[ -f "$f" ]] && echo "\"${f##./}\": true
," | sed 's/archive\/blog\/post-data\/posts\/post-//' | sed 's/.json//' >> ./archive/blog/post-data/index.json; done

sed -i '$d' ./archive/blog/post-data/index.json
echo "}" >> ./archive/blog/post-data/index.json;