import { createTypeAlias, zodToTs } from "zod-to-ts";
import { z } from "zod";
const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
  inventory: z
    .object({
      name: z.string(),
      itemId: z.number(),
    })
    .array(),
});
const identifier = "User";
const { node } = zodToTs(UserSchema, identifier);
const typeAlias = createTypeAlias(
  node,
  identifier,
  UserSchema.description
  // optionally pass a comment
  // comment: UserSchema.description
);
