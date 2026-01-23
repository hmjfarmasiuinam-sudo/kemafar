'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';

// Fix for react-markdown-editor-lite: Make React globally available
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as typeof window & { React: typeof React }).React = React;
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded-lg p-4">Loading editor...</div>,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (data: { text: string; html: string }) => void;
  placeholder?: string;
  height?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, height = '500px' }: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="border border-gray-300 rounded-lg p-4">Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MdEditor
        value={value}
        style={{ height }}
        renderHTML={(text) => {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const MarkdownIt = require('markdown-it');
          const md = new MarkdownIt() as { render: (text: string) => string };
          return md.render(text);
        }}
        onChange={onChange}
        placeholder={placeholder || 'Write your content in Markdown...'}
      />
    </div>
  );
}
