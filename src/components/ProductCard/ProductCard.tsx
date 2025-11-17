import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onToggleLike: (id: number) => void;
  onEdit?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onDelete, 
  onToggleLike, 
  onEdit 
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.product-card__actions')) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(product.id);
    } else {
      navigate(`/edit-product/${product.id}`);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card__image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title">{truncateText(product.title, 50)}</h3>
        <p className="product-card__description">
          {truncateText(product.description, 100)}
        </p>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price}</span>
          <span className="product-card__category">{product.category}</span>
        </div>
      </div>
      <div className="product-card__actions">
        <button
          className={`product-card__like ${product.isLiked ? 'product-card__like--active' : ''}`}
          onClick={() => onToggleLike(product.id)}
          aria-label={product.isLiked ? 'Remove like' : 'Add like'}
        >
          ♥
        </button>
        <button
          className="product-card__edit"
          onClick={handleEditClick}
          aria-label="Edit product"
        >
          ✎
        </button>
        <button
          className="product-card__delete"
          onClick={() => onDelete(product.id)}
          aria-label="Delete product"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ProductCard;