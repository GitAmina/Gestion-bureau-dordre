"use client";
<<<<<<< HEAD
=======

>>>>>>> ec8f355 (init commit-statistics)
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
<<<<<<< HEAD
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
=======
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-card w-full max-w-sm rounded-lg p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Sign in to your account</h2>
          <p className="text-muted-foreground mb-6">
            Not a member?{" "}
            <a href="#" className="text-primary">
              Start a 14 day free trial
            </a>
          </p>
          <form>
            <label
              className="text-muted-foreground mb-2 block text-sm font-medium"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="border-border mb-4 block w-full rounded-lg border p-2"
              placeholder="you@example.com"
              required
            />
            <label
              className="text-muted-foreground mb-2 block text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-border mb-4 block w-full rounded-lg border p-2"
              placeholder="••••••••"
              required
            />

            <div className="mb-4 flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label
                htmlFor="remember"
                className="text-muted-foreground text-sm"
              >
                Remember me
              </label>
              <a href="#" className="ml-auto text-sm text-primary">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="text-primary-foreground w-full rounded-lg bg-primary p-2 hover:bg-primary/80"
            >
              Sign in
            </button>
          </form>
          <div className="text-muted-foreground my-4 text-center">
            Or continue with
          </div>
          <div className="flex justify-center space-x-4">
            <GoogleSigninButton text="Sign in" />
          </div>
        </div>
      </div>
      {/*<GoogleSigninButton text="Sign in" />*/}

      {/*<div className="my-6 flex items-center justify-center">*/}
      {/*  <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>*/}
      {/*  <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">*/}
      {/*    Or sign in with email*/}
      {/*  </div>*/}
      {/*  <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>*/}
      {/*</div>*/}

      {/*<div>*/}
      {/*  <SigninWithPassword />*/}
      {/*</div>*/}

      {/*<div className="mt-6 text-center">*/}
      {/*  <p>*/}
      {/*    Don’t have any account?{" "}*/}
      {/*    <Link href="/auth/signup" className="text-primary">*/}
      {/*      Sign Up*/}
      {/*    </Link>*/}
      {/*  </p>*/}
      {/*</div>*/}
>>>>>>> ec8f355 (init commit-statistics)
    </>
  );
}
