import { useFadeIn } from "../../hook/useFadeIn";

const LazyWrapper = ({ children, id }) => {
    const { ref, inView } = useFadeIn();
    return (
        <div
            id={id}
            className={`${inView ? "fade-in" : "opacity-0"}`}
            ref={ref}
        >
            {inView && children}
        </div>
    );
}

export default LazyWrapper;