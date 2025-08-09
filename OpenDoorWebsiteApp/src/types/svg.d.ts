// Type declarations for SVG modules
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
