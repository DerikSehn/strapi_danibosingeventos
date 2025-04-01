Epic Next JS 15 Tutorial Part 4: How To Handle Login And Authentication in Next.js
Strapi v5
Intermediate
Next.js
T02DG925U-U039QKS8JVC-87b1021e7476-192.jpeg
Paul Bratslavsky

March 26, 2024

tweet selection
04-epic-next-js-15-strapi-5.png
How To Group Routes In Next.js
Building Our Signin and Signup Form
Form Submission Using Next.js Server Actions
How To Access FormData Inside Next.js Server Action
How To Get Form State With useActionState Hook
Form Validation In Next.js with Zod
Authentication with Next.js and Strapi
Handling Strapi Errors in Next.js
How To Handle Pending State In Next.js With useFormStatus
How To Set HTTP Only Cookie in Next.js
How To Protect Your Routes in Next.js via Middleware
Testing and Debugging Authentication
Deploying Your Application
Improving Your Application with Strapi
Conclusion
In the previous tutorial, we finished our Home Page, so we will build out our Sign In and Sign Up Pages and hook up the logic to allow us to sign in and sign up.

Part 1: Learn Next.js by building a website
Part 2: Building Out The Hero Section of the homepage
Part 3: Finishing up the homepage Features Section, TopNavigation and Footer
Part 4: How to handle login and Authentification in Next.js
Part 5: Building out the Dashboard page and uploading file using NextJS server actions
Part 6: Get Video Transcript with OpenAI Function
Part 7: Strapi CRUD permissions
Part 8: Search & pagination
Part 9: Backend deployment to Strapi Cloud
Part 10: Frontend deployment to Vercel
Let's start by creating our routes.

How To Group Routes In Next.js
Next, we can group our routes and create shared layouts; you can read more here, but for our use case, we will create a route group called auth, to make a route a group, you will create a folder whose name will be between parentheses.

Our folder structure will look like the following.

002-shared-routes.png

Folder named (auth)
Inside the (auth) folder, create two additional folders, signin and signup, with a blank page.tsx file.
Finally, inside the (auth) folder, create a file called layout.tsx to function as our shared layout between our signin and signup pages.
You can learn more about the layout.tsx file in Next.js docs here

Now that we have our basic folder structure. Let's create the following components.

In the layout.tsx file, paste the following code.


export default function AuthLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
Paste the following code in the signin/page.tsx file.


export default function SignInRoute() {
  return <div>Sign In Route</div>;
}
Paste the following code in the signup/page.tsx file.


export default function SingUpRoute() {
  return <div>Sign Up Route</div>;
}
After creating the following components you should be able to navigate to our signin page via the link.

003-signin.gif

Inside src/app, create the following.
Great. Let's now work on our signin and signup forms.

Building Our Signin and Signup Form
Let's navigate to app/components and create a new folder called forms. Inside that folder, create two new files called signin-form.tsx and signup-form.tsx and paste the following code for the respective components.

signin-form.tsx


"use client";

import Link from "next/link";

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

