import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export function NavBar() {
    return (
        <nav className="flex flex-row gap-4 p-8 items-center justify-center">
            <Button variant="link">
                <Link
                    href='/'
                    prefetch={false}
                >
                    Home
                </Link>
            </Button>
            <Button variant="link">
                <Link
                    href='/admin'
                    prefetch={false}
                >
                    Admin
                </Link>
            </Button>
            <Button variant="link">
                <Link
                    href='/api/export'
                    prefetch={false}
                    download
                >
                    Admin Export Api
                </Link>
            </Button>
            <Button variant="link">
                <Link
                    href='/user'
                    prefetch={false}
                >
                    User
                </Link>
            </Button>
            <ModeToggle />
        </nav>
    )
}