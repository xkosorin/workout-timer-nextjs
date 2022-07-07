import { ReactNode } from "react"
import Header from "./Header";

type Props = {
  children: ReactNode;
}

const Layout: React.FC<Props> = (props: Props) => (
  <div>
    <Header />
    <div className="w-full md:w-10/12 m-auto">
      { props.children }
    </div>
 </div>
)

export default Layout;