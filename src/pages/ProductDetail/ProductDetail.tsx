import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProducts } from '../../store/slices/productsSlice';
import { Product } from '../../types/product';
import NotFound from '../NotFound/NotFound';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  
  const productId = parseInt(id || '');
  
  useEffect(() => {
    // Загружаем продукты при монтировании компонента
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Проверяем валидность ID
  if (isNaN(productId)) {
    return <NotFound />;
  }

  const product = products.find((p: Product) => p.id === productId);

  // Показываем загрузку пока данные не получены
  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  // Если загрузка завершена и продукт не найден, показываем 404
  if (!loading && !product) {
    return <NotFound />;
  }

  const handleEdit = () => {
    // Передаем состояние, что пришли со страницы деталей
    navigate(`/edit-product/${productId}`, { 
      state: { from: 'product-detail' } 
    });
  };

  // Если продукт найден, показываем его
  return (
    <div className="product-detail">
      <div className="product-detail__header">
        <button onClick={() => navigate('/products')} className="back-button">
          ← Back to Products
        </button>
        <button onClick={handleEdit} className="edit-button">
          Edit Product
        </button>
      </div>

      <div className="product-detail__content">
        <div className="product-detail__image">
          <img src={product!.image} alt={product!.title} />
        </div>
        
        <div className="product-detail__info">
          <h1 className="product-detail__title">{product!.title}</h1>
          <p className="product-detail__category">{product!.category}</p>
          <p className="product-detail__price">${product!.price}</p>
          <p className="product-detail__description">{product!.description}</p>
          
          <div className="product-detail__meta">
            <span className={`product-detail__like ${product!.isLiked ? 'product-detail__like--active' : ''}`}>
              {product!.isLiked ? '♥ Liked' : '♡ Not liked'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;