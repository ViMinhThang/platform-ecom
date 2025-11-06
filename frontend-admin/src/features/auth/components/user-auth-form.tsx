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
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { FormInput } from '@/components/forms/form-input';
import { signIn } from 'next-auth/react';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/overview';
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl
      });

      if (res?.error) {
        toast.error(res.error || 'Invalid email or password');
      } else {
        toast.success('Signed in successfully!');
        router.push(callbackUrl);
      }
    });
  };

  return (
    <Form
      form={form as any}
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
        name='password'
        label='Password'
        type='password'
        placeholder='Enter your password...'
        disabled={loading}
      />
      <Button disabled={loading} className='mt-2 ml-auto w-full' type='submit'>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </Form>
  );
}
