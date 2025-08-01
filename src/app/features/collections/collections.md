# Collections Component Documentation

## Component Overview

The Collections component displays all music collections in a card-based layout. It's integrated with the main application routing system and uses the `SiteHeaderComponent` through the parent layout.

## Key Files

- **new-collections.component.ts**: Main component class with collection data and viewport handling
- **new-collections.component.html**: Template with cards and layout structure
- **new-collections.component.scss**: Styling specifically for collections view
- **style-override.directive.ts**: Custom directive for style overrides

## Important Imports

```typescript
// Component imports from Angular core
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// Project-specific imports
import { ScrollHelperService } from '../../../../../shared/services/scroll-helper.service';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';
```

## Recent Fixes

- Removed duplicate `<app-site-header>` from the template as it should come from the parent layout
- Added reference variables to HTML elements for proper style debugging
- Ensured SiteHeaderComponent is properly imported in the component
- Fixed ScrollHelperService import path to use correct relative path (../../../../../shared/services)
- Removed duplicate local ScrollHelperService file to avoid conflicts with the shared service
- Deleted legacy scss files (collection.component.scss and collection-scrollable.scss)
- Removed unused SiteHeaderComponent from the imports array in the component decorator
- Fixed SCSS warnings by removing duplicate styles and using color.adjust instead of the deprecated darken function
- Merged the debug-info styles from the duplicate styles section
- Set the main-header height to 82px (from 70px) to fix shadow/overlap issues with specific DOM path targeting

## Component Methods

- 【✓】 `ngOnInit()`: Initializes the component, sets title, applies styles
- 【✓】 `ngAfterViewInit()`: Logs computed styles and checks for style issues
- 【✓】 `logConflictingSelectors()`: Checks for CSS selector conflicts
- 【✓】 `checkStyleInheritance()`: Analyzes CSS inheritance issues
- 【✓】 `exploreCollection()`: Navigates to selected collection
- 【✓】 `isMobileView()`: Returns mobile view status
- 【✓】 `getCurrentRoute()`: Gets current router path
- 【✓】 `checkViewportSize()`: Updates isMobile flag based on viewport
- 【✓】 `initCardAnimations()`: Adds animations to collection cards

## Notes for Next Dev

1. The component uses ViewEncapsulation.None to ensure global styles can be applied
2. Style conflicts are handled through the StyleOverrideDirective
3. Debug info is included but hidden in production
4. Card animations are initialized after view init
5. Route navigation to individual collections works via the router
6. Always use the shared ScrollHelperService from the shared/services directory
7. Remember to maintain reference variables in HTML for debugging style issues
8. The SiteHeaderComponent is imported but not included in the imports array as it's in the parent layout
9. The main-header element height is set to 82px using specific DOM targeting to fix shadow/overlap issues

## Integration with Layout System

This component is designed to work within:
1. Main layout (via `/collections` route)
2. Phantasia layout (via `/phantasia/collections` route)

The RouterModule integration handles proper navigation between these views. 