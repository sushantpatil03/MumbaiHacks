"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { smeAPI } from '@/lib/smeAPI';
import DeductionResult from './result';
import { toast } from 'react-hot-toast';

export default function DeductionPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUploadAndRun = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    try {
      setUploading(true);
      await smeAPI.deductions.upload(files);
      setUploading(false);
      
      setAnalyzing(true);
      const data = await smeAPI.deductions.run();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during analysis");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  if (result) {
    return <DeductionResult data={result} onBack={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/sme" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Missed Deduction Finder</h1>
              <p className="text-gray-500">Upload bank statements or expense sheets to find missed deductions.</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">
                {files.length > 0 ? `${files.length} file(s) selected` : "Drop files here or click to upload"}
              </span>
              <span className="text-sm text-gray-500">
                Supports PDF, CSV, Excel
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  {file.name}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUploadAndRun}
            disabled={uploading || analyzing || files.length === 0}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>Uploading...</>
            ) : analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Expenses...
              </>
            ) : (
              "Find Deductions"
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
