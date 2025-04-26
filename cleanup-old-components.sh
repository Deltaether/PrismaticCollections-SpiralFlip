#!/bin/bash

# 【✓】 Script to clean up old component folders
# This script removes the _old folders created during components reorganization

# Set up colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define paths and backup directory
TARGET_DIR="src/app/pages/collections/phantasia/pages"
BACKUP_DIR="script_backup"

# Create backup folder with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FOLDER="${BACKUP_DIR}/old_components_backup_${TIMESTAMP}"
mkdir -p "$BACKUP_FOLDER"

echo -e "${BLUE}=== Cleaning up old component folders (_old) ===${NC}"
echo -e "${YELLOW}Creating backup of old components...${NC}"

# Find all *_old folders in the target directory
OLD_FOLDERS=$(find "${TARGET_DIR}" -name "*_old" -type d)

# Backup and remove old folders
if [ -z "$OLD_FOLDERS" ]; then
  echo -e "${YELLOW}No old component folders found.${NC}"
else
  echo -e "${YELLOW}Found old component folders to clean up:${NC}"
  
  for folder in $OLD_FOLDERS; do
    folder_name=$(basename "$folder")
    echo -e "  - Processing: ${folder_name}"
    
    # Create backup
    echo -e "    - Backing up ${folder}..."
    cp -r "${folder}" "${BACKUP_FOLDER}/"
    
    # Remove old folder
    echo -e "    - Removing ${folder}..."
    rm -rf "${folder}"
    
    echo -e "    ${GREEN}- Folder cleaned up successfully!${NC}"
  done
fi

echo -e "\n${GREEN}=== Cleanup complete! ===${NC}"
echo -e "${BLUE}Backup saved to: ${BACKUP_FOLDER}${NC}" 