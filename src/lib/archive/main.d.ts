import { z } from "zod";
export const bottleSchema = z.object({
  id: z.string(),
  Name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(85, { message: "Name cannot be longer than 85 characters" }),
  Producer: z
    .string()
    .min(1, { message: "Producer cannot be empty" })
    .max(85, { message: "Producer cannot be longer than 85 characters" }),
  Vintage: z
    .union([z.string(), z.number()])
    .pipe(z.coerce.number())
    .pipe(z.number().min(1, { message: "Vintage is required" })),
  Purchased: z
    .string()
    .transform((v) => {
      const datetime = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
      if (datetime.safeParse(v).success) return v;
      if (v.includes("/")) {
        const [month, day, year] = v.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const dateString = date.toISOString().split("T")[0];
        if (datetime.safeParse(dateString).success) return dateString;
      }
      return undefined;
    })
    .optional(),
  Consumed: z
    .string()
    .transform((v) => {
      const datetime = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
      if (datetime.safeParse(v).success) return v;
      if (v.includes("/")) {
        const [month, day, year] = v.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const dateString = date.toISOString().split("T")[0];
        if (datetime.safeParse(dateString).success) return dateString;
      }
      return undefined;
    })
    .optional(),
});

export const crudSchema = bottleSchema.extend({
  id: bottleSchema.shape.id.optional(),
  UserId: z.string().optional(),
});

export type BottleSchema = z.infer<typeof bottleSchema>;

export type BottleSchemaInput = z.input<typeof bottleSchema>;

export type CrudSchemaInput = z.input<typeof crudSchema>;
export type CrudSchemaOutput = z.output<typeof crudSchema>;

export const inputCrudSchema = crudSchema.extend({
  Vintage: z.union([z.string(), z.number()]),
});

export const bottleRecordSchema = bottleSchema.extend({
  id: z.string(),
  UserId: z.string(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
});

type BottlesDB = z.infer<typeof bottleSchema>[];
