declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}

declare module "@docs-variant" {
  import type { Theme } from "vitepress";
  const theme: Theme;
  export default theme;
}
