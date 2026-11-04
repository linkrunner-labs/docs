/**
 * Content changes that apply only to the Relay build (docs.v2.linkrunner.io).
 *
 * The .md pages are regenerated from the Mintlify repo (scripts/convert.ts) and
 * also feed docs.backup, so the Relay build doesn't edit them in place:
 * - RELAY_PAGES: pages in relay-pages/ that replace (or add) a route.
 * - RELAY_REMOVED: pages merged into another page, or hidden (the setup
 *   without an SDK, which we don't want customers to use); their URLs redirect.
 * - RELAY_REMOVED_TEXT: sentences that only point at hidden pages.
 * - PAGE_TITLES: plainer, sentence-case page titles and shorter sidebar labels.
 */

export const RELAY_PAGES = [
  "index.md",
  "quickstart.md",
  "features/remarketing.md",
  "features/remarketing-audiences.md",
  "features/skan-dashboard/overview.md",
  "ad-networks/overview.md",
];

/** Old URL -> where its content lives now. */
export const RELAY_REDIRECTS: Record<string, string> = {
  "/introduction": "/",
  "/features/remarketing-guide": "/features/remarketing",
  "/features/remarketing-campaigns": "/features/remarketing#run-the-campaign-on-meta",
  "/features/remarketing-audience-segments": "/features/remarketing-audiences",
  "/features/remarketing-audience-events": "/features/remarketing-audiences#create-an-audience-from-tracked-events",
  "/features/remarketing-audience-upload": "/features/remarketing-audiences#upload-a-customer-list",
  "/features/skan-dashboard/stats-cards": "/features/skan-dashboard/overview#stats-cards",
  "/features/skan-dashboard/privacy-tiers": "/features/skan-dashboard/overview#privacy-tiers",
  "/features/skan-dashboard/conversion-values": "/features/skan-dashboard/overview#conversion-values",
  "/features/skan-dashboard/trend-graph": "/features/skan-dashboard/overview#trend-graph",
  "/features/skan-dashboard/conversion-table": "/features/skan-dashboard/overview#conversion-table",
  // Setup without an SDK is hidden: customers should install an SDK.
  ...Object.fromEntries(
    [
      "introduction",
      "android-quickstart",
      "android-device-data",
      "android-minimal",
      "ios-quickstart",
      "ios-device-data",
      "ios-minimal",
      "api-reference",
    ].map((p) => [`/sdk-less/${p}`, "/quickstart"])
  ),
};

export const RELAY_REMOVED = Object.keys(RELAY_REDIRECTS).map((p) => p.slice(1) + ".md");

/**
 * Section links whose section has a different anchor here. Keyed by URL:
 * anchor -> anchor on the page that URL opens (after RELAY_REDIRECTS).
 * - Links shared from docs.linkrunner.io to pages the Relay build rewrote or
 *   merged. Every other old anchor is the same here (legacy-anchors.ts).
 * - Links in the Mintlify content to an anchor its page no longer has.
 * scripts/check-legacy-urls.ts fails the build if a link stops working;
 * theme-relay/legacy-hash.ts applies these on the page.
 */
