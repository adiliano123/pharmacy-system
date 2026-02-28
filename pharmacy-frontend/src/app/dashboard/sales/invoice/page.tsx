'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { axiosInstance } from '@/lib/api';
import { FileText, Download, Printer, Mail } from 'lucide-react';

interface InvoiceData {
  id: number;
  invoice_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  created_at: string;
  payment_method: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
}

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      fetchInvoice(id);
    }
  }, [searchParams]);

  const fetchInvoice = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/sales/${id}`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Invoice not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={printInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Printer size={18} />
          Print
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          <Download size={18} />
          Download PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          <Mail size={18} />
          Email
        </button>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600 mt-1">#{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-blue-600">💊 Pharmacy ERP</h2>
              <p className="text-sm text-gray-600 mt-2">
                123 Medical Street<br />
                City, State 12345<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h3>
            <p className="text-lg font-semibold text-gray-900">
              {invoice.customer_name || 'Walk-in Customer'}
            </p>
            {invoice.customer_phone && (
              <p className="text-gray-600">{invoice.customer_phone}</p>
            )}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-sm text-gray-600">Date: </span>
              <span className="font-semibold">
                {new Date(invoice.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-600">Payment: </span>
              <span className="font-semibold capitalize">{invoice.payment_method}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status: </span>
              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                invoice.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 text-gray-600 font-semibold">Item</th>
              <th className="text-center py-3 text-gray-600 font-semibold">Qty</th>
              <th className="text-right py-3 text-gray-600 font-semibold">Price</th>
              <th className="text-right py-3 text-gray-600 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 text-gray-900">{item.product_name}</td>
                <td className="py-3 text-center text-gray-900">{item.quantity}</td>
                <td className="py-3 text-right text-gray-900">
                  TZS {item.unit_price.toLocaleString()}
                </td>
                <td className="py-3 text-right font-semibold text-gray-900">
                  TZS {item.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">TZS {invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold">TZS {invoice.tax.toLocaleString()}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-red-600">
                  -TZS {invoice.discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                TZS {invoice.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-2">For any queries, please contact us at support@pharmacy.com</p>
        </div>
      </div>
    </div>
  );
}

