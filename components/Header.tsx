import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="">
      <Link href="/" data-active={isActive("/")} className="bold pl-4">
        Feed
      </Link>
    </div>
  );

  let right = null;

  if (status == "loading") {
    right = (
      <div>
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div>
        <Link
          href="/api/auth/signin"
          data-active={isActive("/signup")}
          className="pl-4"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (session && session.user) {
    left = (
      <div className="">
        <Link href={"/"} data-active={isActive("/")} className="font-bold m-2">
          Feed
        </Link>
        <Link
          href={"/exercises"}
          data-active={isActive("/exercises")}
          className="m-2"
        >
          All Exercises
        </Link>
        <Link
          href={"/workouts"}
          data-active={isActive("/workouts")}
          className="m-2"
        >
          All Workouts
        </Link>
      </div>
    );
    right = (
      <div className="">
        <Link
          href={"/my-workouts"}
          data-active={isActive("/my-workouts")}
          className="inline-block cursor-pointer m-2"
        >
          {session.user.name} ({session.user.email})
        </Link>
        <Link
          href={"/create/workout"}
          data-active={isActive("/create/workout")}
          className="inline-block cursor-pointer m-2"
        >
          Create Workout
        </Link>
        <Link
          href={"/create/exercise"}
          data-active={isActive("/create/exercise")}
          className="inline-block cursor-pointer m-2"
        >
          Create Exercise
        </Link>
        <Link
          href={"/api/auth/signout"}
          onClick={(_) => signOut()}
          className="m-2"
        >
          Log out
        </Link>
      </div>
    );
  }

  return (
    <nav className="flex justify-between p-10">
      {left}
      {right}
    </nav>
  );
};

export default Header;
