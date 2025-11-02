"use client";

import { FormFileUpload } from "@/components/forms/form-file-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { User } from "@/constants/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  status: z.enum(["active", "inactive"] as const, {
    message: "Please select a status.",
  }),
});

export default function UserForm({
  initialData,
  pageTitle,
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const defaultValues: z.infer<typeof formSchema> = {
    name: initialData?.name || "",
    email: initialData?.email || "",
    status: initialData?.status || "active",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push("/dashboard/user");
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form as any}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="name"
              label="User Name"
              placeholder="Enter User name"
              required
            />
            <FormInput
              control={form.control}
              name="email"
              label="User Email"
              placeholder="Enter user email"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormSelect
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>
          <Button type="submit">
            {initialData ? "Update User" : "Add User"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
