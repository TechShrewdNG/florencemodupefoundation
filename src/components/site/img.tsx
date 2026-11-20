import Image, { type ImageProps } from "next/image";

/** next/image that falls back to unoptimized for arbitrary external URLs pasted into the CMS. */
export function Img(props: ImageProps & { src: string }) {
  const { src, alt, ...rest } = props;
  if (!src) return null;
  const optimizable = src.startsWith("/") || /\.public\.blob\.vercel-storage\.com\//.test(src);
  return <Image src={src} alt={alt} unoptimized={!optimizable} {...rest} />;
}
