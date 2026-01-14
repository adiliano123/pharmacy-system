import { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';

export const useSales = (view) => {
  const [salesData, setSalesData] = useState([]);

  const fetchSales = () => {
    salesAPI.getAll()
      .then(res => setSalesData(res.data))
      .catch(err => console.error("Error fetching sales:", err));
  };

  useEffect(() => { 
    if (view === 'sales') fetchSales();
  }, [view]);

  const totalRevenue = salesData.reduce((acc, curr) => acc + parseFloat(curr.total_revenue || 0), 0);

  return {
    salesData,
    totalRevenue,
    fetchSales
  };
};
