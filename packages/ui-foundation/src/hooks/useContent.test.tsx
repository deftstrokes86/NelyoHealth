import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ContentProvider,
  PreviewContentProvider,
  useContent,
  useOptionalContent,
  type MarketingContent
} from "./useContent.js";

const previewEntries: MarketingContent[] = [
  {
    id: "marketing.home.hero.headline",
    title: "One connected care platform",
    body: "Coordinated care across patients, providers, and partners.",
    cta: "Get started",
    eyebrow: "For everyone"
  }
];

const Consumer = ({ id }: { id: string }) => {
  const entry = useContent(id);
  return (
    <span data-testid="consumer" data-title={entry.title}>
      {entry.body}
    </span>
  );
};

const OptionalConsumer = ({ id }: { id: string }) => {
  const entry = useOptionalContent(id);
  return <span data-testid="optional">{entry?.title ?? "absent"}</span>;
};

describe("useContent", () => {
  it("resolves an entry from the provider", () => {
    const output = renderToStaticMarkup(
      <ContentProvider entries={previewEntries}>
        <Consumer id="marketing.home.hero.headline" />
      </ContentProvider>
    );
    expect(output).toContain("Coordinated care across patients");
    expect(output).toContain('data-title="One connected care platform"');
  });

  it("PreviewContentProvider tolerates missing IDs without throwing", () => {
    const output = renderToStaticMarkup(
      <PreviewContentProvider entries={previewEntries}>
        <Consumer id="marketing.home.hero.missing" />
      </PreviewContentProvider>
    );
    expect(output).toContain('data-title="marketing.home.hero.missing"');
  });

  it("throws in development when the ID is missing and mode is production", () => {
    expect(() =>
      renderToStaticMarkup(
        <ContentProvider entries={previewEntries}>
          <Consumer id="marketing.unknown" />
        </ContentProvider>
      )
    ).toThrow(/Missing content entry/);
  });

  it("useOptionalContent returns undefined without a provider", () => {
    const output = renderToStaticMarkup(
      <OptionalConsumer id="marketing.home.hero.headline" />
    );
    expect(output).toContain("absent");
  });

  it("accepts a Record<string, MarketingContent> as entries", () => {
    const output = renderToStaticMarkup(
      <PreviewContentProvider
        entries={{
          "marketing.example": {
            id: "marketing.example",
            title: "Example",
            body: "Body"
          }
        }}
      >
        <Consumer id="marketing.example" />
      </PreviewContentProvider>
    );
    expect(output).toContain("Body");
  });
});
