// Allow importing CSS/SCSS modules in TypeScript files
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Allow importing plain CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Third-party modules without type declarations
declare module 'shallowequal';
declare module 'classnames/dedupe';
