declare module 'virtual:last-year-gallery' {
    export interface GalleryImage {
        src: string;
        alt: string;
    }

    export const galleryImages: GalleryImage[];
}
