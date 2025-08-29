#!/bin/bash

# Thumbnail Creation Script for Prismatic Collections
# Creates optimized thumbnails from cover images

# Default settings
DEFAULT_SIZE="300x300"
DEFAULT_QUALITY_JPG="85"
DEFAULT_QUALITY_WEBP="80"

# Function to display usage
usage() {
    echo "Usage: $0 <input_file> [output_directory] [size] [quality_jpg] [quality_webp]"
    echo ""
    echo "Arguments:"
    echo "  input_file       - Path to the source image"
    echo "  output_directory - Directory to save thumbnails (default: src/assets/images/thumbnails/)"
    echo "  size            - Thumbnail size (default: ${DEFAULT_SIZE})"
    echo "  quality_jpg     - JPG quality 1-100 (default: ${DEFAULT_QUALITY_JPG})"
    echo "  quality_webp    - WebP quality 1-100 (default: ${DEFAULT_QUALITY_WEBP})"
    echo ""
    echo "Example:"
    echo "  $0 src/assets/graphic/phantasia_1_cover_final.png"
    echo "  $0 cover.png thumbnails/ 400x400 90 85"
}

# Check if input file is provided
if [ $# -lt 1 ]; then
    echo "Error: Input file is required"
    usage
    exit 1
fi

# Set variables
INPUT_FILE="$1"
OUTPUT_DIR="${2:-src/assets/images/thumbnails/}"
SIZE="${3:-$DEFAULT_SIZE}"
QUALITY_JPG="${4:-$DEFAULT_QUALITY_JPG}"
QUALITY_WEBP="${5:-$DEFAULT_QUALITY_WEBP}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Extract filename without extension
FILENAME=$(basename "$INPUT_FILE")
NAME="${FILENAME%.*}"

# Output file paths
OUTPUT_JPG="${OUTPUT_DIR}/${NAME}_thumbnail.jpg"
OUTPUT_WEBP="${OUTPUT_DIR}/${NAME}_thumbnail.webp"

echo "Creating thumbnails from: $INPUT_FILE"
echo "Output directory: $OUTPUT_DIR"
echo "Size: $SIZE"
echo "JPG Quality: $QUALITY_JPG, WebP Quality: $QUALITY_WEBP"
echo ""

# Create JPG thumbnail
echo "Creating JPG thumbnail..."
if convert "$INPUT_FILE" \
    -resize "${SIZE}^" \
    -gravity center \
    -extent "$SIZE" \
    -quality "$QUALITY_JPG" \
    -strip \
    "$OUTPUT_JPG"; then
    JPG_SIZE=$(du -h "$OUTPUT_JPG" | cut -f1)
    echo "✓ JPG thumbnail created: $OUTPUT_JPG ($JPG_SIZE)"
else
    echo "✗ Failed to create JPG thumbnail"
    exit 1
fi

# Create WebP thumbnail
echo "Creating WebP thumbnail..."
if convert "$INPUT_FILE" \
    -resize "${SIZE}^" \
    -gravity center \
    -extent "$SIZE" \
    -quality "$QUALITY_WEBP" \
    -strip \
    "$OUTPUT_WEBP"; then
    WEBP_SIZE=$(du -h "$OUTPUT_WEBP" | cut -f1)
    echo "✓ WebP thumbnail created: $OUTPUT_WEBP ($WEBP_SIZE)"
else
    echo "✗ Failed to create WebP thumbnail"
    exit 1
fi

# Show original file size for comparison
ORIGINAL_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
echo ""
echo "Size comparison:"
echo "  Original: $ORIGINAL_SIZE"
echo "  JPG:      $JPG_SIZE"
echo "  WebP:     $WEBP_SIZE"

echo ""
echo "Thumbnails created successfully!"