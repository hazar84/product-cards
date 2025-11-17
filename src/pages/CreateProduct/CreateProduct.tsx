import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { addProduct } from '../../store/slices/productsSlice';
import { Product, ProductFormData } from '../../types/product';
import ProductForm from '../../components/ProductForm/ProductForm';
import './CreateProduct.css';

const CreateProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (formData: ProductFormData) => {
    // Просто передаем данные, ID сгенерируется в slice
    const newProduct: Omit<Product, 'id'> = {
      ...formData,
      isLiked: false,
    };
    
    dispatch(addProduct(newProduct as Product));
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="create-product">
      <div className="create-product__header">
        <h1>Create New Product</h1>
        <button onClick={handleCancel} className="back-button">
          ← Back to Products
        </button>
      </div>
      
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Create Product"
        title="Create New Product"
      />
    </div>
  );
};

export default CreateProduct;