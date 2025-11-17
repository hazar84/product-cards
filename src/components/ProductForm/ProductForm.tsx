import React, { useState } from 'react';
import { ProductFormData } from '../../types/product';
import './ProductForm.css';

// Создаем отдельный интерфейс для ошибок формы
interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  category?: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (formData: ProductFormData) => void;
  onCancel: () => void;
  submitButtonText?: string;
  title?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {
    title: '',
    description: '',
    price: 0,
    image: '',
    category: '',
  },
  onSubmit,
  onCancel,
  submitButtonText = 'Create Product',
  title = 'Create New Product'
}) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    
    // Очищаем ошибку при вводе
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image URL *</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={errors.image ? 'error' : ''}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;