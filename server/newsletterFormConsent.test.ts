import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("newsletter form consent", () => {
  it("requires visible consent and communicates the privacy safeguard", () => {
    const form = readFileSync(new URL("../client/src/components/NewsletterForm.tsx", import.meta.url), "utf8");

    expect(form).toContain('type="checkbox"');
    expect(form).toContain("checked={consent}");
    expect(form).toContain("سياسة الخصوصية");
    expect(form).toContain("disabled={subscribe.isPending || !consent}");
    expect(form).toContain("subscribe.mutate({ email, consent: true })");
  });
});
