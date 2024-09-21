import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
            <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
                404
            </span>
            <h2 className="font-heading my-2 text-2xl font-bold">
                Not Found
            </h2>
            <p>
                Sorry, the page you are looking for doesn&apos;t exist or has been
                moved.
            </p>
            <div className="mt-8 flex justify-center gap-2">
                <BackButton />
                <Button
                    variant="ghost"
                    size="lg"
                >
                    <Link
                        href="/"
                        prefetch={false}
                    >
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}