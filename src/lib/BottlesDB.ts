/* eslint-disable @typescript-eslint/no-unused-vars */
import { getYear } from "date-fns";
import { z } from "zod";

// See https://zod.dev/?id=primitives for schema syntax
const bottleSchema = z.object({
  id: z.string().regex(/^\d+$/),
  Name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(30, { message: "Name cannot be longer than 30 characters" }),
  Producer: z
    .string()
    .min(1, { message: "Producer cannot be empty" })
    .max(30, { message: "Producer cannot be longer than 30 characters" }),
  Vintage: z.coerce.number().min(1, { message: "Vintage is required" }),
  Purchased: z
    .string()
    .refine((v) => v)
    .optional(),
  Consumed: z
    .string()
    .refine((v) => v)
    .optional(),
});

type BottleDB = z.infer<typeof bottleSchema>[];

// Let's worry about id collisions later
export const bottleId = () => String(Math.random()).slice(2);

// A simple user "database"

// function maxId(tmpBottles: TBottles): number {
// 	const maxId = tmpBottles.reduce((max, bottle) => Math.max(max, bottle.Id), 0);
// 	return maxId;
// }

export const bottles: BottleDB = [
  {
    id: "1",
    Name: "Barbera1",
    Vintage: 2019,
    Producer: "Becker Vineyards",
    Purchased: "2021-03-02",
    Consumed: "2022-06-13",
  },
  {
    id: "2",
    Name: "Barbera2",
    Vintage: 2019,
    Producer: "Becker Vineyards",
    Purchased: "2021-03-03",
  },
  {
    id: bottleId(),
    Name: "Barbera23421",
    Vintage: 2016,
    Producer: "Becker Vineyards",
    Purchased: "2021-03-04",
    Consumed: "2023-05-11",
  },
];