export function SigninForm() {
  return (
    <div className="w-full max-w-md">
      <form>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign In</button>
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
signup-form.tsx


"use client";

import Link from "next/link";

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

export function SignupForm() {
  return (
    <div className="w-full max-w-md">
      <form>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign Up</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="signin">
            Sing In
          </Link>
        </div>
      </form>
    </div>
  );
}
Since we are using Shadcn UI, we need to install the card, input, and label components since we are using them in the code above.

You can learn more about Shadcn UI here

We can install the components by running the following code.


  npx shadcn@latest add card label input
Now that we have installed our components, let's navigate to app/(auth)/signin/page.tsx and import and add our newly created SigninForm component.

The final code should look like the following.


import { SigninForm } from "@/components/forms/signin-form";

export default function SingInRoute() {
  return <SigninForm />;
}
Let's do the same inside the signup/page.tsx file by updating the following.


import { SignupForm } from "@/components/forms/signup-form";

export default function SingUoRoute() {
  return <SignupForm />;
}
Now restart your frontend Next.js application. You should see the following when navigating the Sign In page.

004-forms.gif

Nice, we now have both of our forms. Before getting into the details of how to implement our form submission via Server Actions, here are some great resources to learn more about the process MDN HTML Forms and specific to Next.js Server Action & Mutations

Now let's dive in in building out our SignupForm.

Form Submission Using Next.js Server Actions
We will first focus on our SignupForm, and then, after we understand how things work, we will make the same changes inside our SigninForm.

While building our form, let's consider these items in the context of Next.js.

we can get form values via the name attribute in the input fields inside the form.
the form will have an action attribute pointing to a server action.
when we click the button with the submit, it will submit the form and trigger our action.
we will be able to access our data inside server action via FormData
Inside the server action, our business logic will handle our signup via our Strapi backend.
Let's start by defining our first Next.js server actions. Navigate to src/app/data and create a new folder called actions and a file name auth-actions.ts.

Inside our newly created file, let's paste the following code.


"use server";

export async function registerUserAction(formData: FormData) {
  //console.log("Hello From Register User Action");
}
Now let's import our registerUserAction inside our signup-form.tsx file and add it to our form action.


import { registerUserAction } from "@/data/actions/auth-actions";
Update the form attribute with the following:


{
  /*  rest of our code  */
}
<form action={registerUserAction}>
{/*  rest of our code  */}
</form>;
{
  /*  rest of our code  */
}
Now, you should be able to click the Sign Up button, and we should see our console log in our terminal since it is being executed on the server.

005-server-action-demo.gif

Nice. We don't know if we can trigger our server action via our form submission. Let's examine how we can access our form data via our FormData.

How To Access FormData Inside Next.js Server Action
For additional reading, I recommend checking out this post about FormData on MDN, but we will be using the get method to get our values.

When we submit our form, the values will be passed down to our server action via the form data using the input name attribute as the key to our value.

For example, we can retrieve our data using FormData.get("username") for the following input.

006-input-example.png

With the following code, let's update our registerUserAction action in the auth-actions.ts file.


"use server";

export async function registerUserAction(formData: FormData) {
  //console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  };

  //console.log("#############");
  //console.log(fields);
  //console.log("#############");
}
007-form-submit.gif

Now, fill out the fields in the Signup form and click the Sign Up button. You should see the following console log in your terminal.


Hello From Register User Action
#############
{
  username: 'testuser',
  password: 'Monkey1234!',
  email: 'testuser@email.com'
}
#############
We can now get our data in our server action, but how do we return or validate it?

Well, that is what we will do in our next section.

How To Get Form State With useActionState Hook
We will use React's useActionState hook to return data from our server action. You can learn more here.

Let's first start in the signup-form.tsx file.

We will first import our useActionState hook from react-dom.


import { useActionState } from "react";
Now, let's create a variable to store our initial state.


const INITIAL_STATE = {
  data: null,
};
Now let's use our useActionState hook.


const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);
And update the form action attribute with the following.


  <form action={formAction}>
The completed code should look like the following.


"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerUserAction } from "@/data/actions/auth-actions";

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

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);

  //console.log("## will render on client ##");
  //console.log(formState);
  //console.log("###########################");
  
  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign Up</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="signin">
            Sing In
          </Link>
        </div>
      </form>
    </div>
  );
}
Finally, we have to update our registerUserAction action in the auth-actions.ts file using the following code:


"use server";

export async function registerUserAction(prevState: any, formData: FormData) {
  //console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  };

  //console.log(fields);

  return {
    ...prevState,
    data: fields,
  };
}
When you submit the form, you should see our data console logged in our frontend via our //console.log(formState); that we have in our signup-form.tsx file.

008-data-front-end.png

This is great. We are able to pass data to our server action and return it via useActionState.

Before we see how to submit our form and sign in via our Strapi backend, let's examine how to handle form validation with Zod.

Form Validation In Next.js with Zod
You can learn more about Zod on their website here.

Zod is a validation library designed for use with TypeScript and JavaScript.

It offers an expressive syntax for creating complex validation schema, which makes Zod particularly useful for validating user-generated data, such as information submitted through forms or received from API requests, to ensure the data aligns with your application's expected structures and types.

Let's examine how we can add Zod validation for our forms. We will choose to do the validation inside of our server action.

Let's start by installing Zod with the following command.


yarn add zod
Once the installation is complete, restart your app, navigate to our auth-actions.ts file, and import it with the following command.


import { z } from "zod";
Next, let's define our schema. You can learn more about Zod schemas here.


const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
Here, we are adding simple validation and message.

