import { useBoolean } from "usehooks-ts";

const useModal = () => {
  const { value: isShown, toggle } = useBoolean(false);

  return { isShown, toggle }
}

export default useModal;