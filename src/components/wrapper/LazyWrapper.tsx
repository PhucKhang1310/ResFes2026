import { useFadeIn } from "../../hook/useFadeIn";

const LazyWrapper = ({ children }) => {
    const { ref, inView } = useFadeIn();
    return (
        <div
            className={`${inView ? "fade-in" : "opacity-0"}`}
            ref={ref}
        >
            {inView && children}
        </div>
    );
}

export default LazyWrapper;