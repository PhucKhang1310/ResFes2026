import { useEffect, useState } from "react";

const useCheckMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        //adding resize event for debugging, but it is not necessary for the final version
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return { isMobile };
};

export { useCheckMobile };
