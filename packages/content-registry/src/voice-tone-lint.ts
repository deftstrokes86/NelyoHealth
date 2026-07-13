import type { ContentEntry } from "./schema.js";

export interface VoiceToneRule {
  id: string;
  description: string;
  check: (entry: ContentEntry) => boolean;
  allow?: (entry: ContentEntry) => boolean;
}

export interface VoiceToneViolation {
  id: string;
  ruleId: string;
  ruleDescription: string;
  location: "title" | "body" | "cta" | "notes";
  match: string;
}

const combined = (entry: ContentEntry) =>
  [entry.title, entry.body, entry.cta ?? "", entry.notes ?? ""].join("   ");

const buildMatcher = (pattern: RegExp) => (entry: ContentEntry) =>
  pattern.test(combined(entry));

const bannedClaims: Array<{ id: string; pattern: RegExp; description: string }> = [
  {
    id: "banned-best-doctors",
    pattern: /\bbest\s+(doctors|clinicians|hospitals|providers)\b/i,
    description: "'best doctors/clinicians' — unverifiable superlative claim."
  },
  {
    id: "banned-guaranteed",
    pattern: /\bguarantee(d|s|ing)?\b/i,
    description:
      "'guaranteed' — unverifiable outcome claim; allowed only inside explicit privacy/security policy language."
  },
  {
    id: "banned-fully-licensed",
    pattern: /\bfully\s+licen[cs]ed\b/i,
    description: "'fully licensed' — unverifiable blanket credential claim."
  },
  {
    id: "banned-nationwide",
    pattern: /\bnationwide\s+(service|coverage|network)\b/i,
    description: "'nationwide service/coverage/network' — unverifiable reach claim."
  },
  {
    id: "banned-instant-results",
    pattern: /\binstant\s+(results?|delivery|response|care)\b/i,
    description: "'instant results/response/care' — misleading urgency claim."
  },
  {
    id: "banned-cheapest",
    pattern: /\bcheapest\s+(care|pricing|option|plan)\b/i,
    description: "'cheapest care/pricing' — unverifiable and undermining trust."
  },
  {
    id: "banned-complete-privacy",
    pattern: /\bcomplete\s+privacy\b/i,
    description: "'complete privacy' — overstates privacy posture."
  },
  {
    id: "banned-zero-risk",
    pattern: /\bzero\s+risk\b/i,
    description: "'zero risk' — misrepresents clinical or platform risk."
  }
];

const privacyPolicyAllow = (entry: ContentEntry) => {
  const isPolicyFamily =
    entry.family === "marketing-legal" || entry.family === "marketing-privacy-overview";
  const inQuotedContext = /"[^"]*guarantee[^"]*"/i.test(entry.body);
  return isPolicyFamily && inQuotedContext;
};

const genericErrorAllow = (entry: ContentEntry) => {
  const combinedText = combined(entry);
  return /(recover|contact|support|retry|try again|help|refresh|reload)/i.test(combinedText);
};

export const voiceToneRules: VoiceToneRule[] = [
  ...bannedClaims.map((banned) => ({
    id: banned.id,
    description: banned.description,
    check: buildMatcher(banned.pattern),
    allow: banned.id === "banned-guaranteed" ? privacyPolicyAllow : undefined
  })),
  {
    id: "generic-error",
    description:
      "'Something went wrong' without a recovery link — offer explicit recovery instead.",
    check: buildMatcher(/something\s+went\s+wrong/i),
    allow: genericErrorAllow
  },
  {
    id: "emoji-in-clinical",
    description: "Emoji as structural or clinical signal is not allowed.",
    check: (entry) => {
      if (
        entry.contentClass !== "clinical-sensitive" &&
        entry.family !== "marketing-emergency" &&
        entry.family !== "marketing-error-pages"
      )
        return false;
      return /[\p{Extended_Pictographic}]/u.test(combined(entry));
    }
  },
  {
    id: "brand-casing",
    description:
      "Brand must be written as 'NelyoHealth' — no other casings (nelyohealth, Nelyo Health, NELYOHEALTH).",
    check: (entry) => {
      const text = combined(entry);
      if (!/nelyo/i.test(text)) return false;
      const matches = text.match(/nelyo\s*health/gi) ?? [];
      return matches.some((match) => match !== "NelyoHealth");
    }
  }
];

const locate = (
  entry: ContentEntry,
  pattern: RegExp
): { location: VoiceToneViolation["location"]; match: string } => {
  for (const field of ["title", "body", "cta", "notes"] as const) {
    const value = entry[field];
    if (typeof value !== "string") continue;
    const match = value.match(pattern);
    if (match) return { location: field, match: match[0] };
  }
  return { location: "body", match: "" };
};

export const lintContentEntry = (entry: ContentEntry): VoiceToneViolation[] => {
  const violations: VoiceToneViolation[] = [];
  for (const rule of voiceToneRules) {
    if (!rule.check(entry)) continue;
    if (rule.allow?.(entry)) continue;
    const patternForLocation =
      bannedClaims.find((banned) => banned.id === rule.id)?.pattern ??
      /./;
    const { location, match } = locate(entry, patternForLocation);
    violations.push({
      id: entry.id,
      ruleId: rule.id,
      ruleDescription: rule.description,
      location,
      match
    });
  }
  return violations;
};

export const lintContentRegistry = (entries: ContentEntry[]): VoiceToneViolation[] =>
  entries.flatMap(lintContentEntry);

export const assertVoiceToneClean = (entries: ContentEntry[]) => {
  const violations = lintContentRegistry(entries);
  if (violations.length > 0)
    throw new Error(
      "Voice-tone violations:\n" +
        violations
          .map(
            (violation) =>
              `- [${violation.ruleId}] ${violation.id} (${violation.location}): "${violation.match}" — ${violation.ruleDescription}`
          )
          .join("\n")
    );
};
