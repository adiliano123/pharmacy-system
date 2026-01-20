# 🖨️ How to See the PDF Download Button

## 📍 Where is the Button?

The **"🖨️ Receipt"** button is in the **Sales & Revenue** tab, but you'll only see it if you have sales data.

## ✅ Step-by-Step Guide

### Step 1: Make Sure You Have Stock
1. Click **"📦 Inventory & Stock"** tab
2. Check if you have any items in the inventory table
3. If empty, add stock using the "Add New Batch" form

### Step 2: Dispense Medicine (Make a Sale)
1. Stay in **Inventory** tab
2. Find a medicine in the table
3. In the "Actions" column, enter a quantity (e.g., 5)
4. Click **"💊 Dispense"** button
5. You should see "Dispensed successfully!" message

### Step 3: Go to Sales Tab
1. Click **"💰 Sales & Revenue"** tab at the top
2. You'll see a table titled "📜 Daily Revenue Log"

### Step 4: Download PDF
1. Look at the last column: **"Action"**
2. You'll see a **"🖨️ Receipt"** button for each sale
3. Click it to download the PDF

## 🎯 Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Home    📦 Inventory & Stock    💰 Sales & Revenue      │
└─────────────────────────────────────────────────────────────┘

                    📜 Daily Revenue Log

┌──────────────┬──────────┬─────┬──────────┬──────────┬────────────┐
│ Date & Time  │ Medicine │ Qty │ Revenue  │ Sold By  │ Action     │
├──────────────┼──────────┼─────┼──────────┼──────────┼────────────┤
│ Jan 15, 10AM │ Aspirin  │ 10  │ TSh 25K  │ Admin    │ 🖨️ Receipt │ ← CLICK HERE
├──────────────┼──────────┼─────┼──────────┼──────────┼────────────┤
│ Jan 15, 11AM │ Panadol  │ 5   │ TSh 15K  │ Admin    │ 🖨️ Receipt │ ← CLICK HERE
└──────────────┴──────────┴─────┴──────────┴──────────┴────────────┘
```

## ❓ Troubleshooting

### Problem 1: "I don't see the Sales tab"
**Solution:** 
- Refresh your browser (Ctrl + F5)
- Make sure you're logged in
- Check if you're on the correct page

### Problem 2: "Sales tab is empty"
**Solution:** 
- You haven't made any sales yet
- Go to Inventory tab
- Dispense some medicine first
- Then check Sales tab again

### Problem 3: "I dispensed but don't see it in Sales"
**Solution:**
- Refresh the page
- Check if dispense was successful
- Look for success message
- Check browser console for errors

### Problem 4: "Button doesn't work"
**Solution:**
- Check browser console (F12)
- Make sure jsPDF library is loaded
- Try different browser
- Clear cache and reload

## 🧪 Quick Test

### Test the Complete Flow:

**1. Add Stock (if needed):**
```
Medicine Name: Test Medicine
Generic Name: Test Generic
Category: Test
Batch Number: TEST001
Quantity: 50
Price: 1000
Expiry Date: (future date)
```

**2. Dispense:**
- Go to Inventory tab
- Find "Test Medicine"
- Enter quantity: 5
- Click "💊 Dispense"
- Wait for success message

**3. View Sale:**
- Click "💰 Sales & Revenue" tab
- See your sale in the table

**4. Download PDF:**
- Click "🖨️ Receipt" button
- PDF downloads as `Receipt_X.pdf`
- Check your Downloads folder

## 📊 What You Should See

### In Sales Tab:
```
Table with columns:
- Date & Time
- Medicine (name)
- Qty Sold
- Revenue (TSh)
- Sold By (your username)
- Action (🖨️ Receipt button) ← THIS IS WHAT YOU'RE LOOKING FOR
```

### The Button Looks Like:
```
┌──────────────┐
│ 🖨️ Receipt  │  ← Purple gradient button
└──────────────┘
```

## 🎬 Complete Workflow

```
1. Login
   ↓
2. Go to Inventory Tab
   ↓
3. Add Stock (if empty)
   ↓
4. Dispense Medicine
   ↓
5. Go to Sales Tab
   ↓
6. See Sales Table
   ↓
7. Click "🖨️ Receipt" Button
   ↓
8. PDF Downloads!
```

## 💡 Important Notes

1. **You MUST make a sale first** - The button only appears if there are sales
2. **Check the Sales tab** - Not the Inventory tab
3. **One button per sale** - Each row has its own receipt button
4. **Automatic download** - PDF downloads immediately when clicked

## 🔍 Still Can't Find It?

### Check These:
- [ ] Are you logged in?
- [ ] Are you on the Sales tab?
- [ ] Have you made at least one sale?
- [ ] Is the sales table showing data?
- [ ] Can you see the "Action" column?

### If Yes to All Above:
The button should be visible in the last column of each row!

## 📸 Screenshot Reference

The button is in the **last column** of the sales table:

```
Sales Table Layout:
┌─────────────────────────────────────────────────────────┐
│ Date | Medicine | Qty | Revenue | Sold By | Action     │
│      |          |     |         |         | [Button]   │ ← HERE
└─────────────────────────────────────────────────────────┘
```

---

**If you still don't see it after making a sale, let me know and I'll help debug!** 🔧
