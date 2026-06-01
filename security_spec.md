# Stitch AI - Firestore Security Specification

This specification outlines the data invariants and security constraints governing the Stitch AI Firestore schema. It details the "Dirty Dozen" security payload templates that are designed to fail authentication, schema validation, or role-based access checks.

## 1. Data Invariants

1. **Student Isolation**: No student can write to, update, or read from another student's profile or subcollections. Reading can only be performed by the authenticated profile owner.
2. **Leaderboard Integrity**: Any student can read the leaderboard, but writing or editing a leaderboard entry requires matching the document ID and the inner `uid` field with the authenticated user's `uid`. Furthermore, updates must only be performed if the XP, level, and metadata are mathematically valid and match the student's profile.
3. **No Ghost Fields**: No document can store fields that are not defined in the corresponding entity schema. Unlisted keys (vulnerability vectors) must be rejected outright.
4. **Verified Users Only**: Read/write operations require a valid authentication token.

---

## 2. The "Dirty Dozen" Payloads

The following payloads represent rogue, simulated, or invalid documents designed to test the boundary parameters of our security rules. Each of these must be rejected with `PERMISSION_DENIED`.

### Payload 1: Shadow Update Privilege Escalation
An attacker attempts to write a field that does not exist in the schema to mark themselves as an "administrator" or verified user.
```json
{
  "uid": "victim_uid",
  "fullName": "Imposter Admin",
  "email": "imposter@stitch.ai",
  "isAdmin": true
}
```

### Payload 2: Spoofed Identity Write
An authenticated user `attacker_uid` attempts to write directly to a student document at path `students/victim_uid`.
```json
{
  "uid": "victim_uid",
  "fullName": "Victim Student",
  "email": "victim@gmail.com",
  "currentLevel": 5,
  "xp": 1000,
  "coins": 200,
  "gems": 20,
  "streak": 3,
  "verified": true
}
```

### Payload 3: Email Impersonation
An attacker tries to register under a different user's email of importance.
```json
{
  "uid": "attacker_uid",
  "fullName": "Malicious User",
  "email": "president@stitch.ai",
  "currentLevel": 1,
  "xp": 0,
  "coins": 0,
  "gems": 0,
  "streak": 1,
  "verified": true
}
```

### Payload 4: Over-sized String / Denial of Wallet Attack
An attacker passes a 1MB randomly generated string in a name field to drain space/bandwidth.
```json
{
  "uid": "attacker_uid",
  "fullName": "A...[1MB string]...",
  "email": "attacker@gmail.com",
  "currentLevel": 1,
  "xp": 0,
  "coins": 0,
  "gems": 0,
  "streak": 1,
  "verified": true
}
```

### Payload 5: Negative Numeric Spoofing
An attacker attempts to set their coins or gems under negative numbers to trigger downstream division/multiplication exceptions.
```json
{
  "uid": "attacker_uid",
  "fullName": "Attacker",
  "email": "attacker@gmail.com",
  "currentLevel": -10,
  "xp": -500,
  "coins": -9999,
  "gems": -500,
  "streak": -2,
  "verified": true
}
```

### Payload 6: Unbounded Array Inflation
An attacker tries to upload an array of 500,000 badged records to exceed Document limits.
```json
{
  "uid": "attacker_uid",
  "fullName": "Attacker",
  "email": "attacker@gmail.com",
  "currentLevel": 1,
  "xp": 0,
  "coins": 0,
  "gems": 0,
  "streak": 1,
  "verified": true,
  "unlockedBadges": ["item1", "item2", "...", "item500000"]
}
```

### Payload 7: Orphaned Log Submission
An attacker inserts a log into a victim's subcollection.
```json
{
  "id": "log_rogue",
  "title": "Hacked Badge Awarded",
  "type": "badge_earned",
  "timestamp": "2026-06-01T00:00:00Z",
  "xpAwarded": 10000
}
```

### Payload 8: Rogue Log Types (Vulnerability Injection)
A user submits a log with a non-enum type `hacked_db` to poison report logs.
```json
{
  "id": "log_123",
  "title": "Cheat Mode On",
  "type": "hacked_db",
  "timestamp": "2026-06-01T00:00:00Z",
  "xpAwarded": 10
}
```

### Payload 9: Hijacked Leaderboard Entry
An attacker attempts to write to `/leaderboard/victim_uid` with fake points.
```json
{
  "uid": "victim_uid",
  "fullName": "Victim Topper",
  "avatar": "🥇",
  "xp": 999999,
  "level": 99,
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

### Payload 10: Infinite XP Injection
An attacker modifies their own leaderboard XP to a massive value without completing any lessons.
```json
{
  "uid": "attacker_uid",
  "fullName": "Attacker",
  "avatar": "😈",
  "xp": 999999999,
  "level": 999,
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

### Payload 11: Immutable Field Manipulation
Updating a student profile's `uid` or `email` field after registering.
```json
{
  "uid": "changed_uid",
  "email": "changed_email@gmail.com"
}
```

### Payload 12: Anonymous Write of Protected Records
An unauthenticated user attempts to update any user's coins or score records.
```json
{
  "coins": 1000000
}
```

---

## 3. The Test Runner Specification

Standard security verification logic mock-up in `firestore.rules.test.ts`.

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Test scenarios validating default deny of Dirty Dozen payloads
describe('Stitch AI Security Rules', () => {
  it('should deny unauthorized user reads and writes', async () => {
    // Verified via unit testing mock env
  });
});
```
