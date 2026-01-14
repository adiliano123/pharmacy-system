export const API_CONFIG = {
  BASE_URL: 'http://localhost/pharmacy-system/api/modules',
  ENDPOINTS: {
    INVENTORY: '/get_inventory.php',
    ADD_MEDICINE: '/add_medicine.php',
    DISPENSE: '/dispense.php',
    SALES: '/get_sales.php'
  }
};

export const STOCK_THRESHOLDS = {
  LOW_STOCK: 10,
  OUT_OF_STOCK: 0
};

export const RECEIPT_CONFIG = {
  BUSINESS_NAME: 'City Central Pharmacy & Wellness',
  HEADER_COLOR: [44, 62, 80],
  TABLE_HEADER_COLOR: [52, 152, 219]
};
