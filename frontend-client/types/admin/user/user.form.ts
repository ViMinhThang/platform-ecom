import { z } from "zod";
import { Address } from "./user";

export const UserFormSchema = z.object({
  userId: z.number().optional(),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  imageUrl: z.string().optional(),
  isActive: z.string(),
  roles: z.array(z.string()).nonempty("Cần chọn ít nhất một vai trò"),
  addresses: z.array(z.any()).optional(),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;

export interface UserDialogProps {
  userId: number | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
