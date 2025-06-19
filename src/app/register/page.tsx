
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerUser } from '@/actions/authActions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, NextRouter } from 'next/navigation';
import Link from 'next/link';
import { UtensilsCrossed, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path to show error under
});

type RegisterFormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, currentUser } = useAuth(); // login is used to set user session after registration
  const router: NextRouter = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.replace('/restaurants');
    }
  }, [currentUser, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setAuthError(null);
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    // confirmPassword is not sent to action, it's just for client-side validation

    try {
      const result = await registerUser(formData);
      if (result.success && result.user) {
        login(result.user); // Log in the user after successful registration
        toast({
          title: "Registration Successful",
          description: `Welcome, ${result.user.username}! You are now logged in.`,
        });
        router.push('/restaurants');
      } else {
        const errorMsg = result.generalError || (result.errors ? Object.values(result.errors).flat().join(', ') : "An unknown error occurred.");
        setAuthError(errorMsg);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setAuthError(errorMsg);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (currentUser) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-block p-3 bg-primary rounded-full mx-auto mb-4">
            <UtensilsCrossed className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground">Join Gadag Grub Guide to review and discover</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                {...form.register('username')}
                className="bg-input placeholder:text-muted-foreground"
                aria-invalid={form.formState.errors.username ? "true" : "false"}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...form.register('password')}
                className="bg-input placeholder:text-muted-foreground"
                aria-invalid={form.formState.errors.password ? "true" : "false"}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...form.register('confirmPassword')}
                className="bg-input placeholder:text-muted-foreground"
                aria-invalid={form.formState.errors.confirmPassword ? "true" : "false"}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            {authError && (
              <p className="text-sm text-destructive text-center">{authError}</p>
            )}
            <CardFooter className="flex flex-col gap-4 p-0 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-150 hover:scale-105"
                disabled={isSubmitting}
                aria-label="Register"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Sign Up
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Start your Gadag culinary adventure today.
      </p>
    </div>
  );
}
