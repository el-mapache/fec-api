import { buildRequiredDescriptor } from "../utils";

const cycleRequired = buildRequiredDescriptor({
  param: "cycle",
  type: Array,
  message:
    "It should be an array of 2 integers, beginning with an odd year and ending with an even one. For example [2019. 2020]",
});

const candidateIdRequired = buildRequiredDescriptor({
  param: "candidateId",
  type: Array,
  message: "The ID of the candidate mus be provided.",
});

export default [
  {
    uri: "",
    defaults: {
      two_year_transaction_period: new Date().getFullYear(),
    },
    method: "all",
  },
  {
    uri: ":sub_id",
    defaults: {
      two_year_transaction_period: new Date().getFullYear(),
    },
    method: "byId",
  },
  {
    uri: "by_employer",
    method: "byEmployer",
  },
  { uri: "by_occupation", method: "byOccupation" },
  { uri: "by_size", method: "bySize" },
  { uri: "by_zip", method: "byZip" },
  { uri: "efile", method: "eFile" },
  { uri: "by_state", method: "byState" },
  { uri: "by_state/totals", method: "totalsByState" },
  {
    uri: "by_state/by_candidate",
    method: "byStateAndCandidate",
    required: [cycleRequired, candidateIdRequired],
  },
  {
    uri: "by_state/by_candidate/totals",
    method: "byStateAndCandidateTotals",
    required: [cycleRequired, candidateIdRequired],
  },
  {
    uri: "by_size/by_candidate",
    method: "bySizeAndCandidate",
    required: [cycleRequired, candidateIdRequired],
  },
];
