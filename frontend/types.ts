// c:\Users\DSEHN\Documents\personal\strapi_danibosingeventos\frontend\types.ts

// For OrderItemsSelector and state in OrderPageClient
export interface SelectedOrderItem {
  id: number; // Numeric variant ID (for UI state)
  docId?: string; // Strapi documentId (string) for robust backend matching
  name: string;
  quantity: number;
  price: number; // Unit price
  image?: string; // Optional: for display
}


// Props for OrderPageClient component
export interface OrderPageClientProps {
  categories: PureCategory[]; // Changed to PureCategory
}

// Payload for submitting the order to the backend
export interface OrderPayloadItem {
  id: string | number; // Prefer documentId (string); fallback to numeric id
  quantity: number;
}

export interface OrderPayload {
  data: {
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    orderDetailsNotes?: string;
    orderItems: OrderPayloadItem[];
  };
}

// API response structure (simplified)
export interface OrderApiResponse {
  data: {
    id: number;
    attributes: {
      status: string;
      total_order_price: number;
      order_items: {
        id: number;
        quantity: number;
        unit_price: number;
        total_item_price: number;
        product_variant?: {
          data?: {
            id: number;
            attributes: {
              title: string;
            };
          };
        };
      }[];
      // other fields from your Strapi order schema
    };
  };
  meta?: any;
  error?: {
    status: number;
    name: string;
    message: string;
    details: any;
  };
}

// START PURE TYPES DEFINITION
export interface PureImage {
  id?: number;
  url?: string;
  alternativeText?: string | null;
  name?: string;
  width?: number;
  height?: number;
  // Add other fields if necessary based on your actual image data structure
}

export interface PureProductVariant {
  id: number;
  documentId?: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  image?: PureImage | null; 
  // other direct fields from your ProductVariant
}

export interface PureProduct {
  id: number;
  title?: string | null;
  description?: string | null;
  image?: PureImage | null;
  product_variants?: PureProductVariant[] | null;
  // other direct fields from your Product
}

export interface PureCategory {
  id: number;
  title?: string | null;
  description?: string | null;
  backgroundImage?: PureImage | null;
  products?: PureProduct[] | null;
  // other direct fields from your Category
}
// END PURE TYPES DEFINITION

// Props for OrderItemsSelector
export interface OrderItemsSelectorProps {
  categories: PureCategory[]; // Changed to PureCategory
  selectedItems: SelectedOrderItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedOrderItem[]>>;
}


export interface FormValues {
    numberOfPeople?: number;
    eventDuration: number;
    eventDetails: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
}

// Props for OrderForm
export interface OrderFormProps {
    formValues: FormValues;
    updateFormValues: (newValues: Partial<FormValues>) => void;
    isLoading: boolean;
}

// Props for OrderSummary
export interface OrderSummaryProps {
    selectedItems: SelectedOrderItem[];
    formValues: FormValues;
    totalPrice: number;
    isLoading: boolean;
}

// Props for OrderFinish
export interface OrderFinishProps {
    orderResult: OrderApiResponse | { error: string } | null;
    formValues: FormValues;
    selectedItems: SelectedOrderItem[];
    isLoading: boolean; // May be derived from orderResult as well
    error?: string | null;
}
