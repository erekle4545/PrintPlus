import { useContext } from "react";
import { ContactContext, ContactContextType } from "@/context/ContactContext";

export const useContact = (): ContactContextType => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error("useContact must be used within ContactProvider");
    }
    return context;
};