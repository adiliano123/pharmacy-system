import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import Header from "./components/Layout/Header";
import TabNavigation from "./components/Layout/TabNavigation";
import UserProfile from "./components/Layout/UserProfile";
import HomePage from "./components/Dashboard/HomePage";
import DashboardCards from "./components/Dashboard/DashboardCards";
import AddStockForm from "./components/Inventory/AddStockForm";
import SearchPanel from "./components/Inventory/SearchPanel";
import InventoryTable from "./components/Inventory/InventoryTable";
import SalesTable from "./components/Sales/SalesTable";
import { useInventory } from "./hooks/useInventory";
import { useSales } from "./hooks/useSales";
import { generateReceipt } from "./utils/pdfGenerator";
import "./App.css";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState('home');

  const {
    data: inventoryData,
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
  } = useInventory(view);

  const { salesData, totalRevenue } = useSales(view);

  // Calculate total sales and items
  const totalSales = salesData.length;
  const totalItems = salesData.reduce((acc, sale) => acc + parseInt(sale.quantity_sold || 0), 0);
  
  // Calculate total stock value and quantity
  const totalStockValue = inventoryData.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 0)), 0);
  const totalStockQuantity = inventoryData.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: '#fff', fontSize: '24px' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div style={{ 
      padding: '40px 30px', 
      fontFamily: "'Inter', 'Segoe UI', sans-serif", 
      maxWidth: '1400px', 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.98)', 
        borderRadius: '24px', 
        padding: '40px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 100px rgba(102, 126, 234, 0.2)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <Header />
          <UserProfile />
        </div>
        
        <TabNavigation view={view} setView={setView} />

        {view === 'home' && (
          <HomePage 
            totalRevenue={totalRevenue}
            lowStockCount={lowStockCount}
            outOfStockCount={outOfStockCount}
            totalSales={totalSales}
            totalItems={totalItems}
            totalStockValue={totalStockValue}
            totalStockQuantity={totalStockQuantity}
            inventoryCount={inventoryData.length}
          />
        )}

        {view === 'dashboard' && (
          <DashboardCards 
            totalRevenue={totalRevenue} 
            lowStockCount={lowStockCount} 
            outOfStockCount={outOfStockCount} 
          />
        )}

        {view === 'inventory' && (
          <>
            <DashboardCards 
              totalRevenue={totalRevenue} 
              lowStockCount={lowStockCount} 
              outOfStockCount={outOfStockCount} 
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
              <AddStockForm 
                formData={formData} 
                setFormData={setFormData} 
                handleSubmit={handleSubmit} 
              />
              <SearchPanel 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                resultCount={filteredData.length} 
              />
            </div>
            <InventoryTable 
              filteredData={filteredData} 
              handleDispense={handleDispense}
              handleUpdate={handleUpdate}
            />
          </>
        )}

        {view === 'sales' && (
          <>
            <DashboardCards 
              totalRevenue={totalRevenue} 
              lowStockCount={lowStockCount} 
              outOfStockCount={outOfStockCount} 
            />
            <SalesTable 
              salesData={salesData} 
              generateReceipt={generateReceipt} 
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
