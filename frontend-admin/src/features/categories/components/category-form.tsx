"use client";

import { FormFileUpload } from "@/components/forms/form-file-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Category } from "@/constants/data";
import { Product } from "@/constants/mock-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
});

export default function CategoryForm({
  initialData,
  pageTitle,
}: {
  initialData: Category | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Form submission logic would be implemented here
    console.log(values);
    router.push("/dashboard/category");
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
              label="Category Name"
              placeholder="Enter category name"
              required
            />
          </div>
          <Button type="submit">
            {initialData ? "Update Category" : "Add Category"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
