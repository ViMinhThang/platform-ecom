'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { FormInput } from '@/components/forms/form-input';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password:z.string().min(1,{message:'Password is required'})
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const defaultValues = {
    email: 'huynhminhthang246@gmail.com',
    password:'123456'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(() => {
      console.log('continue with email clicked');
      toast.success('Signed In Successfully!');
      router.push('/dashboard');
    });
  };

  return (
    <>
      <Form
        form={form as unknown as any}
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-2'
      >
        <FormInput
          control={form.control}
          name='email'
          label='Email'
          placeholder='Enter your email...'
          disabled={loading}
        />
        <FormInput
        control={form.control}
        name="password"
        label="Password"
        type="password"
        placeholder='Enter your password...'
        disabled={loading}
        />
        <Button
          disabled={loading}
          className='mt-2 ml-auto w-full'
          type='submit'
        >
          Sign In
        </Button>
      </Form>
    </>
  );
}
