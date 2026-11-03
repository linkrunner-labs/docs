import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./custom.css";
import { buildSidebar } from "./sidebar";

import Note from "./components/Note.vue";
import Tip from "./components/Tip.vue";
import Warning from "./components/Warning.vue";
import Info from "./components/Info.vue";
import Card from "./components/Card.vue";
import CardGroup from "./components/CardGroup.vue";
import Steps from "./components/Steps.vue";
import Step from "./components/Step.vue";
import Tabs from "./components/Tabs.vue";
import Tab from "./components/Tab.vue";
import Accordion from "./components/Accordion.vue";
import AccordionGroup from "./components/AccordionGroup.vue";
import Frame from "./components/Frame.vue";
import Icon from "./components/Icon.vue";

const components = {
  Note,
  Tip,
  Warning,
  Info,
  Card,
  CardGroup,
  Steps,
  Step,
  Tabs,
  Tab,
  Accordion,
  AccordionGroup,
  Frame,
  Icon,
};

export default {
  extends: DefaultTheme,
  enhanceApp({ app, siteData }) {
    // Runs before the first render (client and SSR build).
    siteData.value.themeConfig.sidebar = buildSidebar();
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
} satisfies Theme;
