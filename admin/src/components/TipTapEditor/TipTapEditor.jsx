

import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

export default function TipTapEditor({ content, onChange, placeholder = "Start typing..." }) {
    const editor = useRef(null);

    const config = useMemo(() => {
        return {
            readonly: false,
            placeholder: placeholder,
            height: 350,
            toolbarAdaptive: false,
            toolbarSticky: true,
            spellcheck: true,
            theme: "default",
            style: {
                fontSize: "16px",
                lineHeight: "1.6",
            },
            uploader: {
                insertImageAsBase64URI: true,
            },
        };
    }, [placeholder]);

    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
        }}>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={newContent => onChange(newContent)}
                onChange={() => {}}
            />
        </div>
    );
}
