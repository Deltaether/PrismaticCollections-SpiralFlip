# Prismatic Collections Theme System

A comprehensive Angular Material-inspired theming system that provides consistent design patterns, color management, and reusable components for the Prismatic Collections application.

## 🎨 Overview

This theme system provides:
- **Material Design 3** inspired color palettes with tonal variations
- **CSS Custom Properties** for runtime theme switching
- **SCSS Mixins** for consistent component styling
- **Unified Variables** to eliminate duplication
- **Responsive Design** utilities
- **Accessibility** features built-in
- **Dark/Light Theme** support

## 📁 File Structure

```
src/app/styles/themes/
├── _material-theme.scss      # Core theme engine with palettes and CSS custom properties
├── _unified-variables.scss   # Single source of truth for all theme variables  
├── _theme-mixins.scss        # Reusable styling patterns and utilities
├── _variables.scss           # Legacy compatibility layer (deprecated)
└── README.md                 # This documentation
```

## 🚀 Quick Start

### 1. Import the Theme System

In any component SCSS file:

```scss
// Import all theme utilities
@use '../../styles/themes/unified-variables' as vars;
@use '../../styles/themes/theme-mixins' as mixins;

// For advanced usage, also import the theme engine
@use '../../styles/themes/material-theme' as theme;
```

### 2. Use Theme Variables

Instead of hardcoding colors:

```scss
// ❌ Old way (hardcoded)
.button {
  background: #ff6b6b;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
}

// ✅ New way (theme variables)
.button {
  background: vars.$primary-color;
  color: vars.$text-light;
  padding: vars.$spacing-md vars.$spacing-lg;
  border-radius: vars.$border-radius-md;
}
```

### 3. Use Theme Mixins

For common patterns:

```scss
.my-card {
  @include mixins.glassmorphic-card();  // Applies glassmorphism styling
  @include mixins.interactive-card();   // Adds hover effects
}

.my-button {
  @include mixins.button-primary();     // Full button styling with theme colors
}

.responsive-grid {
  @include mixins.responsive-grid(300px, vars.$spacing-lg);
}
```

## 🎨 Color System

### Primary Colors

```scss
$primary-color: #ff6b6b;        // Signature coral
$primary-light: #ff8080;        
$primary-dark: #ff5252;         
$primary-gradient: linear-gradient(135deg, #ff6b6b, #ff5252);
```

### Secondary Colors

```scss
$secondary-color: #4a9eff;      // Blue
$accent-teal: #20b2aa;          // Teal accent
$accent-cyan: #00ced1;          // Cyan accent
```

### Semantic Colors

```scss
$success-color: #10b981;        // Green
$warning-color: #f59e0b;        // Amber  
$error-color: #ef4444;          // Red
$info-color: #3b82f6;           // Blue
```

### Dark Theme Colors

```scss
$dark-bg-primary: #0a0a0f;      // Deep space black
$dark-bg-secondary: #0f1419;     // Midnight blue-black
$dark-bg-card: rgba(30, 44, 54, 0.45);  // Glassmorphic card
```

### Usage with CSS Custom Properties

All colors are also available as CSS custom properties:

```scss
.element {
  background: var(--theme-primary-500);
  color: var(--theme-foreground-text);
  border: 1px solid var(--theme-foreground-divider);
}
```

## 🧩 Common Mixins

### Layout Mixins

```scss
// Full-screen container
@include mixins.full-screen-container();

// Flex centering
@include mixins.flex-center(column);  // or 'row'

// Responsive grid
@include mixins.responsive-grid(280px, vars.$spacing-lg);
```

### Background Mixins

```scss
// Signature dark gradient (from home page)
@include mixins.dark-gradient-background();

// Glassmorphism effects
@include mixins.glassmorphism(15px, 0.08);
@include mixins.dark-glassmorphism(20px);
```

### Component Mixins

```scss
// Buttons
@include mixins.button-primary();
@include mixins.button-secondary();
@include mixins.button-ghost();

// Cards
@include mixins.glassmorphic-card();
@include mixins.dark-card($glassmorphic: true);
@include mixins.interactive-card();

// Forms
@include mixins.input-field();
@include mixins.form-group();
```

