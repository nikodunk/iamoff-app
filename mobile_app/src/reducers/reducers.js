export function items(state = [], action) {
    switch (action.type) {
        case 'ITEMS_FETCH_DATA_SUCCESS':
            return action.items;  
        case 'ITEMS_FETCH_DATA_LOADING':
            return null
        default:
            return state;
    }
}
