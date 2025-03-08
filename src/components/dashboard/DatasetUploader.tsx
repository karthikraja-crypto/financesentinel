
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, AlertCircle, FileSpreadsheet, FileImage, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';
import { useDataset } from '@/contexts/DatasetContext';
import SignInForm from '@/components/auth/SignInForm';
import * as XLSX from 'xlsx';
import { Transaction } from '@/utils/demoData';

const DatasetUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, login } = useUser();
  const { setTransactions, lastUploadedFile, setLastUploadedFile } = useDataset();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Helper function to validate if an object is a valid Transaction
  const isValidTransaction = (obj: any): obj is Transaction => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.date === 'string' &&
      typeof obj.amount === 'number' &&
      ['deposit', 'withdrawal', 'transfer', 'payment'].includes(obj.type) &&
      ['completed', 'pending', 'failed', 'flagged'].includes(obj.status) &&
      typeof obj.merchant === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.category === 'string' &&
      typeof obj.riskScore === 'number' &&
      typeof obj.flagged === 'boolean'
    );
  };

  // Helper function to validate and convert an array of unknown objects to Transaction[]
  const validateTransactions = (data: any[]): Transaction[] => {
    // Basic validation to ensure all required fields are present
    const validTransactions: Transaction[] = [];
    
    for (const item of data) {
      // For missing or invalid data, attempt to fix it
      const transaction: any = {
        id: item.id || `TX-${Math.random().toString(36).substr(2, 9)}`,
        date: item.date || new Date().toISOString().split('T')[0],
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
        type: ['deposit', 'withdrawal', 'transfer', 'payment'].includes(item.type) 
          ? item.type 
          : 'payment',
        status: ['completed', 'pending', 'failed', 'flagged'].includes(item.status) 
          ? item.status 
          : 'completed',
        merchant: item.merchant || 'Unknown',
        description: item.description || item.merchant || 'Transaction',
        category: item.category || 'Uncategorized',
        riskScore: typeof item.riskScore === 'number' ? item.riskScore : parseInt(item.riskScore) || 0,
        flagged: typeof item.flagged === 'boolean' ? item.flagged : false
      };
      
      // Ensure the transaction now meets our criteria
      if (isValidTransaction(transaction)) {
        validTransactions.push(transaction);
      }
    }
    
    return validTransactions;
  };

  const processFile = (file: File) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    
    setLastUploadedFile(file.name);
    setError(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    setFileType(fileExtension || null);

    if (file.type === "application/json" || fileExtension === 'json') {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const jsonData = JSON.parse(event.target.result as string);
            
            if (Array.isArray(jsonData)) {
              const validTransactions = validateTransactions(jsonData);
              
              if (validTransactions.length > 0) {
                setTransactions(validTransactions);
                toast({
                  title: "Dataset loaded successfully",
                  description: `${validTransactions.length} records imported from JSON`,
                });
              } else {
                setError("No valid transactions found in the uploaded file");
                toast({
                  variant: "destructive",
                  title: "Invalid dataset format",
                  description: "No valid transactions found in the file",
                });
              }
            } else {
              setError("Uploaded file must contain an array of transactions");
              toast({
                variant: "destructive",
                title: "Invalid dataset format",
                description: "The file must contain an array of transactions",
              });
            }
          }
        } catch (err) {
          setError("Failed to parse JSON file");
          toast({
            variant: "destructive",
            title: "Invalid JSON file",
            description: "The file could not be parsed as JSON",
          });
        }
      };

      reader.readAsText(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
      file.type === "application/vnd.ms-excel" ||
      fileExtension === 'xlsx' ||
      fileExtension === 'xls' ||
      fileExtension === 'csv'
    ) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const data = new Uint8Array(event.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              const validTransactions = validateTransactions(jsonData);
              
              if (validTransactions.length > 0) {
                setTransactions(validTransactions);
                toast({
                  title: "Dataset loaded successfully",
                  description: `${validTransactions.length} records imported from Excel`,
                });
              } else {
                setError("No valid transactions found in the uploaded file");
                toast({
                  variant: "destructive",
                  title: "Invalid dataset format",
                  description: "No valid transactions found in the file",
                });
              }
            } else {
              setError("Excel file appears to be empty");
              toast({
                variant: "destructive",
                title: "Empty dataset",
                description: "The Excel file doesn't contain usable data",
              });
            }
          }
        } catch (err) {
          setError("Failed to parse Excel file");
          toast({
            variant: "destructive",
            title: "Invalid Excel file",
            description: "The file could not be processed",
          });
        }
      };

      reader.readAsArrayBuffer(file);
    } else if (
      file.type === "text/csv" ||
      fileExtension === 'csv'
    ) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const csvData = event.target.result as string;
            const workbook = XLSX.read(csvData, { type: 'binary' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              setTransactions(jsonData);
              toast({
                title: "Dataset loaded successfully",
                description: `${jsonData.length} records imported from CSV`,
              });
            } else {
              setError("CSV file appears to be empty");
              toast({
                variant: "destructive",
                title: "Empty dataset",
                description: "The CSV file doesn't contain usable data",
              });
            }
          }
        } catch (err) {
          setError("Failed to parse CSV file");
          toast({
            variant: "destructive",
            title: "Invalid CSV file",
            description: "The file could not be processed",
          });
        }
      };

      reader.readAsBinaryString(file);
    } else {
      setError("Only JSON, Excel, and CSV files are supported");
      toast({
        variant: "destructive",
        title: "Unsupported file type",
        description: "Please upload a JSON, Excel, or CSV file",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const getFileIcon = () => {
    if (!lastUploadedFile) return <Upload className="h-6 w-6 text-slate-500" />;
    
    if (fileType === 'json') {
      return <FileText className="h-4 w-4 text-finance-blue" />;
    } else if (['xlsx', 'xls'].includes(fileType || '')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    } else if (fileType === 'csv') {
      return <Database className="h-4 w-4 text-amber-600" />;
    }
    
    return <FileText className="h-4 w-4 text-finance-blue" />;
  };

  const handleUserSignedIn = (userData: { email: string; name: string; phone: string; }) => {
    login(userData);
    setShowSignIn(false);
    
    toast({
      title: "Signed In",
      description: "You can now upload your custom dataset",
    });
  };

  return (
    <>
      <Card className="shadow-card p-5 animate-slide-in">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Custom Dataset</h3>
          <p className="text-sm text-slate-500">Upload your transaction data in JSON, Excel, or CSV format</p>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? 'border-finance-blue bg-blue-50' : 'border-slate-300'
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-slate-100 rounded-full">
              {getFileIcon()}
            </div>
            
            {lastUploadedFile ? (
              <div className="flex items-center space-x-2">
                {fileType === 'json' ? (
                  <FileText className="h-4 w-4 text-finance-blue" />
                ) : ['xlsx', 'xls'].includes(fileType || '') ? (
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                ) : fileType === 'csv' ? (
                  <Database className="h-4 w-4 text-amber-600" />
                ) : (
                  <FileText className="h-4 w-4 text-finance-blue" />
                )}
                <span className="text-sm font-medium text-slate-700">{lastUploadedFile}</span>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: JSON, Excel (.xlsx, .xls), CSV
                </p>
                {!isAuthenticated && (
                  <p className="text-xs text-amber-600 font-medium">
                    Sign in required before uploading
                  </p>
                )}
              </>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="mt-2">
              {isAuthenticated ? (
                <label htmlFor="file-upload">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".json,.xlsx,.xls,.csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Browse files
                  </Button>
                </label>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setShowSignIn(true)}
                >
                  Sign in to upload
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-xs text-slate-500">
            <p className="mb-1"><strong>Supported formats:</strong></p>
            <div className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-finance-blue" />
                <span className="font-medium">JSON</span>
              </div>
              <pre className="mb-3">
{`[
  {
    "id": "TX123456",
    "date": "2023-04-15",
    "amount": 125.50,
    "merchant": "Example Store",
    "type": "payment",
    ...
  },
  ...
]`}
              </pre>
              <div className="flex items-center space-x-2 mb-2">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span className="font-medium">Excel</span>
              </div>
              <p className="mb-3">Excel file with transaction data (must include headers)</p>
              
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-amber-600" />
                <span className="font-medium">CSV</span>
              </div>
              <p>CSV file with transaction data (must include headers)</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Sign In Modal */}
      {showSignIn && (
        <SignInForm 
          onSignIn={handleUserSignedIn}
          onCancel={() => setShowSignIn(false)}
        />
      )}
    </>
  );
};

export default DatasetUploader;