export const RELAY_ANCHOR_ALIASES: Record<string, Record<string, string>> = {
  // Step headings lost their em dash (LIN-4588).
  "/features/subdomain-setup": {
    "step-1-\u2014-choose-a-subdomain": "step-1-choose-a-subdomain",
    "step-2-\u2014-add-a-cname-record": "step-2-add-a-cname-record",
    "step-3-\u2014-verification": "step-3-verification",
  },
  "/introduction": {
    "key-features": "growth-guides",
    "get-started": "start",
    sdks: "app-integration",
    mobile: "app-integration",
    hybrid: "app-integration",
    web: "app-integration",
    "ad-network-integrations": "growth-guides",
    "analytics-&-martech": "growth-guides",
    "build-with-the-api": "app-integration",
  },
  "/quickstart": {
    "1-create-a-project-&-get-your-token": "create-a-project",
    "2-install-the-sdk": "install-the-sdk",
    "3-initialize-the-sdk-required": "initialize-the-sdk",
    "4-identify-the-user-required": "identify-the-user",
    "5-handle-deep-links": "handle-deep-links",
    "6-verify-your-setup": "verify-your-setup",
    "what-to-build-next": "what-to-set-up-next",
  },
  "/features/remarketing": {
    "viewing-returning-users": "see-returning-users",
    "inactivity-window": "understanding-the-windows",
    "reattribution-window": "understanding-the-windows",
  },
  "/features/remarketing-campaigns": {
    meta: "run-the-campaign-on-meta",
    prerequisites: "meta-campaign-before-you-start",
    steps: "meta-campaign-steps",
    google: "run-the-campaign-on-google",
    "prerequisites-2": "google-campaign-before-you-start",
    "steps-2": "google-campaign-steps",
  },
  "/features/remarketing-audience-events": {
    meta: "events-meta",
    prerequisites: "events-meta-before-you-start",
    steps: "events-meta-steps",
    google: "events-google",
    "prerequisites-2": "events-google-before-you-start",
    "steps-2": "events-google-steps",
  },
  "/features/remarketing-audience-upload": {
    google: "upload-google",
    "1-prepare-your-data": "upload-prepare-your-data",
    "2-upload-to-google-ads": "upload-google",
    "navigate-to-audience-manager": "open-audience-manager",
    meta: "upload-meta",
    "1-prepare-your-data-2": "upload-prepare-your-data",
    "2-upload-to-meta-ads": "upload-meta",
    "navigate-to-the-audiences-dashboard": "open-the-audiences-dashboard",
  },
  "/features/skan-dashboard/privacy-tiers": {
    "how-apple-determines-your-privacy-tier": "how-apple-decides-your-privacy-tier",
    "what-data-you-receive-at-each-tier": "what-data-you-get-at-each-tier",
  },
  "/features/skan-dashboard/conversion-values": {
    "postback-1-p1--days-0-2": "postback-sequences",
    "postback-2-p2--days-3-7": "postback-sequences",
    "postback-3-p3--days-8-35": "postback-sequences",
    "coarse-conversion-values-low/medium/high": "coarse-conversion-values-low-medium-high",
    "switching-between-views": "switch-between-views",
    "setting-up-conversion-values": "set-up-conversion-values",
    "why-do-i-not-have-data-in-2nd-and-3rd-postback-filters": "why-do-i-not-have-data-in-the-2nd-and-3rd-postback-filters",
  },
  "/features/skan-dashboard/trend-graph": {
    "filtering-by-events": "filter-by-events",
    "understanding-event-filters": "what-an-event-filter-shows",
    "multiple-event-selection": "select-more-than-one-event",
    "special-filter-“install”-event": "special-filter-the-“install”-event",
    "removing-event-filters": "remove-event-filters",
  },
  "/features/skan-dashboard/conversion-table": {
    "table-structure": "columns",
    "column-descriptions": "columns",
    "postback-1-0-2-days": "postback-sequence-toggle",
    "postback-2-3-7-days": "postback-sequence-toggle",
    "postback-3-8-35-days": "postback-sequence-toggle",
    "special-case-install-event": "special-case-the-install-event",
    "comparing-across-postbacks": "compare-across-postbacks",
    "why-do-i-not-have-data-in-2nd-and-3rd-postback-filters": "why-do-i-not-have-data-in-the-2nd-and-3rd-postback-filters",
  },
  "/features/skan-dashboard/overview": {
    "skan-dashboard": "read-the-skan-dashboard",
    "dashboard-components": "stats-cards",
    "1-stats-overview-cards": "stats-cards",
    "2-privacy-tier-breakdown": "privacy-tiers",
    "3-conversion-value-distribution": "conversion-values",
    "4-install-trends-over-time": "trend-graph",
    "5-all-conversion-values-table": "conversion-table",
    "can-i-see-skan-dashboard-even-if-skan-configuration-is-not-done-on-linkrunner":
      "can-i-see-the-skan-dashboard-even-if-skan-configuration-is-not-done-on-linkrunner",
    "i-have-set-up-conversion-values-but-still-there-is-no-data-on-the-skan-dashboard":
      "i-have-set-up-conversion-values-but-there-is-still-no-data-on-the-skan-dashboard",
  },

  // Content links (#user-registration is the old name of the signup section).
  "/sdk/android": {
    "backup-configuration": "step-3-backup-configuration",
    "step-4-revoking-the-ad_id-permission-optional": "step-5-revoking-the-ad_id-permission-optional",
    "user-registration": "user-identification-required",
  },
  ...Object.fromEntries(
    ["ios", "react-native", "flutter", "cordova", "capacitor"].map((p) => [
      `/sdk/${p}`,
      { "user-registration": "user-identification-required" },
    ])
  ),
  "/ad-networks/meta-ads": { "2-generate-access-token": "step-5-configure-capi" },
};

