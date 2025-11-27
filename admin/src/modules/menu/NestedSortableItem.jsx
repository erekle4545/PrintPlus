"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function NestedSortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: "#fff",
        marginBottom: "6px",
        borderRadius: "6px",
        padding: "6px 10px",
        cursor: "grab",
        boxShadow: "0 2px 5px rgba(0,0,0,0.12)"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}
