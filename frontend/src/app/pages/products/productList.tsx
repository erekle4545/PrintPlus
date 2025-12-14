import ProductCard from '@/shared/components/cart/productCard';

const products = [
    {
        id: 1,
        name: 'ტანიერი',
        price: 20,
        image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        discount: 10,
    },
];

export default function ProductList() {
    return (
        <div className="row">
            {products.map(product => (
                <div className="col-md-4" key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
