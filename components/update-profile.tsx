"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { Spinner } from "./ui/spinner";
import ImageUpload from "@/app/image-upload";

interface UpdateProfileProps {
    email: string;
    name: string;
    image: string;
}

const formSchema = z
    .object({
        name: z.string().min(3, "Enter a valid name"),
        email: z.email("Enter a valid email adress"),
        image: z.string("Image is required"),
    })

export function UpdateProfile({ name, email, image }: UpdateProfileProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name,
            email,
            image,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await authClient.updateUser(
                {
                    name: data.name,
                    image: data.image,
                },
                {
                    onSuccess: async () => {
                        toast.success("Profile updated successfully");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                }
            );
        } catch {
            throw new Error("Something went wrong");
        }
    };

    return (
        <Card className="w-full max-w-sm border-0 shadow-none">
            <CardHeader>
                <CardTitle>Update your detais</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="update-profile-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel>Name</FieldLabel>
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
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        disabled
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="image"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel>Image</FieldLabel>
                                    <ImageUpload
                                        defaultUrl={field.value}
                                        onChange={(url) => {
                                            field.onChange(url);
                                        }}
                                        endpoint="imageUploader"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>

                    <Button
                        type="submit"
                        form="update-profile-form"
                        className="cursor-pointer w-full"
                    >
                        {form.formState.isSubmitting ? (
                            <Spinner className="size-6" />
                        ) : (
                            "Update Profile"
                        )}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}