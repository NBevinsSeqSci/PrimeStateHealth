export type MissingReason =
  | "not_measured"
  | "below_loq"
  | "qc_fail"
  | "not_reported"
  | "missing_in_panel"
  | "missing_in_sample"
  | "unknown";

export const formatMissingReason = (reason?: MissingReason) => {
  switch (reason) {
    case "not_measured":
      return "not measured";
    case "below_loq":
      return "<LOQ";
    case "qc_fail":
      return "QC issue";
    case "not_reported":
      return "Missing / not reported";
    case "missing_in_panel":
      return "Not included in this test panel";
    case "missing_in_sample":
      return "Missing / not reported";
    case "unknown":
    default:
      return "not available";
  }
};
