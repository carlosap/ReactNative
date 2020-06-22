export const UPDATE_PRODUCT_LIST = 'UPDATE_PRODUCT_LIST';
export const UPDATE_SELECTED_PRODUCT_PRICE = 'UPDATE_SELECTED_PRODUCT_PRICE';
export const UPDATE_SELECTED_ITEM = 'UPDATE_SELECTED_ITEM';

export function updateProductList(productlist) {
    return {
        type: UPDATE_PRODUCT_LIST,
        payload: productlist,
    }
}

export function updateSelectedProductPrice(price) {
    return {
        type: UPDATE_SELECTED_PRODUCT_PRICE,
        payload: price,
    }
}

export function updateSelectedProduct(product) {
    return {
        type: UPDATE_SELECTED_ITEM,
        payload: product,
    }
}