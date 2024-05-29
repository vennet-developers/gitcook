import GITEMOJIS from "./gitmoji.json" assert { type: "json" };
import CONVENTIONAL_TYPES from "./conventional-types.json" assert { type: "json" };
import type { IGenericKeyString } from "../../../core/types/common.types.js";

const SUGGESTION_EMOJI_TYPES: IGenericKeyString = {
  [CONVENTIONAL_TYPES.build.value]: GITEMOJIS[":construction:"].name,
  [CONVENTIONAL_TYPES.chore.value]: GITEMOJIS[":wrench:"].name,
  [CONVENTIONAL_TYPES.ci.value]: GITEMOJIS[":construction_worker:"].name,
  [CONVENTIONAL_TYPES.docs.value]: GITEMOJIS[":memo:"].name,
  [CONVENTIONAL_TYPES.feat.value]: GITEMOJIS[":sparkles:"].name,
  [CONVENTIONAL_TYPES.fix.value]: GITEMOJIS[":bug:"].name,
  [CONVENTIONAL_TYPES.perf.value]: GITEMOJIS[":zap:"].name,
  [CONVENTIONAL_TYPES.refactor.value]: GITEMOJIS[":recycle:"].name,
  [CONVENTIONAL_TYPES.revert.value]: GITEMOJIS[":rewind:"].name,
  [CONVENTIONAL_TYPES.style.value]: GITEMOJIS[":lipstick:"].name,
  [CONVENTIONAL_TYPES.test.value]: GITEMOJIS[":test_tube:"].name,
};

export { SUGGESTION_EMOJI_TYPES, GITEMOJIS };
