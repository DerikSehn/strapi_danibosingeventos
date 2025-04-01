import { cn, getStrapiMedia } from '@/lib/utils';
import Image from 'next/image';


interface StrapiImageProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
  [x: string]: any;
}

export function StrapiImage({
  src,
  alt,
  height,
  width,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  const imageFallback = width && height ? `https://placehold.co/${width}x${height}` : null;

  return imageUrl || imageFallback ? (
    <Image
      src={imageUrl!}
      alt={alt}
      height={height} 
      width={width}
      className={cn(className)}
      {...rest}
    />
  ) : null;
}
