import { useSession } from "next-auth/react";
import { ReactNode } from "react"

type Props = {
  children: ReactNode;
}

const Auth: React.FC<Props> = (props: Props) => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <>
        <h2>You need to log in.</h2>
        <p>In order to see this page you have to be logged in!</p>
      </>
    )
  }

  return (  
    <>
      { props.children }
    </>
  )
}

export default Auth;