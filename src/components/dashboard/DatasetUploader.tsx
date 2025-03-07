
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DatasetUploaderProps {
  onDatasetUploaded: (data: any[]) => void;
}

const DatasetUploader: React.FC<DatasetUploaderProps> = ({ onDatasetUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const jsonData = JSON.parse(event.target.result as string);
          
          if (Array.isArray(jsonData)) {
            onDatasetUploaded(jsonData);
            toast({
              title: "Dataset loaded successfully",
              description: `${jsonData.length} records imported`,
            });
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
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/json") {
        processFile(file);
      } else {
        setError("Only JSON files are supported");
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Please upload a JSON file",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/json") {
        processFile(file);
      } else {
        setError("Only JSON files are supported");
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Please upload a JSON file",
        });
      }
    }
  };

  return (
    <Card className="shadow-card p-5 animate-slide-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Custom Dataset</h3>
        <p className="text-sm text-slate-500">Upload your transaction data in JSON format</p>
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
            <Upload className="h-6 w-6 text-slate-500" />
          </div>
          
          {fileName ? (
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-finance-blue" />
              <span className="text-sm font-medium text-slate-700">{fileName}</span>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700">
                Drag and drop your JSON file here, or click to browse
              </p>
              <p className="text-xs text-slate-500">
                Supported format: JSON array of transactions
              </p>
            </>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mt-2">
            <label htmlFor="file-upload">
              <Input
                id="file-upload"
                type="file"
                accept="application/json"
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
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-xs text-slate-500">
          <p className="mb-1"><strong>Expected format:</strong></p>
          <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
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
        </div>
      </div>
    </Card>
  );
};

export default DatasetUploader;
