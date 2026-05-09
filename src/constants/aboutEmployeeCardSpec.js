/**
 * Employee grid card image rules — keep in sync with
 * `src/pages/AboutPage/TeamGrid.css` (.employees-grid, .employee-image).
 */
export const ABOUT_EMPLOYEE_CARD_SPEC = {
  gridMinColPx: 180,
  /** Default/desktop `.employee-image` height */
  photoHeightDefaultPx: 180,
  /** `.employee-image` heights at breakpoints (viewport max-width) */
  photoHeightsByBreakpoint: [
    { maxWidthPx: 1400, heightPx: 160 },
    { maxWidthPx: 1024, heightPx: 150 },
    { maxWidthPx: 768, heightPx: 135 },
    { maxWidthPx: 480, heightPx: 115 }
  ],
  /** Matches CSS `background-size` on `.employee-image` */
  fitMode: 'contain'
}
