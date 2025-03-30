import { createContext, useState } from "react";

export const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState("Thống Kê");

    return (
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
};
