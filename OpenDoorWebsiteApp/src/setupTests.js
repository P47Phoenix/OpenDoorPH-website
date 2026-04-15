// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver, but hooks/useScrollDepth.ts
// (Story 2.4) constructs one on mount. Provide a minimal no-op polyfill so
// components that call `new IntersectionObserver(...)` during `render()`
// do not throw a ReferenceError.
if (typeof global.IntersectionObserver === 'undefined') {
  class IntersectionObserverPolyfill {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  // eslint-disable-next-line no-undef
  global.IntersectionObserver = IntersectionObserverPolyfill;
  // Also expose on window for browser-style access.
  if (typeof window !== 'undefined') {
    window.IntersectionObserver = IntersectionObserverPolyfill;
  }
}
