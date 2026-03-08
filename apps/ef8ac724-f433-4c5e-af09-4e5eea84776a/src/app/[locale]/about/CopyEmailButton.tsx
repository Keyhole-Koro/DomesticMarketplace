"use client";

import { useState } from "react";
import styles from "./page.module.css";

export function CopyEmailButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("hello@example.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.copyCommand}>
            <code>$ pbcopy &lt; email.txt</code>
            <button
                className={styles.copyBtn}
                aria-label="Copy Email"
                onClick={handleCopy}
            >
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    );
}