### Typography Mixins

```scss
// Headings
@include mixins.heading(xl, bold);     // size, weight

// Body text
@include mixins.body-text(md, secondary);  // size, variant

// Links
@include mixins.link(vars.$primary-color);
```

### Animation Mixins

```scss
// Entrance animations
@include mixins.fade-in(0.3s, 0.1s);      // duration, delay
@include mixins.slide-up(20px, 0.3s);     // distance, duration
@include mixins.scale-in(0.9, 0.3s);      // scale, duration

// Loading states
@include mixins.pulse();
```

### Utility Mixins

```scss
// Text truncation
@include mixins.truncate-text(3);  // number of lines

// Aspect ratio
@include mixins.aspect-ratio(16/9);

// Custom scrollbar
@include mixins.custom-scrollbar(8px, transparent, rgba(255,255,255,0.3));

// Accessibility
@include mixins.visually-hidden();
@include mixins.focus-ring(vars.$primary-color);
```

### Responsive Mixins

```scss
@include mixins.responsive(md) {
  // Styles for medium screens and up
}

@include mixins.responsive(lg) {  
  // Styles for large screens and up
}

@include mixins.retina() {
  // High DPI optimizations
}
```

## 📐 Spacing System

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;      // Base unit
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-xxl: 48px;
$spacing-xxxl: 64px;
```

### Usage

```scss
.element {
  // Use spacing mixin
  @include mixins.spacing(all, lg);        // padding: 24px
  @include mixins.spacing(vertical, md);   // padding-top/bottom: 16px
  @include mixins.spacing(horizontal, sm); // padding-left/right: 8px
  
  // Or use variables directly
  margin-bottom: vars.$spacing-xl;
}
```

## 🔤 Typography System

### Font Sizes

```scss
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-md: 1rem;       // 16px (base)
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-xxl: 1.5rem;    // 24px
$font-size-xxxl: 2rem;     // 32px
$font-size-display: 3rem;  // 48px
```

### Font Weights

```scss
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 🎭 Theme Switching

The system supports runtime theme switching using CSS custom properties:

### HTML Structure

```html
<body class="theme-dark">  <!-- Default -->
  <!-- or -->
<body class="theme-light"> <!-- Light theme -->
</body>
```

### TypeScript Theme Switching

```typescript
export class ThemeService {
  private currentTheme = 'dark';
  
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = `theme-${this.currentTheme}`;
  }
}
```

### CSS Custom Properties Usage

```scss
.dynamic-element {
  background: var(--theme-background-card);
  color: var(--theme-foreground-text);
  border: 1px solid var(--theme-foreground-divider);
  
  // Automatic theme switching - no JavaScript needed!
}
```

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-xxl: 1400px;
```

### Usage

```scss
.responsive-element {
  @include mixins.responsive(sm) {
    // Small screens and up
    font-size: vars.$font-size-lg;
  }
  
  @include mixins.responsive(lg) {
    // Large screens and up
    font-size: vars.$font-size-xl;
  }
}
```

## ♿ Accessibility Features

### Built-in Accessibility

```scss
// Focus indicators
.button {
  @include mixins.focus-ring(vars.$primary-color);
}

// Screen reader content
.sr-only-content {
  @include mixins.visually-hidden();
}

// Minimum touch targets (44px)
.button {
  @include mixins.button-base(); // Includes min-height: 44px
}
```

### Color Contrast

All theme colors are designed to meet WCAG AA contrast requirements:

```scss
// High contrast text colors
color: vars.$text-light;           // White on dark backgrounds
color: vars.$text-dark;            // Dark text on light backgrounds
color: vars.$text-light-secondary; // Lower opacity for secondary text
```

## 🔄 Migration Guide

### From Old System to New

1. **Replace hardcoded colors:**
   ```scss
   // Before
   background: #ff6b6b;
   
   // After  
   background: vars.$primary-color;
   ```

2. **Replace local variables:**
   ```scss
   // Before
   $my-color: #4a9eff;
   
   // After
   @use '../../styles/themes/unified-variables' as vars;
   // Use vars.$secondary-color instead
   ```

3. **Use mixins for common patterns:**
   ```scss
   // Before
   .card {
     background: rgba(30, 44, 54, 0.45);
     backdrop-filter: blur(15px);
     border-radius: 16px;
     padding: 24px;
     // ... many lines of code
   }
   
   // After
   .card {
     @include mixins.glassmorphic-card();
   }
   ```

## 🎯 Best Practices

### 1. Always Use Theme Variables

```scss
// ❌ Avoid hardcoded values
.element {
  color: #ffffff;
  padding: 16px;
  background: #ff6b6b;
}

