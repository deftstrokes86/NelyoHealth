# Provider-Disclosure Checklist

Before successful payment, pharmacy and laboratory discovery must expose only `providerDisplayName` as the provider identity field.

The following must be absent before payment:

- Address
- Branch identifier
- Coordinates
- Distance
- Map pin
- Directions
- Contact details
- Photographs
- External links
- Pickup or collection instructions
- Internal identifier
- Derivable location metadata

Check every boundary:

- HTML
- DOM
- Accessibility tree
- Source output
- Hydration or serialized state
- Browser storage
- Cache
- API responses
- Network requests
- Logs
- Analytics
- Error reports
- Screenshots
- Traces
- Map-provider requests

Protected fields must be removed server-side and must not merely be hidden visually.