/** Exact source text dropped from a page in the Relay build. */
export const RELAY_REMOVED_TEXT: Record<string, string[]> = {
  "/features/webhooks": [
    "\n\nIt is also the `install_instance_id` used by the [SDK-less API](/sdk-less/api-reference), so a webhook payload can be matched to the `attribution-data` response for the same install.",
  ],
};

type PageTitle = { title?: string; label?: string };

/**
 * `title` replaces the page's H1 and <title>; `label` is the sidebar text
 * (defaults to the title). Keep labels short enough for one sidebar line.
 */
export const PAGE_TITLES: Record<string, PageTitle> = {
  "/quickstart": { label: "App setup quickstart" },
  "/ai-agent-skills": { title: "Set up with an AI coding agent", label: "Set up with an AI agent" },
  "/features/website-projects": { title: "Set up a website project", label: "Website projects" },

  "/sdk/react-native": { label: "React Native" },
  "/sdk/flutter": { label: "Flutter" },
  "/sdk/capacitor": { label: "Capacitor" },
  "/sdk/cordova": { label: "Cordova" },
  "/sdk/ios": { label: "iOS" },
  "/sdk/android": { label: "Android" },
  "/sdk/expo": { label: "Expo" },
  "/sdk/appbrew": { label: "Appbrew" },
  "/sdk/web": { label: "Web" },
  "/sdk/unity": { title: "Unity SDK", label: "Unity" },
  "/sdk/shopify": { title: "Shopify app", label: "Shopify" },


  "/testing/integration-testing": { title: "Test your SDK setup" },
  "/testing/event-and-revenue-testing": { title: "Test events and payments" },
  "/testing/web-sdk-testing": { title: "Test the Web SDK" },
  "/testing/meta-android-attribution-testing": { title: "Test Meta attribution on Android", label: "Test Meta on Android" },
  "/testing/testing-attribution-troubleshooting": {
    title: "Why is my test credited to the wrong campaign?",
    label: "Test credited wrongly",
  },

  "/features/create-trackable-link": { title: "Create a trackable link" },
  "/features/deactivate-campaign-link": { title: "Deactivate a campaign link", label: "Deactivate a link" },
  "/features/custom-landing-page": { title: "Custom landing pages" },
  "/features/subdomain-setup": { title: "Use your own link domain" },
  "/features/deep-linking-setup": { title: "Set up deep links" },
  "/features/deferred-deep-linking": { title: "Deferred deep links" },
  "/features/web-to-app-journeys": { title: "Web to app journeys" },
  "/features/web-partner-link": { title: "Create a web link for a partner", label: "Web link for a partner" },
  "/features/web-events-tracking": { title: "Track sign-ups and purchases on your website", label: "Track sign-ups and purchases" },
  "/features/web-campaign-link": { title: "Create a web link for your own channels", label: "Web link for your channels" },
  "/features/web-campaigns-report": { title: "Read your Web Campaigns report", label: "Read the report" },
  "/features/web-creatives": { title: "See which ads drive website sales", label: "Ads that drive sales" },
  "/features/meta-web-conversions": { title: "Send website conversions to Meta", label: "Conversions to Meta" },
  "/features/google-ads-web-conversions": { title: "Send website conversions to Google Ads", label: "Conversions to Google Ads" },
  "/features/push-notification-tracking": { title: "Track push notifications" },
  "/features/push-notification-providers": { title: "Links in push notification tools", label: "Push notification tools" },
  "/features/link-redirection": { title: "Where links send users" },
  "/features/deep-link-management": { title: "Create deep links" },
  "/features/referral-codes": { title: "Track referrals" },
  "/features/custom-store-listing": { title: "Send users to custom store pages", label: "Custom store pages" },
  "/features/social-media-intermediary-page": { title: "Links opened inside social apps", label: "Links in social apps" },

  "/features/users-tab": { title: "Users" },
  "/features/events-tab": { title: "Events" },
  "/features/data-export": { title: "Export data as CSV", label: "Export data" },

  "/features/uninstall-tracking": { title: "Track uninstalls" },
  "/features/retention": { title: "How retention is counted", label: "Retention" },
  "/features/meta-install-referrer": { title: "Meta install referrer" },
  "/features/send-consent": { title: "Send user consent" },
  "/features/ios-campaign-data-limitations": { title: "Why some iOS campaign data is missing", label: "Missing iOS data" },
  "/features/attribution-windows": { title: "Attribution windows" },
  "/features/ctv-attribution": { title: "Connected TV attribution", label: "Connected TV" },
  "/features/fraud-control": { title: "Fraud control" },
  "/features/skadnetwork-integration": { title: "Set up SKAN" },
  "/features/google-skan-setup": { title: "SKAN for Google Ads" },
  "/features/meta-skan-setup": { title: "SKAN for Meta" },
  "/features/skadnetwork-conversion-values": { title: "SKAN conversion values" },
  "/features/skan-dashboard/overview": { label: "SKAN dashboard" },

  "/features/remarketing": { label: "Run a campaign" },
  "/features/remarketing-audiences": { label: "Build an audience" },

  "/billing/overview": { title: "How billing works" },
  "/billing/wallet": { title: "Linkrunner wallet", label: "Wallet" },
  "/billing/finance-role": { title: "Add your finance team", label: "Finance team access" },

  "/ad-networks/meta-ads": { label: "Setup" },
  "/ad-networks/meta-web-to-app": { title: "Meta web to app", label: "Web to app" },
  "/ad-networks/meta-ads-discrepancies": { title: "Meta Ads FAQ and discrepancies", label: "FAQ" },
  "/ad-networks/meta-view-through-attribution": { title: "Meta view-through attribution FAQ", label: "View-through FAQ" },
  "/ad-networks/meta-support-access": { label: "Give support access" },
  "/ad-networks/google-ads": { label: "Setup" },
  "/features/google-icm": { label: "Google ICM" },
  "/ad-networks/google-ads-discrepancies": { title: "Google Ads FAQ and discrepancies", label: "FAQ" },
  "/ad-networks/google-support-access": { label: "Give support access" },

  "/api-reference/revenue-tracking": { title: "Revenue tracking API" },
  "/api-reference/event-capture": { title: "Event capture API" },
  "/api-reference/reporting-web-campaigns": { title: "Web campaigns reporting API" },
  "/api-reference/s2s-clicks": { title: "S2S click API" },
  "/api-reference/s2s-impressions": { title: "S2S impression API" },
  "/api-reference/ctv-impressions": { title: "CTV impression API" },
  "/features/mcp": { title: "Use Linkrunner from Claude and other AI assistants", label: "Use Linkrunner from Claude" },
};
