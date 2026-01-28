'use client';

import { useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ArticleGalleryProps {
    images: string[];
}

export function ArticleGallery({ images }: ArticleGalleryProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="my-8">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="relative flex-[0_0_80%] md:flex-[0_0_50%] min-w-0 cursor-pointer"
                            onClick={() => {
                                setIndex(i);
                                setOpen(true);
                            }}
                        >
                            <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                <Image
                                    src={src}
                                    alt={`Gallery image ${i + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 80vw, 50vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={images.map(src => ({ src }))}
            />
        </div>
    );
}
