import { Shop, Product, Category, Block, HouseNumber, Activity } from './types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://sentratamansari.com'}/api/v1`;

export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonResponse = await response.json();
      return jsonResponse.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Fixed search methods: remove /search from endpoint paths
  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/api/v1/products?q=${encodeURIComponent(query)}`);
  }

  async searchShops(query: string): Promise<Shop[]> {
    return this.request<Shop[]>(`/api/v1/shops?q=${encodeURIComponent(query)}`);
  }

  // Shop API methods
  async getShops(): Promise<Shop[]> {
    return this.request<Shop[]>('/api/v1/shops');
  }

  async getShop(id: string): Promise<Shop> {
    return this.request<Shop>(`/api/v1/shops/${id}`);
  }

  async createShop(data: Partial<Shop>): Promise<Shop> {
    return this.request<Shop>('/api/v1/shops', {
      method: 'POST',
      body: data,
    });
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
    return this.request<Shop>(`/api/v1/shops/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteShop(id: string): Promise<void> {
    return this.request<void>(`/api/v1/shops/${id}`, {
      method: 'DELETE',
    });
  }

  // Product API methods
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/v1/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/api/v1/products/${id}`);
  }

  async getProductsByShop(shopId: string): Promise<Product[]> {
    return this.request<Product[]>(`/api/v1/shops/${shopId}/products`);
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.request<Product>('/api/v1/products', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Category API methods
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/v1/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/api/v1/categories/${id}`);
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return this.request<Category>('/api/v1/categories', {
      method: 'POST',
      body: data,
    });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/api/v1/categories/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/api/v1/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Block API methods
  async getBlocks(): Promise<Block[]> {
    return this.request<Block[]>('/api/v1/blocks');
  }

  async getBlock(id: string): Promise<Block> {
    return this.request<Block>(`/api/v1/blocks/${id}`);
  }

  async createBlock(data: Partial<Block>): Promise<Block> {
    return this.request<Block>('/api/v1/blocks', {
      method: 'POST',
      body: data,
    });
  }

  async updateBlock(id: string, data: Partial<Block>): Promise<Block> {
    return this.request<Block>(`/api/v1/blocks/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteBlock(id: string): Promise<void> {
    return this.request<void>(`/api/v1/blocks/${id}`, {
      method: 'DELETE',
    });
  }

  // House Number API methods
  async getHouseNumbers(): Promise<HouseNumber[]> {
    return this.request<HouseNumber[]>('/api/v1/house-numbers');
  }

  async getHouseNumber(id: string): Promise<HouseNumber> {
    return this.request<HouseNumber>(`/api/v1/house-numbers/${id}`);
  }

  async createHouseNumber(data: Partial<HouseNumber>): Promise<HouseNumber> {
    return this.request<HouseNumber>('/api/v1/house-numbers', {
      method: 'POST',
      body: data,
    });
  }

  async updateHouseNumber(id: string, data: Partial<HouseNumber>): Promise<HouseNumber> {
    return this.request<HouseNumber>(`/api/v1/house-numbers/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteHouseNumber(id: string): Promise<void> {
    return this.request<void>(`/api/v1/house-numbers/${id}`, {
      method: 'DELETE',
    });
  }

  // Activity API methods
  async getActivities(): Promise<Activity[]> {
    return this.request<Activity[]>('/api/v1/activities');
  }

  async searchActivities(query: string): Promise<Activity[]> {
    return this.request<Activity[]>(`/api/v1/activities?q=${encodeURIComponent(query)}`);
  }

  async getActivity(id: string): Promise<Activity> {
    return this.request<Activity>(`/api/v1/activities/${id}`);
  }

  async createActivity(data: Partial<Activity>): Promise<Activity> {
    return this.request<Activity>('/api/v1/activities', {
      method: 'POST',
      body: data,
    });
  }

  async updateActivity(id: string, data: Partial<Activity>): Promise<Activity> {
    return this.request<Activity>(`/api/v1/activities/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteActivity(id: string): Promise<void> {
    return this.request<void>(`/api/v1/activities/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();