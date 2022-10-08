import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  width?: string;
  height?: string;
  isShown: boolean;
  toggle: () => void;
}

const Modal = (props: Props) => {
  const style = {
    width: `${props.width || "unset"}`,
    height: `${props.width || "unset"}`,
  }

  return (
    <>
    {props.isShown && (
      <div className="modal-overlay" onClick={ props.toggle }>
        <div className="modal-box" style={ style } onClick={ (e) => e.stopPropagation() }>
          {props.children}
        </div>
      </div>
    )}
  </>
  )
}

export default Modal