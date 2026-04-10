import { useInView } from "react-intersection-observer";

const useFadeIn = (threshold?: number, marginOffset?: number) => {
    const { inView, ref } = useInView({
        threshold: threshold || 0.15,
        triggerOnce: true,
        rootMargin: `${marginOffset || 0}px 0px`,
    });

    return { inView, ref };
}

export { useFadeIn };