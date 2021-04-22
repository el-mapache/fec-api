import constants from "./constants";

const strings = {
  [constants.baseUris.scheduleA]: {
    "by_size/by_candidate": {
      required: {
        cycle:
          "It should be an array of 2 integers, beginning with an odd year and ending with an even one. For example [2019, 2020]",
        candidate_id:
          "It should be an array of strings corresponding to the candidate(s) you are searching by.",
      },
    },
  },
};

export default strings;
