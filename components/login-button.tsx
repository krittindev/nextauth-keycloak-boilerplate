"use client"

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
export default function Login() {
    return <Button onClick={() => signIn("keycloak")}>
        Signin with keycloak
    </Button>
}