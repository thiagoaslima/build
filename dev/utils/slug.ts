import slug from 'slug/slug-browser';

export function _slug(text: string): string {
    return slug(text, {
        replacement: '-',      // replace spaces with replacement 
        symbols: true,         // replace unicode symbols or not 
        remove: null,          // (optional) regex to remove characters 
        lower: true
    })
}