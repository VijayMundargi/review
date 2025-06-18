
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser, registerUser } from '@/actions/authActions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.replace('/restaurants');
    }
  }, [currentUser, router]);


  const onSubmit = async (values: LoginFormValues, actionType: 'login' | 'register') => {
    setIsSubmitting(true);
    setAuthError(null);
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);

    try {
      const result = actionType === 'login' ? await loginUser(formData) : await registerUser(formData);
      if (result.success && result.user) {
        login(result.user);
        toast({
          title: actionType === 'login' ? "Login Successful" : "Registration Successful",
          description: `Welcome, ${result.user.username}!`,
        });
        router.push('/restaurants');
      } else {
        const errorMsg = result.generalError || (result.errors ? Object.values(result.errors).flat().join(', ') : "An unknown error occurred.");
        setAuthError(errorMsg);
        toast({
          variant: "destructive",
          title: actionType === 'login' ? "Login Failed" : "Registration Failed",
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setAuthError(errorMsg);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUser) { // Extra check to prevent flicker if already logged in
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
          <CardTitle className="text-3xl font-headline text-primary">Gadag Grub Guide</CardTitle>
          <CardDescription className="text-muted-foreground">Login or Register to explore restaurants</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                {...form.register('password')}
                className="bg-input placeholder:text-muted-foreground"
                aria-invalid={form.formState.errors.password ? "true" : "false"}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            {authError && (
              <p className="text-sm text-destructive text-center">{authError}</p>
            )}
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-0 pt-6">
              <Button 
                type="button" 
                onClick={form.handleSubmit(data => onSubmit(data, 'login'))} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-150 hover:scale-105"
                disabled={isSubmitting}
                aria-label="Login"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Login
              </Button>
              <Button 
                type="button" 
                onClick={form.handleSubmit(data => onSubmit(data, 'register'))} 
                variant="outline" 
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 transition-transform duration-150 hover:scale-105"
                disabled={isSubmitting}
                aria-label="Register"
              >
                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Register
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Explore the flavors of Gadag. Your culinary journey starts here.
      </p>
    </div>
  );
}

