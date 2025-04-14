"use client";

import { memo } from "react";
import Image from "next/image";

interface BackgroundEffectsProps {
    imageUrl?: string | null;
}

/**
 * 背景效果组件
 */
const BackgroundEffects = memo(({ imageUrl }: BackgroundEffectsProps) => {
    if (!imageUrl || imageUrl.trim() === '') {
        return (
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-900 to-black" />
        );
    }

    return (
        <div className="fixed inset-0 z-0">
            <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                priority
            />
        </div>
    );
});

BackgroundEffects.displayName = 'BackgroundEffects';

export default BackgroundEffects;