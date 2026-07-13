import { createContext, createElement, useContext } from "react";
import type { ReactNode } from "react";

export interface MarketingContent {
  id: string;
  title: string;
  body: string;
  cta?: string;
  eyebrow?: string;
  status?: "draft" | "review" | "approved" | "deprecated";
}

export type ContentRegistry = ReadonlyMap<string, MarketingContent>;

interface ContentContextValue {
  entries: ContentRegistry;
  mode: "production" | "preview";
}

const ContentContext = createContext<ContentContextValue | null>(null);

const isDevelopment = () => {
  if (typeof process === "undefined") return false;
  return process.env?.NODE_ENV !== "production";
};

export interface ContentProviderProps {
  entries: ContentRegistry | Record<string, MarketingContent> | MarketingContent[];
  mode?: "production" | "preview";
  children: ReactNode;
}

const normalize = (
  input: ContentProviderProps["entries"]
): ContentRegistry => {
  if (input instanceof Map) return input;
  const map = new Map<string, MarketingContent>();
  if (Array.isArray(input)) {
    for (const entry of input) map.set(entry.id, entry);
  } else {
    for (const [id, entry] of Object.entries(input))
      map.set(id, { ...entry, id });
  }
  return map;
};

export const ContentProvider = ({
  entries,
  mode = "production",
  children
}: ContentProviderProps) => {
  const value: ContentContextValue = {
    entries: normalize(entries),
    mode
  };
  return createElement(ContentContext.Provider, { value }, children);
};

export const PreviewContentProvider = ({
  entries,
  children
}: {
  entries: ContentProviderProps["entries"];
  children: ReactNode;
}) => createElement(ContentProvider, { entries, mode: "preview" }, children);

const missingEntryError = (id: string) =>
  new Error(
    `Missing content entry for id "${id}". Add it to the content registry or ` +
      `wrap the tree in a ContentProvider that supplies it.`
  );

export const useContent = (id: string): MarketingContent => {
  const context = useContext(ContentContext);
  if (!context) {
    if (isDevelopment()) throw missingEntryError(id);
    return { id, title: id, body: "" };
  }
  const entry = context.entries.get(id);
  if (!entry) {
    if (isDevelopment() && context.mode !== "preview") throw missingEntryError(id);
    return { id, title: id, body: "" };
  }
  return entry;
};

export const useOptionalContent = (
  id: string
): MarketingContent | undefined => {
  const context = useContext(ContentContext);
  if (!context) return undefined;
  return context.entries.get(id);
};
