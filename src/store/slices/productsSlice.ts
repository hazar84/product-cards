import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../../types/product';
import axios from 'axios';

// Загружаем продукты из localStorage
const loadProductsFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Сохраняем продукты в localStorage
const saveProductsToStorage = (products: Product[]) => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to localStorage:', error);
  }
};

const initialState: ProductsState = {
  items: loadProductsFromStorage(),
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (): Promise<Product[]> => {
    // Если продукты уже есть в localStorage, используем их
    const existingProducts = loadProductsFromStorage();
    if (existingProducts.length > 0) {
      return existingProducts;
    }

    // Если продуктов нет, загружаем с API
    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data.map((product: any) => ({
      ...product,
      isLiked: false,
    }));

    return apiProducts;
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
      saveProductsToStorage(state.items);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveProductsToStorage(state.items);
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
      saveProductsToStorage(state.items);
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.isLiked = !product.isLiked;
        saveProductsToStorage(state.items);
      }
    },
    // Добавляем action для принудительной перезагрузки с API
    reloadProductsFromAPI: (state) => {
      state.items = [];
      saveProductsToStorage(state.items);
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
        saveProductsToStorage(state.items);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, toggleLike, reloadProductsFromAPI } = productsSlice.actions;
export default productsSlice.reducer;