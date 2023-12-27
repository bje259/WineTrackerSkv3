/* eslint-disable prefer-const */
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";
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
const typeAlias = createTypeAlias(node, identifier);
const nodeString = printNode(typeAlias);
nodeString;
typeAlias;
let myUser = {
    username: "bob",
    age: 123,
    inventory: [
        {
            name: "bob",
            itemId: 123,
        },
    ],
};
