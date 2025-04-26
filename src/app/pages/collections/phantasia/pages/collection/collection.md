# Collections Page Documentation

This file contains information about the Collections page component and its related files.

## Files in this Folder

- `collection.component.ts` - Main component logic
- `collection.component.html` - Template for the collections page
- `collection.component.scss` - Main styles for the collections page
- `collection-scrollable.scss` - Styles for scrollable elements
- `collection-header-global.scss` - Global header styles
- `collection-header-fix.ts` - Utility to fix header styling issues

## Related Imports

```
// Component Dependencies
import { Component, ChangeDetectionStrategy, ElementRef, ViewChildren, 
         QueryList, AfterViewInit, OnDestroy, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollHelperService } from '../../../../../shared/services/scroll-helper.service';
import { CollectionHeaderFix } from './collection-header-fix';
```

## Component Description

The Collections page displays music collections available in the Prismatic platform. It features:

- Dark-themed UI with card-based collection items
- Fixed navigation bar with Home, Collections, and About links
- Collection cards with cover images, metadata, and action buttons
- Smooth scrolling and scroll position tracking
- Responsive design for various screen sizes

## Implementation Notes

【✓】 **Active Methods:**
- `ngOnInit()` - Initializes the component and applies header styles
- `updateScrollProgress()` - Updates scroll progress indicator
- `toggleScrollToTopButton()` - Shows/hides scroll to top button based on scroll position
- `scrollToTop()` - Scrolls to top of the page
- `ngAfterViewInit()` - Initializes scroll animations
- `navigateToCollection()` - Navigates to a specific collection
- `filterByCategory()` - Filters collections by category
- `getCollectionTags()` - Parses collection genre string into tags
- `scrollToCollection()` - Scrolls to a specific collection in the list
- `setActiveCollection()` - Sets active collection

【✗】 **Inactive Methods:**
- `sortCollections()` - Sort collections by selected option (to be implemented)

## UI Elements

The page displays collection cards with:
- Album cover image on the left
- Collection details on the right (title, description, year, number of tracks)
- Genre tags (Orchestral, Electronic, Ambient, etc.)
- "Explore Collection" button

## Styling Specifications

- Dark background (#1a1a1a to #2a2a2a gradient)
- Card background: #212529
- Primary color: #7b68ee
- Text color: #e9ecef
- Card border-radius: 8px

## Future Improvements

- Implement sorting functionality
- Add filtering by tags/genres
- Add pagination for large collections
- Enhance mobile responsiveness 