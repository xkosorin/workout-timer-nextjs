import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router"

const Header = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="">
      <Link href="/">
        <a className="bold pl-4" data-active={isActive('/')}>
          Feed
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status == 'loading') {
    right = (
      <div>
        <p>Validating session ...</p>
      </div>
    )
  }

  if (!session) {
    right = (
      <div>
        <Link href="/api/auth/signin" className="pl-4">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session && session.user) {
    left = (
      <div className="">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
        </Link>
        <Link href="/exercises">
          <a className="pl-4" data-active={isActive('/exercises')}>All Exercises</a>
        </Link>
        <Link href="/workouts">
          <a className="pl-4" data-active={isActive('/workouts')}>All Workouts</a>
        </Link>
      </div>
    );
    right = (
      <div className="">
        <p className="inline-block">
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create/workout">
          <button className="pl-4">
            <a>Create Workout</a>
          </button>
        </Link>
        <Link href="/create/exercise">
          <button className="pl-4">
            <a>Create Exercise</a>
          </button>
        </Link>
        <button onClick={() => signOut()} className="pl-4">
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav className="flex justify-between p-10">
      {left}
      {right}
    </nav>
  );
}

export default Header