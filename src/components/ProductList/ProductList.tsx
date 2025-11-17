import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../types/product';
import './ProductList.css';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: number) => void;
  onToggleLike: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onDeleteProduct, 
  onToggleLike 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEditProduct = (id: number) => {
    // При редактировании из списка не передаем специальное состояние
    // По умолчанию вернемся на главную
    navigate(`/edit-product/${id}`, {
      state: { from: location.pathname } // Сохраняем текущий путь
    });
  };

  if (products.length === 0) {
    return (
      <div className="product-list__empty">
        No products found
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onDeleteProduct}
          onToggleLike={onToggleLike}
          onEdit={handleEditProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;