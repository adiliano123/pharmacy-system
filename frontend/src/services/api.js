import axios from 'axios';

const API_BASE_URL = 'http://localhost/pharmacy-system/api/modules';

export const inventoryAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/get_inventory.php`),
  addMedicine: (data) => axios.post(`${API_BASE_URL}/add_medicine.php`, data),
  dispense: (inventoryId, qty) => axios.post(`${API_BASE_URL}/dispense.php`, {
    inventory_id: inventoryId,
    qty: parseInt(qty)
  })
};

export const salesAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/get_sales.php`)
};
