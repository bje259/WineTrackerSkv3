/* eslint-disable @typescript-eslint/no-unused-vars */
import { getYear } from "date-fns";
import { z } from "zod";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";

// See https://zod.dev/?id=primitives for schema syntax
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
  Varietal: z.string().optional(),
  VineyardLoc: z.string().optional(),
  VineyardName: z.string().optional(),
  Bin: z.string().optional(),
  Notes: z.string().optional(),
});

export const crudSchema = bottleSchema.extend({
  id: bottleSchema.shape.id.optional(),
  UserId: z.string().optional(),
});

export type CrudSchemaInput = z.input<typeof crudSchema>;
type CrudSchemaOutput = z.output<typeof crudSchema>;

export const inputCrudSchema = crudSchema.extend({
  Vintage: z.union([z.string(), z.number()]),
});

export const bottleRecordSchema = bottleSchema.extend({
  id: z.string(),
  UserId: z.string(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
});

export const bottleRecordTableSchema = bottleRecordSchema
  .omit({
    UserId: true,
  })
  .extend({
    id: z.string().optional(),
    BottleId: z.string(),
  });

type BottleDB = z.infer<typeof bottleSchema>[];

export const registerUserDto = z
  .object({
    name: z
      .string({ required_error: "Name is required." })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Name can only contain letters and spaces.",
      })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(64, { message: "Name must be less than 64 characters" })
      .trim(),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Email must be a valid email." }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(64, { message: "Password must be less than 64 characters" }),
    passwordConfirm: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(64, { message: "Password must be less than 64 characters" }),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["passwordConfirm"],
      });
    }
  });

export const completionSchema = z.object({
  prompt: z.string(),
});
export const loginUserDto = z.object({
  usernameOrEmail: z.string({
    required_error: "Email or Username is required",
  }),
  password: z.string({ required_error: "Password is required" }),
});

export const userSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(2, { message: "Username must be at least 2 characters" })
    .max(64, { message: "Username must be less than 64 characters" })
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email." }),
  name: z.string().optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be less than 64 characters" }),
  passwordConfirm: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be less than 64 characters" }),
});

export const userAdds = userSchema.extend({
  id: z.string().optional(),
  verified: z.boolean().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
  emailVisibility: z.boolean().optional(),
  avatar: z.string().optional(),
});

export const userAddVerify = userAdds.extend({}).refine((data) => {
  return (
    data.passwordConfirm !== data.password,
    {
      passwordConfirm: "Password and Confirm Password must match",
      password: "Password and Confirm Password must match",
    }
  );
});

export const userDB = userAdds.omit({
  password: true,
  passwordConfirm: true,
});

export const exportSchema = z.object({
  exportString: z.string().optional(),
  UserId: z.string(),
});

export const importSchema = z.object({
  importString: z.string(),
  UserId: z.string(),
});

export const importSchemaArray = importSchema.extend({
  importArray: z.array(crudSchema),
});

// export const inputImportSchemaArray = importSchemaArray.extend({
//   importArray: z.array(
//     crudSchema.extend({
//       Vintage: z.union([z.string(), z.number()]),
//     })
//   ),
// });

type UserDB = z.infer<typeof userDB>;

export const adminToolsSchema = z.object({
  input1: z.string().optional(),
  input2: z.string().optional(),
  input3: z.string().optional(),
  command: z.string().optional(),
  result: z.string().optional(),
});

export const resetPassSchema = z.object({
  email: z.string().email(),
});