Now, let's update our registerUserAction to use our schema to validate our fields by making the following changes.


export async function registerUserAction(prevState: any, formData: FormData) {
  //console.log("Hello From Register User Action");

  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  return {
    ...prevState,
    data: "ok",
  };
}
We are using Zod in the above code to validate our user registration data.

The schemaRegister.safeParse function validates username, password, and email fields extracted from formData.

If validation fails (indicated by validatedFields.success being false), the function returns the previous state, Zod validation errors (zodErrors), and a failure message.

If validation succeeds, it returns the previous state updated with a success indicator.

This Zod validation process ensures that user data meets the application's requirements before proceeding.

Let's test our form by not adding any of our fields and submitting it.

009-zod-errors.png

Notice we can see our errors in the front end. Let's create a new component called ZodErrors to help us display them inside our signup-form.tsx file.

First, navigate to src/app/components/custom, create a new file called zod-errors.tsx, and paste it into the following code.


export function ZodErrors({ error }: { error: string[] }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div key={index} className="text-pink-500 text-xs italic mt-1 py-2">
      {err}
    </div>
  ));
}
Now, navigate to src/app/components/forms/signup-form.tsx and let's use the following component.

We will import and add it to our form and pass the zod errors we are getting back from our formState.

The updated signup-form.tsx code should look like the following.


"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUserAction } from "@/data/actions/auth-actions";

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

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );

  //console.log("## will render on client ##");
  //console.log(formState);
  //console.log("###########################");

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
              <ZodErrors error={formState?.zodErrors?.email} />
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
            <button className="w-full">Sign Up</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="signin">
            Sing In
          </Link>
        </div>
      </form>
    </div>
  );
}
Now, restart your frontend Next.js project and try submitting the form without entering any data; you should see the following errors.

010-zod-form-errors.gif

Nice. We don't know if our form validation works, so let's move on and create a service that will handle our Strapi Auth Login.

Authentication with Next.js and Strapi
Now, let's implement Strapi authentication by registering our user via our Strapi API. You can find the process explained here

The basic overview,

request to register user to Strapi
after the user is created, we will get back a JWT token
save the cookie via the httpOnly cookie
redirect the user to the dashboard.
handle Strapi errors if any exist
Let's start by creating a service that will handle Strapi User Registration.

Navigate to src/app/data and create a new folder called services inside. Create the file auth-service.ts and paste it into the following code.


import { getStrapiURL } from "@/lib/utils";

interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

interface LoginUserProps {
  identifier: string;
  password: string;
}

const baseUrl = getStrapiURL();

export async function registerUserService(userData: RegisterUserProps) {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return response.json();
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}

export async function loginUserService(userData: LoginUserProps) {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
}
This includes both our registerUserService and loginUserService, which is based on what you can find in the Strapi Docs here.

Now, we can utilize our registerUserService service inside our auth-actions.ts file. Let's navigate to that file and add the following to our registerUserAction.


const responseData = await registerUserService(validatedFields.data);

if (!responseData) {
  return {
    ...prevState,
    strapiErrors: null,
    zodErrors: null,
    message: "Ops! Something went wrong. Please try again.",
  };
}

if (responseData.error) {
  return {
    ...prevState,
    strapiErrors: responseData.error,
    zodErrors: null,
    message: "Failed to Register.",
  };
}
Don't forget to import our registerUserService with the following.


import { registerUserService } from "@/data/services/auth-service";
The completed code should look like the following.


"use server";
import { z } from "zod";
import { registerUserService } from "@/data/services/auth-service";

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  //console.log("Hello From Register User Action");

  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  //console.log("#############");
  //console.log("User Registered Successfully", responseData.jwt);
  //console.log("#############");
}
Notice in the code above, inside of our return we are now returning strapiErrors. We will see how to render them in the front in just a moment, but first, let's test our form and see if we can see our jwt token being returned in our terminal console.

011-create-user.gif

Nice, we are able to create a new user and register. Before moving on to handling redirects and setting the httpOnly cookie, let's create a component to render our Strapi Errors and Make our Submit Button cooler.

Handling Strapi Errors in Next.js
Now that we have implemented Next.js Strapi authentication, let's ensure that we handle some Strapi errors. Navigate to src/app/components/custom, create a new file named strapi-errors.tsx, and paste the following code.


interface StrapiErrorsProps {
  message: string | null;
  name: string;
  status: string | null;
}

