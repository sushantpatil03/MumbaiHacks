import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Download, IndianRupee } from 'lucide-react';

interface GSTResultProps {
  data: {
    missing_itc: Array<{
      invoice_no: string;
      gstin: string;
      amount: number;
      reason: string;
    }>;
    total_itc_missed: number;
  };
  onBack: () => void;
}

export default function GSTResult({ data, onBack }: GSTResultProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Upload New Files
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 font-medium mb-1">Total Missing ITC Detected</p>
                <h2 className="text-4xl font-bold flex items-center">
                  <IndianRupee className="w-8 h-8 mr-1" />
                  {data.total_itc_missed.toLocaleString('en-IN')}
                </h2>
              </div>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Missing ITC Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Mismatched Invoices</h3>
              <button className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                <Download className="w-4 h-4 mr-1" /> Download Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-4">Invoice No</th>
                    <th className="p-4">GSTIN</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.missing_itc.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{item.invoice_no}</td>
                      <td className="p-4 font-mono text-gray-500">{item.gstin}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.reason}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-gray-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  
                  {data.missing_itc.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-500">
                        No missing ITC found. All invoices match GSTR-2B!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
