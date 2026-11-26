import React from 'react';
import { UploadCloud } from 'lucide-react';

interface BaseInputProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  helpText?: string;
}

export interface TextInputProps
  extends BaseInputProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  required,
  error,
  className = '',
  icon,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#303943]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84909D]">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full ${
            icon ? 'pl-9.5' : 'px-3.5'
          } py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-xs text-[#303943] placeholder-[#AAB4BE] transition-all focus:outline-none focus:ring-2 focus:ring-[#346CB0]/20 ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-slate-200/80 focus:border-[#346CB0]'
          } ${props.disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export interface SelectInputProps
  extends BaseInputProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  required,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#303943]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full px-3.5 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-xs text-[#303943] transition-all focus:outline-none focus:ring-2 focus:ring-[#346CB0]/20 cursor-pointer ${
          error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-200/80 focus:border-[#346CB0]'
        } ${props.disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export interface TextAreaInputProps
  extends BaseInputProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  required,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#303943]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        rows={3}
        {...props}
        className={`w-full px-3.5 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-xs text-[#303943] placeholder-[#AAB4BE] transition-all focus:outline-none focus:ring-2 focus:ring-[#346CB0]/20 resize-none ${
          error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-200/80 focus:border-[#346CB0]'
        } ${props.disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export interface DropzoneProps {
  label: string;
  title: string;
  subtitle?: string;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export const FileUploadDropzone: React.FC<DropzoneProps> = ({
  label,
  title,
  subtitle = 'Click to browse • JPG, PNG',
  onFileSelect,
  className = '',
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileSelect) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-2 col-span-full ${className}`}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#303943]">
        {label}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-slate-300 hover:border-[#346CB0] rounded-2xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-[#F4F9FD]/60 transition-colors group"
      >
        <div className="p-3 bg-[#EBF3FB] rounded-2xl text-[#346CB0] group-hover:scale-105 transition-transform mb-3 shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-[#303943] group-hover:text-[#346CB0] transition-colors">
          {title}
        </span>
        <span className="text-[11px] text-[#84909D] mt-0.5">{subtitle}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
