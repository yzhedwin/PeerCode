#!/bin/bash

# Find all subdirectories in frontend_testing
for folder in */; do
    cd "$folder" || continue
    
    # Run pytest for each file in the subfolder
    for file in *; do
        pytest "$file"
    done
    
    cd ..  # Move back to frontend_testing directory
done
