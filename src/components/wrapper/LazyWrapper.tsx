import { useFadeIn } from "../../hook/useFadeIn";
import type { ReactNode } from "react";

type LazyWrapperProps = {
  children: ReactNode;
  id: string;
};

const LazyWrapper = ({ children, id }: LazyWrapperProps) => {
  const { ref, inView } = useFadeIn();
  return (
    <div id={id} className={`${inView ? "fade-in" : "opacity-0"}`} ref={ref}>
      {inView && children}
    </div>
  );
};

export default LazyWrapper;
