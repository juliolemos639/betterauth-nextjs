"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "./ui/spinner"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { Separator } from "./ui/separator"

const formSchema = z.object({
    email: z
        .email()
        .min(3, "Enter a valid email."),
    password: z.string()
        .min(6, "Password must be at least 6 characters."),
})

export function SignInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await authClient.signIn.email({ email: data.email, password: data.password },
                {
                    onSuccess: () => {
                        toast.success("Signed in successfully!")
                        form.reset()
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "An error occurred while signing in. Please try again.")
                    }
                }
            )
        } catch (error) {
            throw toast.error("An error occurred while signing in. Please try again.")
        }
    }

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/"
        })
    }
    const signInWithGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/"
        })
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>
                    Sign in to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex-col w-full">
                <Field
                    orientation="horizontal"
                    className="flex w-full items-center justify-between flex-col gap-2"
                >
                    <Button
                        type="submit"
                        form="signin-form"
                        className="cursor-pointer w-full"
                    >
                        {form.formState.isSubmitting ? (
                            <Spinner className="size-6" />
                        ) : (
                            "Sign in"
                        )}
                    </Button>

                    <p className="text-sm flex items-center gap-1">
                        Do not have an account?{" "}
                        <Link href="/sign-up" className="text-blue-500">
                            {" "}
                            Sign up
                        </Link>
                    </p>
                </Field>
                <div className="flex flex-col w-full my-6 items-center justify-center">
                    <p className="text-sm">Or</p>
                    <Separator className="gap-6 my-1" />
                </div>

                <div className="flex flex-col w-full gap-3">
                    <Button
                        type="button"
                        className="text-sm cursor-pointer"
                        onClick={signInWithGoogle}
                    >
                        Continue with Google
                    </Button>

                    <Button
                        type="button"
                        className="text-sm cursor-pointer"
                        onClick={signInWithGithub}
                    >
                        Continue with Github
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
