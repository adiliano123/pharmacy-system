import { useState } from "react";
import Header from "./components/Layout/Header";
import TabNavigation from "./components/Layout/TabNavigation";
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
  const [view, setView] = useState('inventory');

  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    handleSubmit,
    handleDispense,
    lowStockCount,
    outOfStockCount
  } = useInventory(view);

  const { salesData, totalRevenue } = useSales(view);

  return (
    <div style={{ 
      padding: '40px 30px', 
      fontFamily: "'Inter', 'Segoe UI', sans-serif", 
      maxWidth: '1400px', 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.98)', 
        borderRadius: '24px', 
        padding: '40px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
      }}>
        <Header />
        <TabNavigation view={view} setView={setView} />
        <DashboardCards 
          totalRevenue={totalRevenue} 
          lowStockCount={lowStockCount} 
          outOfStockCount={outOfStockCount} 
        />

        {view === 'inventory' ? (
          <>
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
            />
          </>
        ) : (
          <SalesTable 
            salesData={salesData} 
            generateReceipt={generateReceipt} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
