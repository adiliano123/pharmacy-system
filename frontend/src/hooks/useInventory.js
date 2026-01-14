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
        alert("Stock Added successfully!");
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
      .catch(() => alert("Error adding stock."));
  };

  const handleDispense = (inventoryId, qty) => {
    if (!qty || qty <= 0) return alert("Enter a valid quantity.");
    inventoryAPI.dispense(inventoryId, qty)
      .then(() => {
        alert("Dispensed successfully!");
        fetchInventory();
      })
      .catch(err => alert(err.response?.data?.message || "Error dispensing"));
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
    lowStockCount,
    outOfStockCount
  };
};
