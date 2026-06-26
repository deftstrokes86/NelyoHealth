# Platform Contract Baseline

## Status

Draft baseline for API and data contracts required before later feature implementation begins.

## Contract principles

- The API contract must be the authoritative interface for web and mobile clients.
- Domain models must not leak vendor-specific SDK types.
- Protected provider details must never be included in pre-payment responses.
- All write operations must be auditable and authorization-aware.

## Core contract areas

### Identity and account contracts
- `POST /accounts/register`
- `POST /accounts/login`
- `GET /accounts/me`
- `PATCH /accounts/me`

Required fields:
- `accountId`
- `personId`
- `tenantId`
- `roles`
- `consentState`
- `createdAt`

### Authorization and consent contracts
- `GET /authorization/permissions`
- `POST /consents`
- `PATCH /consents/{consentId}`

Required fields:
- `subjectId`
- `grantedTo`
- `scope`
- `status`
- `effectiveAt`
- `revokedAt`

### Provider and catalogue contracts
- `GET /providers/search`
- `GET /catalog/services`
- `GET /catalog/services/{serviceId}`

Required fields:
- `providerDisplayName`
- `serviceId`
- `price`
- `currency`
- `availabilityStatus`

Pre-payment privacy rule:
- provider-specific contact data, branch data, directions, and exact location must not appear in pre-payment responses.

### Payment and ledger contracts
- `POST /payments/quotes`
- `POST /payments/initiate`
- `POST /payments/confirm`
- `GET /payments/{paymentId}`

Required fields:
- `paymentId`
- `orderId`
- `status`
- `amount`
- `currency`
- `authorizedAt`
- `settledAt`

### Booking and encounter contracts
- `POST /bookings`
- `GET /bookings/{bookingId}`
- `POST /encounters`

Required fields:
- `bookingId`
- `patientId`
- `providerId`
- `status`
- `scheduledAt`
- `encounterState`

## Shared response envelope

All API responses should follow a consistent envelope:

```json
{
  "data": {},
  "meta": {
    "requestId": "string",
    "correlationId": "string"
  },
  "errors": []
}
```

## Contract validation requirements

- OpenAPI generation must be tested.
- Contract drift tests must fail on incompatible changes.
- Privacy-sensitive fields require explicit tests.
- Authorization and audit metadata must be part of the contract validation process.
