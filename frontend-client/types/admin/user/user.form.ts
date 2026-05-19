import { z } from "zod";
import { Address } from "./user";

export const UserFormSchema = z.object({
  userId: z.number().optional(),
  username: z.string().min(3),
  email: z.string().email(),
  imageUrl: z.string().optional(),
  isActive: z.string(),
  roles: z.array(z.string()).nonempty("At least one role is required"),
  addresses: z.array(z.any()).optional(),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;

export interface UserDialogProps {
  userId: number | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
