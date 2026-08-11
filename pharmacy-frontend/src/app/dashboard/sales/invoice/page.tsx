'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { axiosInstance } from '@/lib/api';
import { FileText, Download, Printer, Mail } from 'lucide-react';

interface SaleItem {
  id: number;
  product: { name: string } | null;
  quantity: number;
  price: number;
  subtotal: number;
}

interface InvoiceData {
  id: number;
  customer: { name: string; phone?: string; email?: string } | null;
  created_at: string;
  payment_method: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  items: SaleItem[];
}

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) fetchInvoice(id);
    else setLoading(false);
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

  const handlePrint = () => window.print();

  const handleSaveAsPDF = () => {
    if (!invoice) return;
    const original = document.title;
    document.title = `Invoice-${String(invoice.id).padStart(5, '0')}`;
    window.print();
    document.title = original;
  };

  const handleEmail = () => {
    if (!invoice) return;
    const subject = encodeURIComponent(`Invoice INV-${String(invoice.id).padStart(5, '0')}`);
    const body = encodeURIComponent(
      `Dear ${invoice.customer?.name ?? 'Customer'},\n\nPlease find your invoice details below.\n\nInvoice: INV-${String(invoice.id).padStart(5, '0')}\nDate: ${new Date(invoice.created_at).toLocaleDateString()}\nTotal: TZS ${invoice.total_amount.toLocaleString()}\n\nThank you for your business!\nPharmacy ERP`
    );
    window.location.href = `mailto:${invoice.customer?.email ?? ''}?subject=${subject}&body=${body}`;
  };

  // Derive subtotal from items when not provided directly
  const itemsSubtotal = invoice?.items?.reduce((sum, item) => sum + Number(item.subtotal), 0) ?? 0;
  const tax = Number(invoice?.tax_amount ?? 0);
  const discount = Number(invoice?.discount_amount ?? 0);
  const total = Number(invoice?.total_amount ?? itemsSubtotal - discount + tax);

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
          <p className="text-sm text-gray-400 mt-2">No sale ID provided in the URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Print styles — only the printable div is visible when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-printable, #invoice-printable * { visibility: visible; }
          #invoice-printable { position: fixed; inset: 0; padding: 2rem; }
        }
      `}</style>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} />
          Print
        </button>
        <button
          onClick={handleSaveAsPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          Save as PDF
        </button>
        <button
          onClick={handleEmail}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <Mail size={18} />
          Email
        </button>
      </div>

      {/* Invoice */}
      <div id="invoice-printable" className="bg-white rounded-lg shadow-lg p-8">

        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-500 mt-1 text-sm">
                INV-{String(invoice.id).padStart(5, '0')}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-teal-700">💊 Pharmacy ERP</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                123 Medical Street<br />
                Dar es Salaam, Tanzania<br />
                Phone: +255 700 000 000
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="text-lg font-semibold text-gray-900">
              {invoice.customer?.name ?? 'Walk-in Customer'}
            </p>
            {invoice.customer?.phone && (
              <p className="text-sm text-gray-600">{invoice.customer.phone}</p>
            )}
            {invoice.customer?.email && (
              <p className="text-sm text-gray-600">{invoice.customer.email}</p>
            )}
          </div>
          <div className="text-right space-y-1">
            <div>
              <span className="text-sm text-gray-500">Date: </span>
              <span className="font-semibold text-gray-800">
                {new Date(invoice.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Payment: </span>
              <span className="font-semibold text-gray-800 capitalize">{invoice.payment_method}</span>
            </div>
            <div>
              <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Paid
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
              <th className="text-right py-3 text-gray-600 font-semibold">Unit Price</th>
              <th className="text-right py-3 text-gray-600 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">
                  {item.product?.name ?? 'Unknown Product'}
                </td>
                <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 text-right text-gray-700">
                  TZS {Number(item.price).toLocaleString()}
                </td>
                <td className="py-3 text-right font-semibold text-gray-900">
                  TZS {Number(item.subtotal).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-0">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">TZS {itemsSubtotal.toLocaleString()}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">TZS {tax.toLocaleString()}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-red-600">-TZS {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-gray-900 mt-1">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                TZS {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="font-medium">Thank you for your business!</p>
          <p className="mt-1">For queries, contact us at support@pharmacy.com</p>
        </div>
      </div>
    </div>
  );
}
