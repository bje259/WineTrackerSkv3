"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var zod_to_ts_1 = require("zod-to-ts");
var schema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    age: zod_1.z.number().positive(),
    tags: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.enum(["draft", "published", "rejected"]),
    createdAt: zod_1.z.date(),
});
var node = (0, zod_to_ts_1.zodToTs)(schema).node;
