import { describe, expect, it } from "vitest";
import { PATHWAY_REGISTRY } from "@/data/pathwayRegistry";
import { computePathwayStates } from "@/lib/computePathwayState";
import patientMinimal from "@/__fixtures__/pathways/patient_minimal.json";
import patientExample1 from "@/__fixtures__/pathways/patient_example1.json";
import expectedExample1 from "@/__fixtures__/pathways/expected_states_example1.json";

const findState = (states: ReturnType<typeof computePathwayStates>, id: string) =>
  states.find((state) => state.def.id === id);

describe("computePathwayStates fixtures", () => {
  it("returns insufficient when required analytes are missing", () => {
    const states = computePathwayStates(patientMinimal.results);
    expect(states).toHaveLength(PATHWAY_REGISTRY.length);
    const allInsufficient = states.every((state) => state.status !== "computed");
    expect(allInsufficient).toBe(true);
  });

  it("matches expected values for example1 fixtures", () => {
    const states = computePathwayStates(patientExample1.results);
    const expected = expectedExample1 as Record<string, any>;

    Object.entries(expected).forEach(([id, expectation]) => {
      const state = findState(states, id);
      expect(state).toBeTruthy();
      if (!state) return;
      if (expectation.status && expectation.status !== "computed") {
        expect(state.status).toBe(expectation.status);
        return;
      }
      if (state.status !== "computed") return;
      expect(state.category).toBe(expectation.category);
      expect(state.severity).toBe(expectation.severity);
      expect(state.sigma).toBeCloseTo(expectation.sigma, 2);
      if (expectation.ratio) {
        expect(state.ratio?.label).toBe(expectation.ratio.label);
        expect(state.ratio?.value).toBeCloseTo(expectation.ratio.value, 2);
        if (expectation.ratio.refRange) {
          expect(state.ratio?.refRange?.low).toBe(expectation.ratio.refRange.low);
          expect(state.ratio?.refRange?.high).toBe(expectation.ratio.refRange.high);
        }
      }
      const expectedLines = expectation.metaboliteLines ?? {};
      Object.entries(expectedLines).forEach(([analyteId, foldChange]) => {
        const line = state.metaboliteLines.find((entry) => entry.analyteId === analyteId);
        expect(line).toBeTruthy();
        expect(line?.foldChange).toBeCloseTo(foldChange as number, 2);
      });
    });

    const computedIds = new Set(
      Object.entries(expected)
        .filter(([, expectation]) => expectation.status === "computed")
        .map(([id]) => id),
    );
    computedIds.forEach((id) => {
      const state = findState(states, id);
      expect(state?.status).toBe("computed");
    });
  });
});
