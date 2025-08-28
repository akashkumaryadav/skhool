import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Check,
  DownloadCloudIcon,
} from "lucide-react";

type FileUploaderProps = {
  multiple: boolean;
  maxFiles?: number;
  maxSize?: number; // 10MB
  acceptedTypes?: [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".txt",
    ".csv"
  ];
  onFilesChange: (file: unknown) => void;
  onError: (...any) => void;
  className?: string;
  disabled: boolean;
  showPreview?: boolean;
  theme: "light" | "dark";
  handleDownload?: () => void;
  onUploadClick: (...any) => void;
  uploading: boolean;
  files:Array<any>;
};

const FileUploader = ({
  multiple = false,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".txt",
    ".csv",
  ],
  onFilesChange = () => {},
  onError = () => {},
  className = "",
  disabled = false,
  showPreview = true,
  theme = "light", // 'light' or 'dark'
  handleDownload = () => {},
  onUploadClick,
  uploading: isUploading = false,
  files=[]
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(isUploading);
  const inputRef = useRef(null);

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return FileImage;
    if (fileType.startsWith("video/")) return FileVideo;
    if (fileType.startsWith("audio/")) return FileAudio;
    if (fileType.includes("pdf")) return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    // Check file type
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes("*")) {
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type not accepted. Allowed types: ${acceptedTypes.join(
          ", "
        )}`;
      }
    }

    return null;
  };

  const processFiles = useCallback(
    (newFiles) => {
      const fileArray: Array<File> = Array.from(newFiles);
      const validFiles = [];
      const errors = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push({ file: file.name, error });
        } else {
          validFiles.push({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: "ready",
            progress: 0,
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null,
          });
        }
      });

      if (errors.length > 0) {
        onError(errors);
      }

      if (validFiles.length > 0) {
        let updatedFiles;
        if (multiple) {
          updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
        } else {
          updatedFiles = [validFiles[0]];
        }
        onFilesChange(updatedFiles);
      }
    },
    [files, multiple, maxFiles, onFilesChange, onError]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const simulateUpload = () => {
    onUploadClick(files);
  };

  const openFileDialog = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const themeClasses = {
    light: {
      container: "bg-white border-blue-200",
      dragActive: "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50",
      text: "text-slate-800",
      subText: "text-slate-600",
      fileItem: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
      button:
        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg",
      secondaryButton:
        "bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 text-slate-700",
      uploadIcon: "bg-gradient-to-r from-blue-100 to-indigo-100",
      uploadIconActive: "bg-gradient-to-r from-blue-200 to-indigo-200",
      progressBar: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
    dark: {
      container: "bg-slate-900 border-blue-500",
      dragActive:
        "border-blue-400 bg-gradient-to-br from-blue-900/30 to-indigo-900/30",
      text: "text-slate-100",
      subText: "text-slate-400",
      fileItem: "bg-gradient-to-r from-slate-800 to-slate-700 border-blue-600",
      button:
        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg",
      secondaryButton:
        "bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-slate-200",
      uploadIcon: "bg-gradient-to-r from-blue-900/50 to-indigo-900/50",
      uploadIconActive: "bg-gradient-to-r from-blue-800/60 to-indigo-800/60",
      progressBar: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`w-full max-w-2xl mx-auto ${className} flex flex-col`}>
      <div className="w-full float-right">
        <DownloadCloudIcon
          className="p-1 flex justify-end"
          onClick={handleDownload}
        />
      </div>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${currentTheme.container}
          ${dragActive ? currentTheme.dragActive : ""}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              dragActive
                ? currentTheme.uploadIconActive
                : currentTheme.uploadIcon
            }`}
          >
            <Upload
              className={`w-8 h-8 transition-colors duration-300 ${
                dragActive ? "text-blue-700" : "text-blue-600"
              }`}
            />
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
              {dragActive ? "Drop files here" : "Upload your files"}
            </h3>
            <p className={`text-sm ${currentTheme.subText} mt-1`}>
              Drag and drop files here, or click to select files
            </p>
          </div>

          <div className={`text-xs ${currentTheme.subText} space-y-1`}>
            <p className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Max size: {formatFileSize(maxSize)}</span>
            </p>
            <p className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span>Accepted: {acceptedTypes.join(", ")}</span>
            </p>
            {multiple && (
              <p className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Max files: {maxFiles}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className={`text-sm font-medium ${currentTheme.text}`}>
            Selected Files ({files.length})
          </h4>

          {files.map((fileData) => {
            const IconComponent = getFileIcon(fileData.type);

            return (
              <div
                key={fileData.id}
                className={`
                  flex items-center space-x-4 p-4 rounded-lg border
                  ${currentTheme.fileItem}
                `}
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {showPreview && fileData.preview ? (
                    <div className="relative">
                      <img
                        src={fileData.preview}
                        alt={fileData.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-lg"></div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${currentTheme.text}`}
                  >
                    {fileData.name}
                  </p>
                  <p className={`text-xs ${currentTheme.subText}`}>
                    {formatFileSize(fileData.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileData.status === "uploading" && (
                    <div className="mt-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${currentTheme.progressBar} shadow-sm`}
                          style={{ width: `${fileData.progress}%` }}
                        />
                      </div>
                      <p
                        className={`text-xs mt-1 font-medium ${currentTheme.subText}`}
                      >
                        {fileData.progress}% uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2">
                  {fileData.status === "completed" && (
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* {fileData.status === "ready" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        simulateUpload(fileData.id);
                      }}
                      disabled={uploading}
                      className={`
                        px-3 py-1 rounded text-xs font-medium transition-colors
                        ${currentTheme.button}
                        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      Upload
                    </button>
                  )} */}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileData.id);
                    }}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                  >
                    <X className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload All Button */}
      {files.length > 0 && files.some((f) => f.status === "ready") && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              files.forEach((f) => {
                if (f.status === "ready") {
                  simulateUpload();
                }
              });
            }}
            disabled={uploading}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${currentTheme.button}
              ${uploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
};

// Example usage component
// const FileUploaderDemo = () => {
//   const [mode, setMode] = useState("single");
//   const [theme, setTheme] = useState<"light"| "dark">("light");

//   const handleFilesChange = (files) => {
//     console.log("Files changed:", files);
//   };

//   const handleError = (errors) => {
//     console.error("Upload errors:", errors);
//   };

//   return (
//     <div
//       className={`min-h-screen p-8 ${
//         theme === "dark"
//           ? "bg-gradient-to-br from-slate-900 to-slate-800"
//           : "bg-gradient-to-br from-slate-50 to-blue-50"
//       }`}
//     >
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <h1
//             className={`text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
//           >
//             Skhool File Uploader
//           </h1>
//           <p
//             className={`text-lg ${
//               theme === "dark" ? "text-slate-300" : "text-slate-600"
//             } mb-6`}
//           >
//             Modern file upload component with drag & drop functionality
//           </p>

//           {/* Controls */}
//           <div className="flex flex-wrap gap-4 mb-6">
//             <div className="flex items-center space-x-3">
//               <label
//                 className={`text-sm font-semibold ${
//                   theme === "dark" ? "text-slate-200" : "text-slate-700"
//                 }`}
//               >
//                 Mode:
//               </label>
//               <select
//                 value={mode}
//                 onChange={(e) => setMode(e.target.value)}
//                 className="px-4 py-2 border border-blue-200 rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="single">Single Upload</option>
//                 <option value="multiple">Multiple Upload</option>
//               </select>
//             </div>

//             <div className="flex items-center space-x-3">
//               <label
//                 className={`text-sm font-semibold ${
//                   theme === "dark" ? "text-slate-200" : "text-slate-700"
//                 }`}
//               >
//                 Theme:
//               </label>
//               <select
//                 value={theme}
//                 onChange={(e) => setTheme(e.target.value)}
//                 className="px-4 py-2 border border-blue-200 rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="light">Light</option>
//                 <option value="dark">Dark</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* File Uploader */}
//         <FileUploader
//           multiple={mode === "multiple"}
//           maxFiles={5}
//           maxSize={5 * 1024 * 1024} // 5MB
//           acceptedTypes={[
//             "image/*",
//             "application/pdf",
//             ".doc",
//             ".docx",
//             ".txt",
//           ]}
//           onFilesChange={handleFilesChange}
//           onError={handleError}
//           theme={theme}
//           showPreview={true}
//         />
//       </div>
//     </div>
//   );
// };

export default FileUploader;