export function StrapiErrors( { error }: { readonly error: StrapiErrorsProps }) {
  if (!error?.message) return null;
  return <div className="text-pink-500 text-md italic py-2">{error.message}</div>;
}
Now navigate back to our signup-form.tsx file, import our newly created component, and add it right after our' submit' button.


import { StrapiErrors } from "@/components/custom/strapi-errors";

<CardFooter className="flex flex-col">
  <button className="w-full">Sign Up</button>
  <StrapiErrors error={formState?.strapiErrors} />
</CardFooter>
Let's test and see if we can see our Strapi Errors. Try creating another user with an email you used to make your first user.

You should see the following message.

012-strapi-errors.gif

Let's improve our submit button by adding a pending state and making it prettier.

How To Handle Pending State In Next.js With useFormStatus
When we submit a form, it may be in a pending state, and we would like to show a spinner for a better user experience.

Let's look at how we can accomplish this by creating a SubmitButton component that will utilize the useFormStatus hook. The Next.js docs provide more details here.

The useFormStatus Hook gives you the status information of the last form submission. We will use that to get the status of our form and show our loading spinner.

Let's start by navigating to app/components/custom, creating the following file name submit-button.tsx, and adding the following code.


"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      className={cn(className)}
    >
      {status.pending || loading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}
Now that we have our new SubmitButton component, let's use it inside our signup-form.tsx file.

Let's replace our boring button with the following, but first, ensure you import it.


import { SubmitButton } from "@/components/custom/submit-button";
Inside our CardFooter, let's update you with the following:


<CardFooter className="flex flex-col">
  <SubmitButton className="w-full" text="Sign Up" loadingText="Loading" />
  <StrapiErrors error={formState?.strapiErrors} />
</CardFooter>
Now let's test our new beautiful button.

013-submit-button.gif

It's beautiful.

The last two things we need to do are to look at how to set our JWT token as a httpOnly cookie, handle redirects, and set up protected routes with the middleware.ts file.

How To Set HTTP Only Cookie in Next.js
We will add this logic to our auth-actions.ts file and our registerUserAction function.

You can learn more about setting cookies in Next.js on their docs here

Let's make the following change inside of our registerUserAction file.

First import cookies from Next:


import { cookies } from "next/headers";
Next, create a variable to store our cookies config.


const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
Finally, use the following code to set the cookie.


  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
Finally, let's add a redirect to our dashboard; first, we must create the page, so let's do that now.

The final code should look like the following. Notice we are using the redirect function from Next.js to redirect the user to the dashboard page; you can learn more here.


"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { registerUserService } from "@/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/dashboard");
}
Inside the app folder, create the dashboard folder with a page.tsx file containing the following code.


export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Dashboard</h1>
    </div>
  );
}
Let's create another user and see our redirect in action and our cookies set.

014-setting-cookie.gif

You can see here that we are saving it as an httpOnly cookie.

015-cookie.png

Nice. We are almost done with the authentication flow, but we still have a small issue. If I remove the cookie, we are still able to navigate to the dashboard, but that should be a protected route.

016-dashboard.gif

How To Protect Your Routes in Next.js via Middleware
We will use Next.js middleware to protect our routes. You can learn more here.

In the src folder, create a file called middleware.ts and paste it into the following code.


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";

// Define an array of protected routes
const protectedRoutes = [
  "/dashboard",
  // Add more protected routes here
];

// Helper function to check if a path is protected
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;

  if (isProtectedRoute(currentPath) && user.ok === false) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// Optionally, you can add a matcher to optimize performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
In the code above, we are using the getUserMeLoader function, which we will create in just a minute, to call our Strapi API to see if the user is still logged in.

If so, we will have the user's information. If the user information does not exist, we will redirect the user to the signin page.

Now, navigate to our services folder and create the following files.

First, let's create a helpful function to get our JWT token.

Create a file inside the services folder called get-token.ts and add the following code.


import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}
Create another file called get-user-me-loader.ts and paste it into the following code.


import { getAuthToken } from "./get-token";
import { getStrapiURL } from "@/lib/utils";

