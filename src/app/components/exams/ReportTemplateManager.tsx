"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  Eye,
  X,
  Save,
  Code
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { ReportTemplate, TemplateVariable } from "../../types/types";

interface ReportTemplateManagerProps {
  open: boolean;
  onClose: () => void;
}

export const ReportTemplateManager: React.FC<ReportTemplateManagerProps> = ({
  open,
  onClose,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<ReportTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);

  const { data: templates = [], isLoading, refetch } = useQuery({
    queryKey: ["reportTemplates"],
    queryFn: async () => {
      const response = await axiosInstance.get("/report-templates");
      return response.data as ReportTemplate[];
    },
    enabled: open,
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await axiosInstance.delete(`/report-templates/${templateId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Template deleted successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete template");
    },
  });

  const handleDelete = (template: ReportTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      deleteTemplateMutation.mutate(template.id);
    }
  };

  const downloadTemplate = async (template: ReportTemplate) => {
    try {
      const response = await axiosInstance.get(`/report-templates/${template.id}/download`, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${template.name}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Report Template Manager</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-4">Create your first report template to get started</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Create Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          template.templateType === 'student_report' ? 'bg-blue-100 text-blue-800' :
                          template.templateType === 'class_report' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {template.templateType.replace('_', ' ')}
                        </span>
                        {template.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Variables: {template.variables.length}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      onClick={() => setEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadTemplate(template)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Template Modal */}
      <TemplateEditor
        open={createModalOpen || !!editTemplate}
        onClose={() => {
          setCreateModalOpen(false);
          setEditTemplate(null);
        }}
        template={editTemplate}
        onSuccess={() => {
          setCreateModalOpen(false);
          setEditTemplate(null);
          refetch();
        }}
      />

      {/* Preview Modal */}
      <TemplatePreview
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />
    </div>
  );
};

// Template Editor Component
interface TemplateEditorProps {
  open: boolean;
  onClose: () => void;
  template?: ReportTemplate | null;
  onSuccess: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  open,
  onClose,
  template,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    templateType: template?.templateType || "student_report" as const,
    templateContent: template?.templateContent || "",
    isDefault: template?.isDefault || false,
  });
  const [variables, setVariables] = useState<TemplateVariable[]>(template?.variables || []);

  const saveTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (template) {
        const response = await axiosInstance.put(`/report-templates/${template.id}`, data);
        return response.data;
      } else {
        const response = await axiosInstance.post("/report-templates", data);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(template ? "Template updated successfully!" : "Template created successfully!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save template");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.templateContent) {
      toast.error("Please fill in all required fields");
      return;
    }

    saveTemplateMutation.mutate({
      ...formData,
      variables,
    });
  };

  const addVariable = () => {
    setVariables([...variables, {
      key: "",
      label: "",
      type: "text",
      required: false,
    }]);
  };

  const updateVariable = (index: number, field: keyof TemplateVariable, value: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {template ? "Edit Template" : "Create Template"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Type
              </label>
              <select
                value={formData.templateType}
                onChange={(e) => setFormData(prev => ({ ...prev, templateType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="student_report">Student Report</option>
                <option value="class_report">Class Report</option>
                <option value="exam_summary">Exam Summary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default template
            </label>
          </div>

          {/* Template Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Content (HTML) *
            </label>
            <textarea
              value={formData.templateContent}
              onChange={(e) => setFormData(prev => ({ ...prev, templateContent: e.target.value }))}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="Enter HTML template with variables like {{student.name}}, {{exam.name}}, etc."
              required
            />
          </div>

          {/* Variables */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700">Template Variables</h4>
              <button
                type="button"
                onClick={addVariable}
                className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                <Plus className="w-4 h-4" />
                Add Variable
              </button>
            </div>
            
            <div className="space-y-3">
              {variables.map((variable, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Variable key"
                      value={variable.key}
                      onChange={(e) => updateVariable(index, "key", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Display label"
                      value={variable.label}
                      onChange={(e) => updateVariable(index, "label", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={variable.type}
                      onChange={(e) => updateVariable(index, "type", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Boolean</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Default value"
                      value={variable.defaultValue || ""}
                      onChange={(e) => updateVariable(index, "defaultValue", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variable.required}
                        onChange={(e) => updateVariable(index, "required", e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeVariable(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveTemplateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveTemplateMutation.isPending ? "Saving..." : (template ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Template Preview Component
interface TemplatePreviewProps {
  open: boolean;
  onClose: () => void;
  template: ReportTemplate | null;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  open,
  onClose,
  template,
}) => {
  if (!open || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Template Preview</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Template Content:</h5>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border overflow-auto max-h-96">
              {template.templateContent}
            </pre>
          </div>

          {template.variables.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Variables:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {template.variables.map((variable, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-indigo-600">{`{{${variable.key}}}`}</span>
                      <span className={`px-2 py-1 text-xs rounded ${variable.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                        {variable.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{variable.label}</div>
                    <div className="text-xs text-gray-500">Type: {variable.type}</div>
                    {variable.defaultValue && (
                      <div className="text-xs text-gray-500">Default: {variable.defaultValue}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
