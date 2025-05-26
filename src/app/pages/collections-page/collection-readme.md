# Collections Page Documentation

## Overview
This folder contains the components and styles for the Collections page of Project Phantasia. The page displays music collections in a modern, grid-based layout with a white/light color scheme. Each collection card features an image, metadata, description, tags, and an explore button.

## Key Files

### Components
- `new-collections.component.ts` - Main component class for the collections page
- `new-collections.component.html` - HTML template for the collections page layout
- `new-collections.component.scss` - Styling for the collections page with light theme

### Assets
- `assets/logo/phantasia-logo-light.png` - Light version of the Phantasia logo for the header
- `assets/graphic/phantasia_1_cover_final.png` - Cover image for Project Phantasia collection
- `assets/collections/ethereal-soundscapes.jpg` - Cover image for Ethereal Soundscapes collection
- `assets/collections/digital-artifacts.jpg` - Cover image for Digital Artifacts collection

### Related Files
- `/src/app/shared/services/scroll-helper.service.ts` - Service used for scroll animations
- `/src/app/shared/components/collection-card/collection-card.component.ts` - Reusable collection card component (if extracted)

## Component Structure

```
collections-page
├── phantasia-header
│   ├── logo
│   └── nav-links
├── debug-info (hidden in production)
├── decorative-elements
└── collections-container
    ├── collection-header
    │   ├── h1 (title)
    │   └── subtitle
    └── collection-list
        └── collection-card (multiple)
            ├── collection-image
            ├── collection-content
            │   ├── h2 (title)
            │   ├── metadata (tracks, year)
            │   ├── description
            │   ├── tags
            │   └── explore-button
```

## Styling Notes
- **Color Scheme**: Light/white theme with purple accent color (#5d4fff)
- **Typography**: Inter font family with clean, readable text hierarchy
- **Card Design**: Subtle shadows, hover effects, and smooth transitions
- **Responsive**: Grid layout adjusts from 3 columns to single column on mobile devices

## Usage

### Adding New Collections
To add a new collection card, copy the structure of existing cards:

```html
<div class="collection-card">
  <div class="collection-image">
    <img src="assets/collections/your-collection.jpg" alt="Collection Name Cover">
  </div>
  <div class="collection-content">
    <h2>Collection Name</h2>
    <div class="metadata">
      <span class="tracks">X Tracks</span>
      <span class="year">20XX</span>
    </div>
    <p class="description">
      Description of your collection...
    </p>
    <div class="tags">
      <span class="tag">Tag1</span>
      <span class="tag">Tag2</span>
    </div>
    <button class="explore-button">
      Explore <i class="fa fa-arrow-right"></i>
    </button>
  </div>
</div>
```

### Navigation
The header navigation uses hash-based routing (#home, #collections, etc.) for smooth scroll behavior within the page. Update these links if integrating with Angular Router.

## Future Improvements
- Extract collection card into a reusable component
- Add sorting and filtering options
- Implement actual routing for collection detail pages
- Add animations for card entrance and transitions
- Implement lazy loading for collection images

## Notes for Developers
- 【✓】 The styling prioritizes a clean, modern aesthetic with subtle decorative elements
- 【✓】 Custom comments with our syntax (【✓】) mark active methods in the SCSS
- 【✓】 All new functionality should match the established design language
- 【✓】 The light theme is a departure from the previous dark theme - keep this consistent
- 【✗】 Card grid layout replaced the previous list view with horizontal cards 