// $lib/utils/zod.ts

import { ZodObject, z, type ZodSchema, type ZodTypeAny, ZodArray } from "zod";
import {
  WineInfoRecordSchema,
  StylestatsRecordSchema,
} from "$lib/WineTypes.js";
// import { renderDate } from "$lib/utils/date";

// export const string2PrettyDate = z
//   .string()
//   .transform((str) => renderDate(new Date(str), { time: false }));

const test = WineInfoRecordSchema.extend({
  expand: StylestatsRecordSchema.optional(),
});

export function extractRecordOptions(schema: ZodSchema) {
  const fields = extractFields(schema);

  return {
    expand: extractExpandKeys(fields).join(","),
    fields: fields.join(","),
  };
}

export function extractFields(schema: ZodSchema): string[] {
  function traverse(obj: ZodTypeAny, prefix = ""): string[] {
    if (!isZodObject(obj)) return [];

    return Object.keys(obj.shape).reduce<string[]>((acc, key) => {
      const field = obj.shape[key];
      const newPrefix = prefix ? prefix + "." + key : key;

      if (isZodObject(field)) return acc.concat(traverse(field, newPrefix));

      if (isZodArray(field) && isZodObject(field.element))
        return acc.concat(traverse(field.element, newPrefix));

      return acc.concat(newPrefix);
    }, []);
  }

  return traverse(schema);
}
function extractExpandKeys(fields: string[]): string[] {
  const expandKeyGroups = fields
    .filter((field) => field.includes("expand."))
    .map((field) =>
      field
        .split(".")
        .reduce((acc: string[], curr, index, arr) => {
          if (curr === "expand" && index < arr.length - 1)
            acc.push(arr[index + 1]);
          return acc;
        }, [])
        .join(".")
    );

  // Remove subpaths that are implied in longer subpaths
  const filteredGroups = expandKeyGroups.filter(
    (group) =>
      !expandKeyGroups.some(
        (otherGroup) => otherGroup.includes(group) && otherGroup !== group
      )
  );

  // Remove duplicates
  return Array.from(new Set(filteredGroups));
}

function isZodArray(field: ZodTypeAny): field is ZodArray<ZodTypeAny> {
  return field instanceof ZodArray;
}

function isZodObject(
  field: ZodTypeAny
): field is ZodObject<{ [key: string]: ZodTypeAny }> {
  return field instanceof ZodObject;
}

function generateZodConfigOptions(schema: ZodSchema) {
  if (isZodObject(WineInfoRecordSchema)) {
    console.log("WineInfoRecordSchema is a ZodObject");
  } else if (isZodObject(StylestatsRecordSchema)) {
    console.log("StylestatsRecordSchema is a ZodObject");
  } else if (isZodObject(test)) {
    console.log("test is a ZodObject");
  } else {
    console.log("WineInfoRecordSchema is not a ZodObject");
  }

  const fields = extractFields(WineInfoRecordSchema);
  console.log(fields);
  const expand = extractExpandKeys(fields);
  console.log(expand);
  const options = extractRecordOptions(WineInfoRecordSchema);
  console.log(options);
  const testOptions = extractRecordOptions(test);
  const testFields = extractFields(test);
  const expandTest = extractExpandKeys(testFields);
  console.log(testOptions);
  console.log(testFields);
  console.log(expandTest);
  console.log(test);
}

function main() {
  console.log("Generating Zod Config Options for WineInfoRecordSchema");
  generateZodConfigOptions(WineInfoRecordSchema);
  console.log("Generating Zod Config Options for StylestatsRecordSchema");
  generateZodConfigOptions(StylestatsRecordSchema);
  console.log("Generating Zod Config Options for test");
  generateZodConfigOptions(test);
}

main();

//end