// ✅ Use theme variables
.element {
  color: vars.$text-light;
  padding: vars.$spacing-md;
  background: vars.$primary-color;
}
```

### 2. Prefer Mixins for Complex Patterns

```scss
// ❌ Repetitive code
.card1, .card2, .card3 {
  background: rgba(30, 44, 54, 0.45);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  padding: 24px;
}

// ✅ Use mixins
.card1, .card2, .card3 {
  @include mixins.dark-glassmorphism();
  @include mixins.spacing(all, lg);
  border-radius: vars.$border-radius-lg;
}
```

### 3. Use Semantic Color Names

```scss
// ❌ Color-based naming
.success-button {
  background: vars.$green-500;  // Avoid
}

// ✅ Semantic naming
.success-button {
  background: vars.$success-color;  // Better
}
```

### 4. Leverage CSS Custom Properties

```scss
// ✅ Theme-aware components
.theme-aware-element {
  background: var(--theme-background-card);
  color: var(--theme-foreground-text);
  // Automatically switches with theme changes
}
```

### 5. Use Responsive Mixins

```scss
// ✅ Mobile-first responsive design
.responsive-grid {
  @include mixins.responsive-grid(280px); // Mobile
  
  @include mixins.responsive(md) {
    @include mixins.responsive-grid(320px); // Tablet
  }
  
  @include mixins.responsive(lg) {
    @include mixins.responsive-grid(350px); // Desktop
  }
}
```

## 🔍 Debugging

### Inspector Tools

1. **CSS Custom Properties:** In browser dev tools, check the `:root` element to see all available custom properties
2. **Theme Variables:** Use `:export` feature to access variables in TypeScript
3. **Mixin Output:** Check compiled CSS to verify mixin output

### Common Issues

1. **Import Order:** Always import theme files before other SCSS files
2. **Variable Scope:** Use `@use` instead of `@import` for proper scoping
3. **CSS Custom Properties:** Remember they cascade and can be overridden

## 📈 Performance Considerations

### Optimizations Included

1. **CSS Custom Properties:** Runtime theme switching without JavaScript
2. **Tree Shaking:** Only imported mixins are included in final CSS
3. **Efficient Selectors:** Mixins generate optimized CSS selectors
4. **Reduced Bundle Size:** Eliminates duplicate styles across components

### Bundle Analysis

```bash
# Analyze CSS bundle size
npm run build -- --analyze

# Check unused styles
npm install -g purifycss
purifycss dist/styles.css dist/index.html --info
```

## 🧪 Testing

### Visual Testing

```scss
// Test all theme variations
.theme-test {
  .theme-dark & {
    // Dark theme specific tests
  }
  
  .theme-light & {
    // Light theme specific tests
  }
}
```

### Accessibility Testing

- Use browser dev tools Accessibility tab
- Test with screen readers
- Verify color contrast ratios
- Check keyboard navigation

## 🎉 Examples

See the following files for complete examples:

- `/src/app/pages/home/home-refactored-example.scss` - Full component refactor example
- `/src/app/styles/themes/_theme-mixins.scss` - All available mixins
- `/src/app/styles/themes/_unified-variables.scss` - All theme variables

## 🤝 Contributing

When adding new theme features:

1. Add variables to `_unified-variables.scss`
2. Create mixins in `_theme-mixins.scss`
3. Update CSS custom properties in `_material-theme.scss`
4. Document usage examples
5. Test in both light and dark themes

---

**Happy Theming! 🎨**