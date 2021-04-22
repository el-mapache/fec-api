import { buildRequiredDescriptor } from "../utils";

const candidateIdRequired = buildRequiredDescriptor({
  param: "candidateId",
  type: String,
  message: "`candidateId` is a required url parameter.",
});
const cycleRequired = buildRequiredDescriptor({
  param: "cycle",
  type: String,
  message:
    "`cycle` is a required query parameter. It should be a single integer, beginning with an an even year.",
});

export default [
  {
    uri: ":candidateId",
    defaults: {},
    required: [candidateIdRequired],
    method: "byId",
  },
  {
    uri: ":candidateId/history",
    defaults: {},
    required: [candidateIdRequired],
    method: "history",
  },
  {
    uri: ":candidateId/history/:cycle",
    defaults: {},
    required: [candidateIdRequired, cycleRequired],
    method: "historyByCycle",
  },
  {
    uri: ":candidateId/totals",
    defaults: {},
    required: [candidateIdRequired],
    method: "totals",
  },
  {
    uri: ":candidateId/committees",
    required: [candidateIdRequired],
    defaults: {},
    method: "committees",
  },
  {
    uri: ":candidateId/committees/history",
    required: [candidateIdRequired],
    defaults: {},
    method: "committeesHistory",
  },
  {
    uri: ":candidateId/committees/history/:cycle",
    required: [candidateIdRequired, cycleRequired],
    defaults: {},
    method: "committeesHistoryByCycle",
  },
];
