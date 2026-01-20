import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

export const useInventory = (view) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '', 
    generic_name: '', 
    category: '', 
    batch_number: '', 
    quantity: '', 
    expiry_date: '', 
    price: ''
  });

  const fetchInventory = () => {
    inventoryAPI.getAll()
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching data:", err));
  };

  useEffect(() => { 
    if (view === 'inventory') fetchInventory();
  }, [view]);

  const handleSubmit = (e) => {
    e.preventDefault();
    inventoryAPI.addMedicine(formData)
      .then(() => {
        alert("✓ Stock added successfully!");
        fetchInventory();
        setFormData({ 
          name: '', 
          generic_name: '', 
          category: '', 
          batch_number: '', 
          quantity: '', 
          expiry_date: '', 
          price: '' 
        });
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || "Error adding stock. Please check all fields.";
        alert("❌ " + errorMsg);
        console.error("Add stock error:", error);
      });
  };

  const handleDispense = (inventoryId, qty) => {
    if (!qty || qty <= 0) {
      alert("❌ Please enter a valid quantity.");
      return;
    }
    
    const quantity = parseInt(qty);
    if (isNaN(quantity)) {
      alert("❌ Quantity must be a number.");
      return;
    }
    
    inventoryAPI.dispense(inventoryId, quantity)
      .then((response) => {
        const data = response.data;
        alert(`✓ Dispensed successfully!\n\nQuantity: ${data.quantity_dispensed}\nRevenue: TSh ${data.total_revenue.toLocaleString()}\nRemaining Stock: ${data.remaining_stock}`);
        fetchInventory();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || "Error dispensing medicine. Please try again.";
        alert("❌ " + errorMsg);
        console.error("Dispense error:", err);
      });
  };

  const handleUpdate = (inventoryId, updatedData) => {
    inventoryAPI.updateMedicine(inventoryId, updatedData)
      .then(() => {
        alert("✓ Stock updated successfully!");
        fetchInventory();
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || "Error updating stock.";
        alert("❌ " + errorMsg);
        console.error("Update stock error:", error);
      });
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.generic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = data.filter(item => item.quantity <= 10 && item.quantity > 0).length;
  const outOfStockCount = data.filter(item => item.quantity <= 0).length;

  return {
    data,
    filteredData,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    handleSubmit,
    handleDispense,
    handleUpdate,
    lowStockCount,
    outOfStockCount
  };
};