export async function getUserMeLoader() {
  const baseUrl = getStrapiURL();

  const url = new URL("/api/users/me", baseUrl);

  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };
    return { ok: true, data: data, error: null };
  } catch (error) {
    //console.log(error);
    return { ok: false, data: null, error: error };
  }
}
Now, restart your application, delete your previous cookie, and try to navigate to dashboard. We will be redirected back to the `sign-in page.

017-redirect.gif

Nice. Now that we know our middleware is working, let's make the updates in our SigninForm instead of going step by step like we did. Since we will basically do the same thing we did in the SignupForm, we are just going to paste in the completed code.

Let's start in the auth-actions.ts file and replace it with the following code.


"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerUserService,
  loginUserService,
} from "@/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  
  redirect("/dashboard");
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .max(20, {
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Login.",
    };
  }

  //console.log(responseData, "responseData");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
Next, navigate to our signin-form.tsx file and paste the following code.


"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginUserAction } from "@/data/actions/auth-actions";

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

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(loginUserAction, INITIAL_STATE);
  return (
    <div className="w-full max-w-md">
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
Finally, let's create a Logout Button. Navigate to app/components/custom, create a file called logout-button.tsx and add the following code.


import { logoutAction } from "@/data/actions/auth-actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">
        <LogOut className="w-6 h-6 hover:text-primary" />
      </button>
    </form>
  );
}
Finally, let's import this button into our app/dashboard/page.tsx file for now.

The code should look like the following.


import { LogoutButton } from "@/components/custom/logout-button";

export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
Only some things are in place, so let's test our Sign In page.

018-signin.gif

Nice. Great job.

Preventing Common Security Vulnerabilities
Protect your application from common threats by following these best practices:

Use HTTP-only Cookies: Store session tokens in HTTP-only cookies to prevent access from client-side scripts.
Implement CSRF Protection: Guard against Cross-Site Request Forgery attacks by using CSRF tokens for state-changing operations.
Regularly Update Dependencies: Keep your packages up-to-date to patch known vulnerabilities.
Secure Environment Variables: Store secrets like JWT keys in environment variables, not in your codebase.
Handle Errors Safely: Avoid exposing sensitive information in error messages. Log errors securely on the server.
Limit Login Attempts: Implement rate limiting on authentication endpoints to prevent brute-force attacks.
To ensure your application adheres to industry standards, consider reviewing the Strapi security best practices, which include essential measures such as using the latest stable versions, adding HTTPS and SSL certificates, using strong passwords, taking regular backups, securing web hosts, modifying default settings, and installing security plugins.

By implementing these security measures and following best practices, you'll improve the resilience of your Next.js application against potential threats.

Testing and Debugging Authentication
Implementing authentication requires thorough testing to ensure your application is secure and functions correctly.

Writing Unit Tests for Authentication
Writing unit tests for your authentication logic helps catch errors early. Using testing frameworks like Jest, you can create tests for your login and signup API routes. For example, you might test that:

Valid credentials allow successful login.
Invalid credentials return an error.
Tokens are properly generated and stored.
By simulating API calls and checking responses, you can verify that your authentication system handles different scenarios as expected.

Debugging Common Issues
When issues arise, common problems include misconfigured middleware, incorrect token handling, or server-side errors. To debug effectively:

Check Middleware: Ensure your authentication middleware correctly protects routes and redirects unauthenticated users.
Verify Tokens: Confirm that tokens are properly signed and verified with the correct secret keys.
Inspect API Responses: Use tools like Postman or browser developer tools to examine responses from your authentication endpoints.
Review Server Logs: Look for error messages that can indicate where the authentication process is failing.
By systematically checking each part of your authentication flow, you can identify and fix issues to maintain a secure application.

Deploying Your Application
Preparing your Next.js 14 application for deployment involves ensuring that your server settings are properly configured for security and performance.

Configuring Server Settings
To secure your application in production, configure your server appropriately:

Use HTTPS: Implement HTTPS to encrypt data in transit, protecting sensitive information from being intercepted.
Securely Store Secrets: Store your JWT secret and other sensitive credentials securely using environment variables. Avoid hardcoding secrets into your codebase to prevent potential security breaches.
Implement CSRF Protection: Protect your application from Cross-Site Request Forgery (CSRF) attacks by implementing CSRF protection measures, especially for authentication endpoints.
Regularly Update Dependencies: Keep your application's dependencies up to date to patch security vulnerabilities and benefit from the latest features and improvements.
By carefully configuring your server settings, you improve the security and reliability of your deployed application.