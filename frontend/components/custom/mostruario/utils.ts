export const calculatePriceRange = (product: any): { minPrice: number; maxPrice: number } | null => {
    if (!product.product_variants || product.product_variants.length === 0) {
        return product.price ? { minPrice: product.price, maxPrice: product.price } : null;
    }

    const prices = product.product_variants
        .map((variant: any) => variant.price)
        .filter((price: number) => price != null);

    if (product.price) {
        prices.push(product.price);
    }

    if (prices.length === 0) {
        return null;
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { minPrice, maxPrice };
};
