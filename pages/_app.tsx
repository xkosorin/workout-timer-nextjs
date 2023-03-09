import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

function WorkoutTimer({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  useEffect(() => {
    const use = async () => {
      // @ts-ignore
      (await import("tw-elements")).default;
    };
    use();
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default WorkoutTimer;
