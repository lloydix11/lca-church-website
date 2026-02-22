import { z } from "zod";

export const SermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  preacher: z.string().min(1, "Preacher name is required"),
  date: z.string().transform((s) => new Date(s)),
  description: z.string().min(1, "Description is required"),
  youtubeUrl: z.string().optional().nullable(),
});

export type SermonFormData = z.infer<typeof SermonSchema>;

export const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().transform((s) => new Date(s)),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
});

export type EventFormData = z.infer<typeof EventSchema>;

export const CampRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  facebookUrl: z.string().url("Must be a valid URL"),
  contactNumber: z.string().min(1, "Contact number is required"),
  emergencyContactNumber: z.string().min(1, "Emergency contact number is required"),
  invitedBy: z.string().optional().nullable(),
  amountPaid: z.coerce
    .number()
    .min(1000, "Amount must be at least ₱1,000"),
  screenshotSentEmail: z.boolean(),
});

export type CampRegistrationFormData = z.infer<typeof CampRegistrationSchema>;
