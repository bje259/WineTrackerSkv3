/* eslint-disable @typescript-eslint/no-unused-vars */
import { getYear } from "date-fns";
import { z } from "zod";

// See https://zod.dev/?id=primitives for schema syntax
export const bottleSchema = z.object({
  id: z.string(),
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
    .transform((v) => {
      if (v === "") return undefined;
      return v;
    })
    .optional(),
  Consumed: z
    .string()
    .transform((v) => {
      if (v === "") return undefined;
      return v;
    })
    .optional(),
});

export const crudSchema = bottleSchema.extend({
  id: bottleSchema.shape.id.optional(),
  UserId: z.string().optional(),
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

export const loginUserDto = z.object({
  usernameOrEmail: z.string({
    required_error: "Email or Username is required",
  }),
  password: z.string({ required_error: "Password is required" }),
});

export const userSchema = z.object({
  username: z
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
});

const userAdds = userSchema.extend({
  id: z.string().optional(),
  verified: z.boolean().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
  emailVisibility: z.boolean().optional(),
  avatar: z.string().optional(),
});

export const userDB = userAdds.omit({
  password: true,
  passwordConfirm: true,
});

export type UserDB = z.infer<typeof userDB>;
