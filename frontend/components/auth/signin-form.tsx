"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { loginUserAction } from "data/actions/auth-actions";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
};

export default function SigninForm() {
    const [formState, formAction] = useActionState(loginUserAction, INITIAL_STATE);
    return (
        <div className="w-full max-w-md mx-auto">
            <form action={formAction}>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your details to sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="identifier"
                                name="identifier"
                                type="text"
                                placeholder="username or email"
                            />
                            <ZodErrors error={formState?.zodErrors?.identifier} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full"
                            text="Sign In"
                            loadingText="Loading"
                        />
                        <StrapiErrors error={formState?.strapiErrors} />
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?
                    <Link className="underline ml-2" href="signup">
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
}