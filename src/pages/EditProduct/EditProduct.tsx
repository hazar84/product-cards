import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateProduct } from '../../store/slices/productsSlice';
import { ProductFormData } from '../../types/product';
import ProductForm from '../../components/ProductForm/ProductForm';
import NotFound from '../NotFound/NotFound';
import './EditProduct.css';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);
  
  const productId = parseInt(id || '');
  const product = products.find(p => p.id === productId);

  // Определяем откуда пришел пользователь и куда вернуться
  const getReturnPath = () => {
    const state = location.state as { from?: string } | undefined;
    
    // Если явно указано, что пришли со страницы деталей
    if (state?.from === 'product-detail') {
      return `/products/${productId}`;
    }
    
    // Если пришли со страницы продукта (по прямому URL)
    if (location.state?.from?.startsWith('/products/')) {
      return location.state.from;
    }
    
    // По умолчанию возвращаем на главную
    return '/products';
  };

  if (!product) {
    return <NotFound />;
  }

  const handleSubmit = (formData: ProductFormData) => {
    const updatedProduct = {
      ...formData,
      id: productId,
      isLiked: product.isLiked, // Сохраняем текущее состояние лайка
    };
    
    dispatch(updateProduct(updatedProduct));
    // Возвращаем пользователя туда, откуда он пришел
    const returnPath = getReturnPath();
    navigate(returnPath, { 
      state: { productUpdated: true } // Можно передать дополнительное состояние
    });
  };

  const handleCancel = () => {
    // При отмене также возвращаем туда, откуда пришли
    const returnPath = getReturnPath();
    navigate(returnPath);
  };

  // Преобразуем продукт в форму данных
  const initialFormData: ProductFormData = {
    title: product.title,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
  };

  return (
    <div className="edit-product">
      <div className="edit-product__header">
        <h1>Edit Product</h1>
        <button onClick={handleCancel} className="back-button">
          ← Back to Products
        </button>
      </div>
      
      <ProductForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Update Product"
        title="Edit Product"
      />
    </div>
  );
};

export default EditProduct;