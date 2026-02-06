"use client";

import React, { memo } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/lib/utils";

interface LatexContentProps {
    content: string;
    images?: string[]; // Array of Base64 images to resolve [IMG_X]
    block?: boolean;
    className?: string;
}

const LatexContent = memo(({ content, images = [], block = false, className }: LatexContentProps) => {
    // If content is empty/null, return null
    if (!content) return null;

    // First replace placeholders like [IMG_0] with actual <img> tags if images are provided
    let processedContent = content;
    if (images && images.length > 0) {
        processedContent = content.replace(/\[IMG_(\d+)\]/g, (match, p1) => {
            const idx = parseInt(p1);
            if (images[idx]) {
                return `<img src="${images[idx]}" style="max-width: 180px; max-height: 180px; object-fit: contain; margin: 10px auto; display: block;" alt="Question image ${idx}" />`;
            }
            return match;
        });
    }

    // Simple parser to separate LaTeX from text
    const parts = processedContent.split(/(\$[^$]+\$)/g);

    return (
        <span
            className={cn("latex-content", block ? "block" : "inline", className)}
            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
        >
            {parts.map((part, index) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const math = part.slice(1, -1);
                    try {
                        const html = katex.renderToString(math, {
                            throwOnError: false,
                            displayMode: block,
                            output: "html",
                        });
                        return (
                            <span
                                key={index}
                                dangerouslySetInnerHTML={{ __html: html }}
                                className="mx-0.5"
                            />
                        );
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return (
                            <span key={index} className="text-red-500 font-mono text-xs">
                                {part}
                            </span>
                        );
                    }
                }
                return (
                    <span
                        key={index}
                        dangerouslySetInnerHTML={{ __html: part }}
                    />
                );
            })}
        </span>
    );
});

LatexContent.displayName = "LatexContent";

export { LatexContent };
