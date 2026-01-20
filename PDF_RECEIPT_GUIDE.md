# 📄 PDF Receipt Guide

## 🎯 How to Download PDF Receipts

### Step 1: Make a Sale
1. Go to **Inventory** tab
2. Find a medicine in the table
3. Enter quantity to dispense
4. Click **"💊 Dispense"** button
5. Sale is recorded

### Step 2: View Sales
1. Go to **Sales** tab
2. You'll see all transactions in the table

### Step 3: Download Receipt
1. Find the sale you want
2. Click the **"🖨️ Receipt"** button
3. PDF automatically downloads to your computer

## 📋 What's Included in the PDF

### Header Section (Dark Blue Background)
```
┌─────────────────────────────────────────┐
│                                         │
│        PHARMACY RECEIPT                 │
│                                         │
└─────────────────────────────────────────┘
```

### Business Information
- **Business Name:** City Central Pharmacy & Wellness
- **Transaction ID:** #PH-00X (unique ID)
- **Date & Time:** Full timestamp of sale

### Transaction Details Table
```
┌──────────────┬────────┬─────┬────────────┬──────────────┐
│ Medicine     │ Batch  │ Qty │ Unit Price │ Total        │
├──────────────┼────────┼─────┼────────────┼──────────────┤
│ Aspirin      │ B001   │ 10  │ TSh 2,500  │ TSh 25,000   │
└──────────────┴────────┴─────┴────────────┴──────────────┘
```

### Total Amount (Bold)
```
Total Amount: TSh 25,000.00
```

### Footer Message
```
Thank you for your visit. Get well soon!
```

## 📊 Example Receipt

```
═══════════════════════════════════════════════════════
                 PHARMACY RECEIPT
═══════════════════════════════════════════════════════

City Central Pharmacy & Wellness
Transaction ID: #PH-001
Date: January 15, 2026, 10:30:45 AM

───────────────────────────────────────────────────────
Medicine Name    Batch    Qty    Unit Price    Total
───────────────────────────────────────────────────────
Paracetamol      B123     20     TSh 1,500     TSh 30,000
───────────────────────────────────────────────────────

                    Total Amount: TSh 30,000.00

        Thank you for your visit. Get well soon!
═══════════════════════════════════════════════════════
```

## 🎨 PDF Features

### Design Elements:
- ✅ Professional header with dark blue background
- ✅ Clean table layout with striped rows
- ✅ Bold total amount
- ✅ Friendly footer message
- ✅ Proper spacing and alignment

### Information Included:
- ✅ Business name
- ✅ Transaction ID
- ✅ Date and time
- ✅ Medicine name
- ✅ Batch number
- ✅ Quantity sold
- ✅ Unit price (TSh)
- ✅ Total amount (TSh)

### Currency Format:
- All prices in **Tanzanian Shillings (TSh)**
- Thousand separators (e.g., TSh 25,000.00)
- Always 2 decimal places

## 📁 File Details

### File Name Format:
```
Receipt_[ID].pdf
```

**Examples:**
- `Receipt_1.pdf`
- `Receipt_25.pdf`
- `Receipt_100.pdf`

### File Location:
- Downloads to your browser's default download folder
- Usually: `C:\Users\[YourName]\Downloads\`

### File Size:
- Very small (typically 10-20 KB)
- Quick to generate and download

## 🔧 Technical Details

### PDF Library:
- Uses **jsPDF** library
- Professional PDF generation
- Cross-browser compatible

### Features:
- Auto-table for clean layouts
- Custom fonts and colors
- Proper text alignment
- Professional formatting

## 💡 Use Cases

### 1. Customer Receipts
- Print and give to customers
- Email to customers
- Keep digital records

### 2. Record Keeping
- Archive all transactions
- Audit trail
- Financial records

### 3. Reporting
- Monthly sales reports
- Transaction verification
- Inventory tracking

## 🎯 Quick Test

### Test the PDF Feature:
1. **Add stock:**
   - Medicine: Aspirin
   - Quantity: 100
   - Price: TSh 2,500

2. **Dispense:**
   - Quantity: 10
   - Click Dispense

3. **Generate Receipt:**
   - Go to Sales tab
   - Click "🖨️ Receipt"
   - PDF downloads automatically

4. **Open PDF:**
   - Check Downloads folder
   - Open `Receipt_1.pdf`
   - See professional receipt

## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

## 🎨 Customization Options

You can customize the PDF by editing `frontend/src/utils/pdfGenerator.js`:

### Change Business Name:
```javascript
doc.text("Your Pharmacy Name Here", 15, 45);
```

### Change Header Color:
```javascript
doc.setFillColor(102, 126, 234); // Purple
```

### Add More Information:
```javascript
doc.text("Phone: +255 XXX XXX XXX", 15, 66);
doc.text("Address: Your Address", 15, 73);
```

### Change Footer Message:
```javascript
doc.text("Your custom message here!", 105, finalY + 40, { align: "center" });
```

## 🔍 Troubleshooting

### PDF Not Downloading?
1. Check browser popup blocker
2. Allow downloads from localhost
3. Check browser console for errors

### PDF Looks Wrong?
1. Clear browser cache
2. Refresh the page
3. Try different browser

### Missing Information?
1. Ensure sale has all data
2. Check database records
3. Verify sale was successful

## 📊 Sample Data in PDF

When you download a receipt, you'll see:

**Header:**
- Large title "PHARMACY RECEIPT"
- Dark blue background

**Details:**
- Business name
- Transaction #PH-001
- Date: Jan 15, 2026, 10:30 AM

**Table:**
| Medicine | Batch | Qty | Unit Price | Total |
|----------|-------|-----|------------|-------|
| Aspirin | B001 | 10 | TSh 2,500.00 | TSh 25,000.00 |

**Footer:**
- **Total Amount: TSh 25,000.00**
- Thank you message

## ✨ Benefits

1. **Professional:** Clean, business-ready receipts
2. **Instant:** Downloads immediately
3. **Portable:** PDF works everywhere
4. **Printable:** Ready to print
5. **Archivable:** Easy to store and organize

---

**The PDF receipt feature is fully functional and ready to use!** 🎉

Just make a sale and click the "🖨️ Receipt" button to download your professional PDF receipt.
