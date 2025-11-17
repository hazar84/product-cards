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
  submitButtonText = 'Create Product'
}) => {
  // Конвертируем initialData для использования строки в price
  const initialFormData = {
    ...initialData,
    price: initialData.price === 0 ? '' : initialData.price.toString(),
  };

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    image: string;
    category: string;
  }>(initialFormData);
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const priceValue = parseFloat(formData.price);
    if (!formData.price || priceValue <= 0 || isNaN(priceValue)) {
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
      // Конвертируем price в число перед отправкой
      const submitData: ProductFormData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value, // Всегда сохраняем как строку
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
            placeholder="0.00"
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