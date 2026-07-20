import Image from "next/image";
import type { ReactNode } from "react";

export interface AuthLayoutImage {
  src: string;
  alt: string;
  /** Intrinsic pixel width of the source file — lets the image keep its aspect ratio. */
  width: number;
  /** Intrinsic pixel height of the source file. */
  height: number;
}

export interface AuthLayoutProps {
  image: AuthLayoutImage;
  /**
   * Visually-hidden text carrying the informational content baked into the
   * image (headline, trust messaging) so screen-reader users get the same
   * information sighted users get from the artwork, not just a terse alt.
   */
  srOnlyDescription?: ReactNode;
  children: ReactNode;
}

/**
 * Split-screen auth shell.
 *
 * Exact 50 / 50 split (CSS grid): the brand artwork occupies the left half,
 * the form the right. The image renders at the full width of its column with
 * its natural height (w-full / h-auto), so the WHOLE composition is shown —
 * nothing is clipped. Because the source art is tall/portrait, the image
 * column can be taller than the form; the form is vertically centred in its
 * half so the extra space reads as balanced whitespace rather than a gap.
 *
 * Below lg the columns stack (image on top, full, then form). A light brand
 * background fills any area beside the shorter column and matches the image's
 * own background so the seam is invisible.
 *
 * Accessibility: the image carries meaningful alt text, and the copy baked
 * into the artwork (headline + trust points) is mirrored in a visually-hidden
 * block so assistive-technology users receive the same information.
 */
export function AuthLayout({ image, srOnlyDescription, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-ds-brand-50 lg:grid-cols-2">
      <div className="relative">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="h-auto w-full"
        />
        {srOnlyDescription ? <p className="nh-visually-hidden">{srOnlyDescription}</p> : null}
      </div>
      <div className="flex items-start justify-center bg-background px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
        {children}
      </div>
    </div>
  );
}
