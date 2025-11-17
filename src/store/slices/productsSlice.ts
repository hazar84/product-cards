import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../../types/product';
import axios from 'axios';

// Загружаем ВСЕ продукты из localStorage
const loadAllProductsFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem('allProducts');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Сохраняем ВСЕ продукты в localStorage
const saveAllProductsToStorage = (products: Product[]) => {
  try {
    localStorage.setItem('allProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to localStorage:', error);
  }
};

const initialState: ProductsState = {
  items: loadAllProductsFromStorage(), // Загружаем из localStorage при инициализации
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (): Promise<Product[]> => {
    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data.map((product: any) => ({
      ...product,
      isLiked: false,
    }));

    // Загружаем текущие продукты из localStorage
    const currentProducts = loadAllProductsFromStorage();
    
    // Объединяем: берем текущие продукты, добавляем недостающие API продукты
    const existingIds = new Set(currentProducts.map(p => p.id));
    const newApiProducts = apiProducts.filter((product: Product) => !existingIds.has(product.id));
    
    return [...currentProducts, ...newApiProducts];
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const newProduct = {
        ...action.payload,
        id: Math.max(1000, Date.now()),
      };
      state.items.unshift(newProduct);
      saveAllProductsToStorage(state.items);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveAllProductsToStorage(state.items);
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
      saveAllProductsToStorage(state.items);
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.isLiked = !product.isLiked;
        saveAllProductsToStorage(state.items);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
        saveAllProductsToStorage(state.items); // Сохраняем после загрузки
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, toggleLike } = productsSlice.actions;
export default productsSlice.reducer;