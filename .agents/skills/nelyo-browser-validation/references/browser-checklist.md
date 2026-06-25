# Browser Checklist

Use this checklist for synthetic local or test browser validation.

- Confirm the origin is approved and non-production.
- Start or reuse the local service.
- Open the changed route in Playwright CLI while MCP remains blocked.
- Verify page identity and core landmarks.
- Exercise one happy path.
- Exercise one relevant failure path.
- Check desktop, tablet, and mobile viewports.
- Inspect console errors and warnings.
- Inspect failed requests.
- Inspect request and response payloads for sensitive data.
- Inspect localStorage, sessionStorage, IndexedDB, service workers, cache, and cookies.
- Check keyboard navigation and visible focus.
- Check accessibility tree structure.
- Check loading, empty, error, offline, unauthorized, and retry states where relevant.
- Check reduced-motion behavior.
- Confirm no external request is made unless explicitly approved.
- Run deterministic Playwright tests after interactive inspection.
- Store artifacts only under ignored paths.
