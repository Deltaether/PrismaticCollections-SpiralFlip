# Project Phantasia Style Guide

## Overview

This style guide documents the CSS/SCSS structure of the Project Phantasia application to help maintain consistent styles and prevent conflicts.

## Style Organization

The styles in this project are organized as follows:

1. **Global Styles**: In `/src/styles.scss`
2. **Shared Styles**: In `/src/app/shared/styles/`
3. **Component-Specific Styles**: In each component's `.scss` file
4. **Theme Styles**: In `/src/app/styles/themes/`

## Header Styling

Header components have been a source of style conflicts. We've centralized header styles with these guidelines:

- **Height Consistency**:
  - Main Layout Header: 82px (updated from 70px)
  - Site Header: 90px
  
- **Z-Index Strategy**:
  - Main Layout Header: 890
  - Site Header: 900
  - Loader/Modals: 99999

- **Class-based Namespacing**:
  - Use `.main-header-styles` for main layout header
  - Use `.site-header-styles` for site header

## Preventing Style Conflicts

To prevent style conflicts, follow these guidelines:

1. **Avoid Element Selectors**: Prefer class selectors over element selectors
   ```scss
   // Avoid
   app-main-layout { ... }
   
   // Better
   .main-layout { ... }
   ```

2. **Use Namespacing**: Apply parent classes to contain styles
   ```scss
   .collections-page {
     .header { ... }
   }
   ```

3. **Prefer Specificity over !important**: Use specific selectors rather than !important flags
   ```scss
   // Avoid
   .button { color: red !important; }
   
   // Better
   .section .panel .button { color: red; }
   ```

4. **Use ViewEncapsulation**: For component-specific styles, use Angular's ViewEncapsulation

## Angular Template Best Practices

1. **Special Characters**: Always use HTML entities for special characters in Angular templates:
   - Use `&#64;` instead of `@` to avoid template parsing errors
   - Use `&#123;` and `&#125;` instead of `{` and `}` when needed outside of bindings
   - Example: `<a href="mailto:info&#64;example.com">info&#64;example.com</a>`

2. **RouterOutlet**: Import only RouterModule for routing functionality, which includes the router-outlet directive. Avoid importing RouterOutlet directly unless it's being referenced in your component code.

## Collection Pages

Collections pages have these special considerations:

1. Add the class `collections-page` to the body when in collection pages
2. Use the `phantasia-collection-page` class for Phantasia-specific styling
3. Import header styles from the central location

## Important Variables

Key variables are defined in the shared header styles:

```scss
$header-height-main: 82px; // Main layout height
$header-height-site: 90px; // Site header height
$header-z-index: 900; // Z-index for headers
```

## Additional Components

For components that need margin/padding adjustments, use these utility classes:

- `.no-top-margin`: Removes top margin
- `.no-top-padding`: Removes top padding
- `.header-spacer`: Adds space for the main header (82px)
- `.header-spacer-large`: Adds space for the site header (90px)

## Recent Style Fixes

1. Consolidated header heights and z-indices
2. Created shared header styles
3. Added class-based targeting for better specificity
4. Improved selectors to prevent style bleeding
5. Reduced the use of !important flags
6. Added proper namespacing for collections pages

## Notes for Next Dev

When adding new styles:

1. Check if a shared style already exists before creating new ones
2. Use class-based selectors rather than element selectors
3. Keep component styles encapsulated where possible
4. Import shared variables rather than redefining them 