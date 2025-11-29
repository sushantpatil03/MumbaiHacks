import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Download, IndianRupee } from 'lucide-react';

interface DeductionResultProps {
  data: {
    deductions: Array<{
      title: string;
      amount: number;
      section: string;
      reason: string;
    }>;
    estimated_tax_saved: number;
  };
  onBack: () => void;
}

export default function DeductionResult({ data, onBack }: DeductionResultProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 font-medium mb-1">Total Estimated Tax Saved</p>
                <h2 className="text-4xl font-bold flex items-center">
                  <IndianRupee className="w-8 h-8 mr-1" />
                  {data.estimated_tax_saved.toLocaleString('en-IN')}
                </h2>
              </div>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Deductions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Found Deductions</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                <Download className="w-4 h-4 mr-1" /> Download Report
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {data.deductions.map((item, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        {item.section}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{item.reason}</p>
                </div>
              ))}
              
              {data.deductions.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No missed deductions found in the uploaded documents.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
