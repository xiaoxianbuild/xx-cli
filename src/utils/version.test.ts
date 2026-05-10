import { describe, it, expect } from "vitest";
import { compareVersions } from "./version";

describe("version comparison", () => {
  it("should correctly compare simple versions", () => {
    expect(compareVersions("1.0.0", "0.9.0")).toBe(1);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("0.9.0", "1.0.0")).toBe(-1);
  });

  it("should handle 'v' prefix", () => {
    expect(compareVersions("v1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("v1.1.0", "v1.0.1")).toBe(1);
  });

  it("should handle pre-release tags", () => {
    expect(compareVersions("1.0.0-alpha.1", "1.0.0-alpha.2")).toBe(-1);
    expect(compareVersions("1.0.0", "1.0.0-alpha.1")).toBe(1);
    expect(compareVersions("1.0.0-beta.1", "1.0.0-alpha.1")).toBe(1);
  });

  it("should handle complex semver", () => {
    expect(compareVersions("1.2.3-rc.1", "1.2.3-beta.10")).toBe(1);
  });
});
