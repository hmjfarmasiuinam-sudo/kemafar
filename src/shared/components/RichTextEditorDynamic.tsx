'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { RichTextEditor as RichTextEditorType } from './RichTextEditor';

// Dynamically import the heavy TipTap editor
// This reduces initial bundle size by ~400KB
const RichTextEditorDynamic = dynamic<ComponentProps<typeof RichTextEditorType>>(
    () => import('./RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 px-2 py-2 h-12 animate-pulse" />
                <div className="h-[500px] bg-gray-100 animate-pulse" />
            </div>
        ),
    }
);

export { RichTextEditorDynamic as RichTextEditor };
