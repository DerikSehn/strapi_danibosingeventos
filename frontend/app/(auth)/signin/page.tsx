import { SigninForm } from "@/components/auth/signin-form";
import { SignupForm } from "@/components/auth/signup-form";
import { NextPage } from "next";


export default async function SigninPage({ }: NextPage) {

    return (<SigninForm />)

}