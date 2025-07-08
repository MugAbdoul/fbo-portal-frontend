import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  DocumentIcon, 
  XMarkIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from './Button';

const FileUpload = ({ 
  onFilesSelect, 
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  },
  maxSize = 16 * 1024 * 1024, // 16MB
  multiple = false,
  disabled = false,
  className = ''
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrors([]);
    
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(rejected => 
        rejected.errors.map(error => {
          switch (error.code) {
            case 'file-too-large':
              return `${rejected.file.name}: File is too large (max ${maxSize / (1024 * 1024)}MB)`;
            case 'file-invalid-type':
              return `${rejected.file.name}: File type not allowed`;
            default:
              return `${rejected.file.name}: ${error.message}`;
          }
        })
      ).flat();
      setErrors(errorMessages);
    }

    if (acceptedFiles.length > 0) {
      const newFiles = multiple ? [...files, ...acceptedFiles] : acceptedFiles;
      setFiles(newFiles);
      onFilesSelect(newFiles);
    }
  }, [files, maxSize, multiple, onFilesSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled
  });

  const removeFile = (fileToRemove) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;