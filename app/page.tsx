import Login from "@/components/login-button";
import Logout from "@/components/logout-button";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth();
  const isAuthenticated = !!session?.user
  const name = session?.user?.name

  return (
    <main className="flex flex-col w-fit mx-auto p-8 gap-4 items-center justify-center">
      {!!name && <div>Your name is {name}</div>}
      <div>
        {isAuthenticated ?
          <Logout /> :
          <Login />
        }
      </div>
    </main>
  )
}
