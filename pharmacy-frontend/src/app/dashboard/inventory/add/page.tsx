"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    reorderLevel: "",
    price: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add product logic here
    console.log("Product data:", formData);
    router.push("/dashboard/inventory");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
            required
          />

          <Input
            label="Category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Enter category"
            required
          />

          <Input
            label="Reorder Level"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            placeholder="Enter reorder level"
            required
          />

          <Input
            label="Price (TZS)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter price"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Save Product
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/dashboard/inventory")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}