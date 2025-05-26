# SASS Configuration Documentation

This document explains the SASS configuration for the collections module.

## Handling SASS Deprecation Warnings

In this project, we've addressed SASS deprecation warnings related to the legacy JS API which will be removed in Dart Sass 3.0.0.

### Implementation Details

【✓】 **Configuration Files:**
- Created `src/sass-options.scss` to silence legacy API deprecation warnings
- Imported this file in the main `styles.scss` 
- Imported in component-specific SCSS files as needed

【✓】 **Changes Made:**
- Replaced deprecated `darken()` function with `color.adjust()` 
- Set `$silenceDeprecations: ['legacy-js-api']` globally in sass-options.scss
- Added explicit `@use 'sass:color'` imports where color manipulation is needed

### Silencing Deprecation Warnings

The proper way to silence SASS deprecation warnings is:

```scss
// In sass-options.scss
@use "sass:meta";

// Define variables at stylesheet root as recommended
$sass-major-version: 0 !default;
$silenceDeprecations: null;

// Set silenceDeprecations to include legacy-js-api
@if meta.variable-exists(sass-major-version) {
  $silenceDeprecations: ['legacy-js-api'] !global;
}
```

This approach:
1. Uses namespaced `meta.variable-exists()` instead of the deprecated global function
2. Declares variables at the stylesheet root before using them with `!global`
3. Properly sets up the silencing of legacy-js-api deprecation warnings

### References

- [SASS Documentation: Legacy JS API](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)
- [GitHub Issue: Next.js SASS Deprecation Warnings](https://github.com/vercel/next.js/issues/71638)

## SASS Best Practices

【✓】 **Recommended Usage:**
- Always use namespaced functions (e.g., `color.adjust()` instead of `darken()`)
- Import necessary modules explicitly with `@use` instead of `@import` 
- Organize variables and mixins in a structured way
- Use color manipulation functions from the color module
- Define variables at the stylesheet root before using them with `!global`

【✗】 **Avoid:**
- Using global color functions without proper namespaces 
- Using the legacy JS API of SASS
- Mixing different SASS syntax styles
- Trying to configure built-in modules with the "with" syntax
- Using global built-in functions like `variable-exists()` (use `meta.variable-exists()` instead)

## Example Usage

```scss
// Correct usage
@use 'sass:color';
@use 'sass:meta';

.example {
  // Use color.adjust() instead of darken()
  background-color: color.adjust($primary-color, $lightness: -10%);
  
  // Use color.scale() as an alternative
  border-color: color.scale($accent-color, $lightness: -20%);
}
``` 