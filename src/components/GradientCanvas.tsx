"use client";

import { useRef, useEffect, useState } from "react";
import { Gradient } from "whatamesh";

export function triggerOnIdle(callback: () => void) {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        return window.requestIdleCallback(callback);
    }
    return setTimeout(callback, 1);
}

const COLORS = {
    hex: ["#ffad66", "#ff63b2", "#ad5cff", "#ccbeee"],
};

export function GradientCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradientRef = useRef<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (canvasRef.current && overlayRef.current && !isInitialized) {
            const initGradient = async () => {
                const gradient = new Gradient();
                await gradient.initGradient("#gradient-canvas");

                gradientRef.current = gradient;
                setIsInitialized(true);

                // Fade out the overlay
                if (overlayRef.current) {
                    overlayRef.current.style.opacity = "0";
                    setTimeout(() => {
                        if (overlayRef.current) {
                            overlayRef.current.style.display = "none";
                        }
                    }, 1000);
                }
            };

            triggerOnIdle(initGradient);
        }
    }, [isInitialized]);

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 -z-10 transition-opacity duration-1000"
                style={{
                    background: `linear-gradient(45deg, ${COLORS.hex.join(', ')})`,
                    opacity: 0.5,
                }}
            />
            <canvas
                id="gradient-canvas"
                ref={canvasRef}
                style={{
                    "--gradient-color-1": COLORS.hex[0],
                    "--gradient-color-2": COLORS.hex[1],
                    "--gradient-color-3": COLORS.hex[2],
                    "--gradient-color-4": COLORS.hex[3],
                } as React.CSSProperties}
                className="fixed inset-0 -z-20 w-full h-full opacity-50"
            />
        </>
    );
} 