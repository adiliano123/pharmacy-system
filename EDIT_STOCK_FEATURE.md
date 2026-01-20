# Edit Stock Feature ✏️

## Overview
You can now edit/update existing stock items directly from the inventory table!

## How to Edit Stock

### Step 1: Find the Item
1. Go to the **Inventory** tab
2. Find the item you want to edit in the table
3. You can use the search box to filter items

### Step 2: Click Edit Button
1. Click the **✏️ Edit** button in the Actions column
2. A modal window will pop up with the current details

### Step 3: Update Details
You can update:
- ✓ **Medicine Name** - Change the medicine name
- ✓ **Generic Name** - Update generic/scientific name
- ✓ **Category** - Change category (e.g., Antibiotic, Painkiller)
- ✓ **Quantity** - Adjust stock quantity
- ✓ **Price Per Unit** - Update pricing
- ✓ **Expiry Date** - Change expiration date
- ✗ **Batch Number** - Cannot be changed (unique identifier)

### Step 4: Save Changes
1. Click **✓ Save Changes** button
2. You'll see "✓ Stock updated successfully!"
3. The inventory table refreshes automatically
4. Dashboard statistics update in real-time

## Features

### Edit Modal
- **Clean Interface** - Easy-to-use form with all current values pre-filled
- **Validation** - Required fields are marked with *
- **Batch Protection** - Batch number is locked (cannot be changed)
- **Cancel Option** - Click Cancel or outside the modal to close without saving

### Real-time Updates
After editing:
- ✓ Inventory table refreshes immediately
- ✓ Dashboard stats recalculate (Stock Value, Quantity, etc.)
- ✓ Stock alerts update if quantity changes
- ✓ All changes are saved to database

### Use Cases

**1. Correct Mistakes**
- Fixed wrong price entry
- Updated incorrect quantity
- Corrected medicine name typo

**2. Adjust Stock Levels**
- Manual stock count adjustments
- Correct inventory discrepancies
- Update after physical verification

**3. Update Information**
- Change expiry date if corrected
- Update category classification
- Add missing generic name

**4. Price Updates**
- Adjust prices due to supplier changes
- Update pricing for promotions
- Correct pricing errors

## Technical Details

### Backend API
**Endpoint:** `api/modules/update_medicine.php`
- Method: PUT
- Requires: inventory_id, name, quantity, price
- Optional: generic_name, category, expiry_date
- Returns: Success/error message

### Frontend Components
1. **EditStockModal.jsx** - Modal dialog for editing
2. **InventoryTable.jsx** - Edit button and modal integration
3. **useInventory.js** - handleUpdate function
4. **api.js** - updateMedicine API call

### Database
Updates the `inventory` table:
```sql
UPDATE inventory 
SET name = ?, 
    generic_name = ?, 
    category = ?, 
    quantity = ?, 
    expiry_date = ?, 
    price = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE inventory_id = ?
```

## Security

- ✓ Batch number cannot be changed (prevents data corruption)
- ✓ Requires authentication (session token)
- ✓ Validates all input fields
- ✓ SQL injection protection (prepared statements)
- ✓ Tracks update timestamp

## UI/UX Features

### Visual Design
- **Modal Overlay** - Blurred background for focus
- **Smooth Animation** - Slide-in effect
- **Color Coding** - Purple gradient matching app theme
- **Responsive** - Works on all screen sizes

### User Feedback
- Success message: "✓ Stock updated successfully!"
- Error messages: Specific error details
- Disabled state: Batch number field is grayed out
- Hover effects: Buttons highlight on hover

## Files Created/Modified

### New Files:
- ✓ `frontend/src/components/Inventory/EditStockModal.jsx`
- ✓ `api/modules/update_medicine.php`

### Modified Files:
- ✓ `frontend/src/components/Inventory/InventoryTable.jsx`
- ✓ `frontend/src/hooks/useInventory.js`
- ✓ `frontend/src/services/api.js`
- ✓ `frontend/src/App.jsx`

## Example Workflow

```
User clicks "✏️ Edit" on Aspirin batch
    ↓
Modal opens with current values:
  - Name: Aspirin
  - Generic: Acetylsalicylic Acid
  - Category: Painkiller
  - Batch: B001 (locked)
  - Quantity: 50
  - Price: $2.50
  - Expiry: 2026-12-31
    ↓
User changes:
  - Quantity: 50 → 75
  - Price: $2.50 → $2.75
    ↓
User clicks "Save Changes"
    ↓
API updates database
    ↓
Success message appears
    ↓
Inventory table refreshes
Dashboard stats recalculate
```

## Tips

1. **Double-check before saving** - Changes are immediate
2. **Use for corrections** - Not for dispensing (use Dispense button)
3. **Batch number is permanent** - Create new batch if needed
4. **Price updates** - Affects stock value calculations
5. **Quantity adjustments** - Updates stock alerts automatically

## Future Enhancements

Potential additions:
- Edit history/audit log
- Bulk edit multiple items
- Undo last edit
- Confirmation dialog for large changes
- Field-level change tracking
