import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProducts, deleteProduct, toggleLike } from '../../store/slices/productsSlice';
import { Product } from '../../types/product';
import ProductList from '../../components/ProductList/ProductList';
import './Products.css';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);
  
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = (id: number) => {
    dispatch(deleteProduct(id));
  };

  const handleToggleLike = (id: number) => {
    dispatch(toggleLike(id));
  };

  const filteredProducts = products.filter((product: Product) => {
    const matchesFilter = filter === 'all' || product.isLiked;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-page__header">
        <h1>Products</h1>
        <div className="products-page__controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-page__search"
          />
          <div className="products-page__filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Products
            </button>
            <button
              className={`filter-btn ${filter === 'favorites' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              Favorites
            </button>
          </div>
        </div>
      </div>
      
      <ProductList
        products={filteredProducts}
        onDeleteProduct={handleDeleteProduct}
        onToggleLike={handleToggleLike}
      />
    </div>
  );
};

export default Products;