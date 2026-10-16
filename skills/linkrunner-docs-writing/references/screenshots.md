# Screenshot guidance

Capture only when an image helps the reader locate a control or choose the right configuration. Preserve the existing documentation's visual style without adding screenshots for obvious clicks.

## Prepare

- Use the actual UI and an authorized local/test account. For unreleased dashboard work, use the local dashboard and local backend; its login session is separate from production.
- Replace sensitive text with synthetic values before capture. Remove customer names, subdomains, account identifiers, custom event names, tokens, and private payloads. Prefer removal or opaque redaction to blur.
- Do not fabricate screens or silently substitute an unavailable feature. Record a missing screenshot as a review limitation.
- Choose a crop that shows the relevant control and enough context to locate it. Exclude unrelated browser chrome.

## Capture

Use the available browser's supported screenshot tool. Target 2x resolution with a little padding. If the tool forces 1x or a tight crop, use a supported Chromium CDP route rather than claiming the default image is retina.

For a Playwright/CDP implementation, the established procedure is:

1. Obtain a CDP session for the current page and set `Emulation.setDeviceMetricsOverride` to a device scale factor of 2.
2. Get the target element's viewport-relative bounding box. Read `window.scrollX` and `window.scrollY` from the page explicitly.
3. Add those offsets to obtain document coordinates; expand the clip with padding without extending beyond the document bounds.
4. Call `Page.captureScreenshot` with the clip, `captureBeyondViewport: true`, and PNG format. Its clip uses CSS pixels; verify the resulting image dimensions rather than assuming the override worked.
5. Save through the available supported file/download interface. A restricted browser execution environment may not expose filesystem imports.
6. Restore the viewport emulation when the capture is finished.

This describes the capture method, not a guarantee that a particular browser tool exposes every API. Use the configured tool's actual interface; do not invent helper names.

## Check the saved image

- Inspect the final pixels for sensitive data, crop errors, obscured helper text, and stray overlays or tab indicators.
- Match surrounding screenshots for padding and scale. Keep controls and configuration values unchanged apart from privacy redaction.
- Save under `images/<topic>/` using a descriptive lowercase hyphenated name. Prefer WebP when supported, and add useful alt text in the page.
- Inspect the image in the rendered page. File creation alone does not prove that the reader sees a useful screenshot.
