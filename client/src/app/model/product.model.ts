export interface ProductModel {
    _id: string,
    name: String,
    category_id: 
    {
        _id: String,
        category_name: String
    },
    price: number,
    image: String
}