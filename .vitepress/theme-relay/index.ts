import { defineComponent, h } from "vue";
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./tokens.css";
import "./relay.css";
import "./chrome-icons.css";
import Layout from "./Layout.vue";
import { buildRelaySidebar } from "./sidebar";

// Mintlify-style content components shared with the classic theme. Their
// styles live in each theme's CSS; the markup is the same. Two exceptions:
// callouts use Relay's icons and labels, and the Accordion adds the
// description line and linkable entries.
import RelayCallout from "./components/RelayCallout.vue";
import Card from "../theme/components/Card.vue";
import CardGroup from "../theme/components/CardGroup.vue";
import Steps from "../theme/components/Steps.vue";
import Step from "../theme/components/Step.vue";
import Tabs from "../theme/components/Tabs.vue";
import Tab from "../theme/components/Tab.vue";
import AccordionGroup from "../theme/components/AccordionGroup.vue";
import Frame from "../theme/components/Frame.vue";
import Icon from "./components/RelayIcon.vue";
import Accordion from "./components/RelayAccordion.vue";

// Relay-only page sections used by relay-pages/.
import OverviewHero from "./components/OverviewHero.vue";
import GuideCards from "./components/GuideCards.vue";
import LinkGrid from "./components/LinkGrid.vue";
import HelpBox from "./components/HelpBox.vue";
import SectionLabel from "./components/SectionLabel.vue";
import BeforeYouStart from "./components/BeforeYouStart.vue";

const callout = (type: "note" | "tip" | "warning" | "info") =>
  defineComponent({ setup: (_, { slots }) => () => h(RelayCallout, { type }, slots) });

const components = {
  Note: callout("note"),
  Tip: callout("tip"),
  Warning: callout("warning"),
  Info: callout("info"),
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
  OverviewHero,
  GuideCards,
  LinkGrid,
  HelpBox,
  SectionLabel,
  BeforeYouStart,
};

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, siteData }) {
    // Runs before the first render (client and SSR build).
    siteData.value.themeConfig.sidebar = buildRelaySidebar();
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
} satisfies Theme;
