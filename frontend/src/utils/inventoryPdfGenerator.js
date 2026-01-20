import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateInventoryDetail = (item) => {
  const doc = new jsPDF();
  
  // Header with gradient effect
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("INVENTORY ITEM DETAILS", 105, 22, { align: "center" });
  
  // Medicine name banner
  doc.setFillColor(118, 75, 162);
  doc.rect(0, 35, 210, 15, 'F');
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(item.name.toUpperCase(), 105, 45, { align: "center" });
  
  // Reset colors for content
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Basic Information Section
  let yPos = 65;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 126, 234);
  doc.text("📋 BASIC INFORMATION", 15, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  const basicInfo = [
    ['Medicine Name:', item.name],
    ['Generic Name:', item.generic_name || 'N/A'],
    ['Category:', item.category || 'N/A'],
    ['Batch Number:', item.batch_number]
  ];
  
  doc.autoTable({
    startY: yPos,
    body: basicInfo,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 }
    }
  });
  
  // Stock Information Section
  yPos = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 126, 234);
  doc.text("📦 STOCK INFORMATION", 15, yPos);
  
  yPos += 10;
  const stockStatus = item.quantity <= 0 ? 'OUT OF STOCK' : 
                      item.quantity <= 10 ? 'LOW STOCK' : 'IN STOCK';
  const statusColor = item.quantity <= 0 ? [229, 62, 62] : 
                      item.quantity <= 10 ? [237, 137, 54] : [72, 187, 120];
  
  const stockInfo = [
    ['Current Quantity:', `${item.quantity} units`],
    ['Stock Status:', stockStatus],
    ['Price Per Unit:', `TSh ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Total Stock Value:', `TSh ${(item.quantity * parseFloat(item.price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
  ];
  
  doc.autoTable({
    startY: yPos,
    body: stockInfo,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 }
    },
    didParseCell: function(data) {
      if (data.row.index === 1 && data.column.index === 1) {
        data.cell.styles.textColor = statusColor;
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  // Expiry Information Section
  yPos = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 126, 234);
  doc.text("📅 EXPIRY INFORMATION", 15, yPos);
  
  yPos += 10;
  const expiryDate = new Date(item.expiry_date);
  const daysUntilExpiry = item.days_until_expiry || 0;
  const expiryStatus = daysUntilExpiry < 0 ? 'EXPIRED' : 
                       daysUntilExpiry <= 30 ? 'EXPIRING SOON' : 'VALID';
  const expiryColor = daysUntilExpiry < 0 ? [229, 62, 62] : 
                      daysUntilExpiry <= 30 ? [237, 137, 54] : [72, 187, 120];
  
  const expiryInfo = [
    ['Expiry Date:', expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
    ['Days Until Expiry:', daysUntilExpiry < 0 ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : `${daysUntilExpiry} days remaining`],
    ['Expiry Status:', expiryStatus]
  ];
  
  doc.autoTable({
    startY: yPos,
    body: expiryInfo,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 }
    },
    didParseCell: function(data) {
      if (data.row.index === 2 && data.column.index === 1) {
        data.cell.styles.textColor = expiryColor;
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  // Timestamps Section
  if (item.created_at) {
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(102, 126, 234);
    doc.text("🕐 RECORD INFORMATION", 15, yPos);
    
    yPos += 10;
    const timestampInfo = [
      ['Added On:', new Date(item.created_at).toLocaleString('en-US')],
      ['Last Updated:', item.updated_at ? new Date(item.updated_at).toLocaleString('en-US') : 'N/A']
    ];
    
    doc.autoTable({
      startY: yPos,
      body: timestampInfo,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 130 }
      }
    });
  }
  
  // Summary Box
  yPos = doc.lastAutoTable.finalY + 20;
  doc.setFillColor(247, 250, 252);
  doc.roundedRect(15, yPos, 180, 35, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(45, 55, 72);
  doc.text("QUICK SUMMARY", 105, yPos + 10, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 85, 104);
  const summaryText = `${item.quantity} units available • TSh ${parseFloat(item.price).toLocaleString()} per unit • ${stockStatus} • ${expiryStatus}`;
  doc.text(summaryText, 105, yPos + 20, { align: "center" });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(113, 128, 150);
  doc.text("Generated by Pharmacy Management System", 105, pageHeight - 20, { align: "center" });
  doc.text(`Generated on: ${new Date().toLocaleString('en-US')}`, 105, pageHeight - 15, { align: "center" });
  doc.text("City Central Pharmacy & Wellness", 105, pageHeight - 10, { align: "center" });
  
  // Save the PDF
  const fileName = `Inventory_${item.name.replace(/\s+/g, '_')}_${item.batch_number}.pdf`;
  doc.save(fileName);
};

export const generateFullInventoryReport = (inventoryData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("COMPLETE INVENTORY REPORT", 105, 22, { align: "center" });
  
  // Report date
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 105, 30, { align: "center" });
  
  // Summary statistics
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INVENTORY SUMMARY", 15, 50);
  
  const totalItems = inventoryData.length;
  const totalQuantity = inventoryData.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + (parseInt(item.quantity || 0) * parseFloat(item.price || 0)), 0);
  const lowStock = inventoryData.filter(item => item.quantity <= 10 && item.quantity > 0).length;
  const outOfStock = inventoryData.filter(item => item.quantity <= 0).length;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Total Items: ${totalItems} | Total Units: ${totalQuantity} | Total Value: TSh ${totalValue.toLocaleString()}`, 15, 58);
  doc.text(`Low Stock: ${lowStock} | Out of Stock: ${outOfStock}`, 15, 64);
  
  // Inventory table
  const tableData = inventoryData.map(item => [
    item.name,
    item.batch_number,
    item.quantity,
    `TSh ${parseFloat(item.price).toLocaleString()}`,
    item.quantity <= 0 ? 'OUT' : item.quantity <= 10 ? 'LOW' : 'OK',
    new Date(item.expiry_date).toLocaleDateString()
  ]);
  
  doc.autoTable({
    startY: 75,
    head: [['Medicine', 'Batch', 'Qty', 'Price', 'Status', 'Expiry']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [102, 126, 234],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 30 }
    },
    didParseCell: function(data) {
      if (data.column.index === 4 && data.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'OUT') {
          data.cell.styles.textColor = [229, 62, 62];
          data.cell.styles.fontStyle = 'bold';
        } else if (status === 'LOW') {
          data.cell.styles.textColor = [237, 137, 54];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [72, 187, 120];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(113, 128, 150);
  doc.text("City Central Pharmacy & Wellness - Inventory Report", 105, pageHeight - 10, { align: "center" });
  
  doc.save(`Full_Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
