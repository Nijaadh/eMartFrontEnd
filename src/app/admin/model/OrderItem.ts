export interface OrderItem {
    item: {
      id: number;
      name: string;
      imageUrl?: string;
      unitPrice: number;
      discount?: number;
      category?: string;
      subCategoryName?: string;
    };
    quantity: number;
  }