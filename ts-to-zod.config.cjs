/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = [
  {
    name: "main",
    input: "src/lib/main.d.ts",
    output: "src/lib/main.d.zod.ts",
    inferredTypes: "src/lib/main.inferred.types.ts",
    //jsDocTagFilter: (tags) => tags.map((tag) => tag.name).includes("toExtract"), // <= rule here
    // customJSDocFormatTypes: {
    //   date: {
    //     regex: "^\\d{4}-\\d{2}-\\d{2}$",
    //     errorMessage: "Must be in YYYY-MM-DD format.",
    //   },
    // },
  },
  {
    name: "example",
    input: "example/heros.ts",
    output: "example/heros.zod.ts",
    inferredTypes: "example/heros.types.ts",
    jsDocTagFilter: (tags) => tags.map((tag) => tag.name).includes("toExtract"), // <= rule here
    customJSDocFormatTypes: {
      date: {
        regex: "^\\d{4}-\\d{2}-\\d{2}$",
        errorMessage: "Must be in YYYY-MM-DD format.",
      },
    },
  },
  { name: "config", input: "src/config.ts", output: "src/config.zod.ts" },
];
