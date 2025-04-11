"use client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { signIn } from "next-auth/react";
import { useLogin } from "~/hooks/use-login";

const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});
type FormProps = z.infer<typeof LoginSchema>;

export const LoginDialog = ({ children }: { children?: React.ReactNode }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const { isLogin, setIsLogin } = useLogin();

  const form = useForm<FormProps>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: FormProps) => {
    try {
      setAlert(false);
      setSubmitting(true);
      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (signInData?.error) {
        setAlert(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isLogin} onOpenChange={setIsLogin}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="sr-only">
            Login
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader className="flex flex-row gap-2">
          <div className="relative h-12 w-24">
            <Image
              src="/logo/logo_1.png"
              alt="Artstay Logo"
              fill
              sizes="100%"
              className="object-contain"
              priority
            />
          </div>
          <DialogTitle className="font-heading text-xl">
            Login Artstay
          </DialogTitle>
          <DialogDescription className="sr-only">Login form</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            {alert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Email or Password is incorrect
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="name@example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Write your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="************"
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-r-none border-r-0"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="rounded-l-none border-l-0"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Write your password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader className="animate-spin" />
                  Please wait...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};