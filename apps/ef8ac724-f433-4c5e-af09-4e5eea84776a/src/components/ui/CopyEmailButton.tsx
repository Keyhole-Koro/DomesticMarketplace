"use client";

import { useState } from "react";
import styles from "./CopyEmailButton.module.css";

export function CopyEmailButton() {
    const [copied, setCopied] = useState(false);
    const email = "kmc2438@kamiyama.ac.jp";

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
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
