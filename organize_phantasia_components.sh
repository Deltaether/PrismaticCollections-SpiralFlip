#!/bin/bash

# 【✓】 Script to organize Phantasia album components
# This script moves misplaced components to their proper location
# in the src/app/pages/collections/phantasia/pages directory

# Set up colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define paths
SOURCE_DIR="src/app/pages"
TARGET_DIR="src/app/pages/collections/phantasia/pages"
BACKUP_DIR="script_backup"

# Components to move (folders that should be in the Phantasia project)
COMPONENTS=(
  "pv"
  "disc-one"
  "disc-two"
  "information"
  "introduction"
)

echo -e "${BLUE}=== Organizing Phantasia Album Components ===${NC}"
echo -e "${YELLOW}Creating backup of components...${NC}"

# Create backup folder with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FOLDER="${BACKUP_DIR}/phantasia_backup_${TIMESTAMP}"
mkdir -p "$BACKUP_FOLDER"

# Function to check if the component already exists in the target directory
component_exists() {
  local component="$1"
  if [ -d "${TARGET_DIR}/${component}" ]; then
    return 0 # Directory exists
  else
    return 1 # Directory doesn't exist
  fi
}

# Backup and move components
for component in "${COMPONENTS[@]}"; do
  # Check if the component exists in the source directory
  if [ -d "${SOURCE_DIR}/${component}" ]; then
    echo -e "${YELLOW}Processing component: ${component}${NC}"
    
    # Create backup
    echo -e "  - Backing up ${SOURCE_DIR}/${component}..."
    cp -r "${SOURCE_DIR}/${component}" "${BACKUP_FOLDER}/"
    
    # Check if the component already exists in the target directory
    if component_exists "$component"; then
      echo -e "  ${RED}- Component already exists in target directory.${NC}"
      echo -e "  ${YELLOW}- Renaming existing component to avoid conflicts...${NC}"
      mv "${TARGET_DIR}/${component}" "${TARGET_DIR}/${component}_old"
    fi
    
    # Create target directory if it doesn't exist
    mkdir -p "${TARGET_DIR}"
    
    # Move component to target directory
    echo -e "  - Moving component to ${TARGET_DIR}/${component}..."
    mv "${SOURCE_DIR}/${component}" "${TARGET_DIR}/"
    
    echo -e "  ${GREEN}- Component moved successfully!${NC}"
  else
    echo -e "${RED}Component not found: ${SOURCE_DIR}/${component}${NC}"
  fi
done

echo -e "\n${GREEN}=== Component organization complete! ===${NC}"
echo -e "${BLUE}Backup saved to: ${BACKUP_FOLDER}${NC}"
echo -e "${YELLOW}Don't forget to update your imports and routes to reflect the new structure.${NC}" 