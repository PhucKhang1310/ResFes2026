import { useEffect, useState } from "react";
const useCheckMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
    }, []);

    return { isMobile };
};

export { useCheckMobile };
