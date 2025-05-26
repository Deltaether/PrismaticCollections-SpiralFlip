# SCSS Updates Documentation

## Overview
This document contains information about the SCSS files in the collection folder and recent updates to fix Dart Sass compatibility issues.

## Key Files
- `collection.component.scss` - Main styling for collection components
- `collection-scrollable.scss` - Styles for the scrollable collection interface

## Recent Updates (SCSS Fixes)
- Fixed deprecated Sass functions:
  - Replaced `darken($primary-color, 10%)` with `color.adjust($primary-color, $lightness: -10%)`
  - Replaced `lighten($primary-color, 10%)` with `color.adjust($primary-color, $lightness: 10%)`
- Added missing variables:
  - `$accent-secondary: #2a9df4` - Used for gradients and accent elements
  - `$dark-bg: #111111` - Used for dark backgrounds in various components

## Variable Structure
### Core Colors
- `$background-color: #121212` - Main background
- `$text-color: #e9ecef` - Main text color
- `$primary-color: #5557f7` - Primary brand color
- `$secondary-color: #9d55f7` - Secondary brand color
- `$accent-color: #00ccff/#5557f7` - Accent highlights (varies by file)
- `$accent-secondary: #2a9df4` - Secondary accent for gradients
- `$dark-bg: #111111/#0c0c14` - Dark background elements (varies by file)

### UI Elements
- `$card-background: #1e1e2a/rgba(30, 30, 42, 0.95)` - Card backgrounds
- `$card-hover: #252535` - Card hover state
- `$light-text: #ffffff` - Light text elements

## Important Component Structure
- `.collection-row` - Main collection item container
- `.collection-track` - Left border indicator for collection items
- `.status-indicator` - Featured/status badge
- `.scroll-progress` - Progress indicator for scrolling
- `.collection-actions` - Action buttons container

## Notes for Developers
- When adding new color variations, ensure they are defined in both SCSS files if needed
- Use the `@use 'sass:color'` module for color manipulations instead of deprecated global functions
- For adding new gradients, follow the existing pattern: `background: linear-gradient(...)`
- Follow the comment structure with `【✓】` for active methods 