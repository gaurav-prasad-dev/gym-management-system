import React, { useState } from 'react';
import { FormSection } from '../../components/common/FormSection';
import {
  TextInput,
  SelectInput,
  TextAreaInput,
  FileUploadDropzone,
} from '../../components/common/FormFields';
import {
  User,
  Phone,
  ShieldAlert,
  FileText,
  Save,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface AddMemberPageProps {
  onCancel: () => void;
  onSuccess: (newMemberId: string) => void;
}

export const AddMemberPage: React.FC<AddMemberPageProps> = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    occupation: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    source: 'Walk-in',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9+ -]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid mobile number format';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
      };

      const res = await fetch('/api/v1/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to register member');
      }

      onSuccess(json.data.id);
    } catch (err: any) {
      setServerError(err.message || 'An error occurred during member registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header with Breadcrumbs & Top Action Bar (Matching image-1.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/50">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#84909D]">
          <span>Members</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#303943] font-bold">New Member</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#EBF3FB] text-[#346CB0] font-mono text-[11px] font-bold border border-blue-200/60 ml-2">
            MEM-AUTO
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-[#84909D] hover:text-[#303943] shadow-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#303943] hover:bg-[#1E252D] text-white text-xs font-bold shadow-glass transition-all duration-150 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Member...' : 'Save Member'}</span>
          </button>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Section 1: Personal Information (image-1.png layout) */}
      <FormSection
        icon={<User className="w-4 h-4" />}
        title="Personal Information"
        onReset={() =>
          setFormData((prev) => ({
            ...prev,
            firstName: '',
            lastName: '',
            gender: 'male',
            dateOfBirth: '',
            occupation: '',
          }))
        }
      >
        <TextInput
          label="First Name"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          placeholder="e.g. Rahul"
          error={errors.firstName}
        />
        <TextInput
          label="Last Name"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
          placeholder="e.g. Sharma"
          error={errors.lastName}
        />
        <SelectInput
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />
        <TextInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        <TextInput
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="e.g. Business Analyst"
        />
      </FormSection>

      {/* Section 2: Contact Information */}
      <FormSection
        icon={<Phone className="w-4 h-4" />}
        title="Contact Information"
        onReset={() =>
          setFormData((prev) => ({
            ...prev,
            phone: '',
            alternatePhone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
          }))
        }
      >
        <TextInput
          label="Mobile No."
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 9876543210"
          error={errors.phone}
        />
        <TextInput
          label="WhatsApp / Alt No."
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleChange}
          placeholder="+91 9876543211"
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="rahul.sharma@example.com"
          error={errors.email}
        />
        <TextInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Flat / Street / Area"
          className="sm:col-span-2"
        />
        <TextInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Indore"
        />
        <TextInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="e.g. Madhya Pradesh"
        />
        <TextInput
          label="PIN Code"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="e.g. 452010"
        />
      </FormSection>

      {/* Section 3: Emergency Contact */}
      <FormSection
        icon={<ShieldAlert className="w-4 h-4" />}
        title="Emergency Contact"
        onReset={() =>
          setFormData((prev) => ({
            ...prev,
            emergencyContactName: '',
            emergencyContactRelation: '',
            emergencyContactPhone: '',
          }))
        }
      >
        <TextInput
          label="Contact Person Name"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          placeholder="e.g. Rajesh Sharma"
        />
        <TextInput
          label="Relationship"
          name="emergencyContactRelation"
          value={formData.emergencyContactRelation}
          onChange={handleChange}
          placeholder="e.g. Father, Spouse, Friend"
        />
        <TextInput
          label="Emergency Phone"
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          placeholder="+91 9876500000"
        />
      </FormSection>

      {/* Section 4: Additional Details & Member Source */}
      <FormSection
        icon={<FileText className="w-4 h-4" />}
        title="Additional Details"
        onReset={() =>
          setFormData((prev) => ({
            ...prev,
            source: 'Walk-in',
            notes: '',
          }))
        }
      >
        <SelectInput
          label="Member Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          options={[
            { label: 'Walk-in', value: 'Walk-in' },
            { label: 'Instagram', value: 'Instagram' },
            { label: 'Facebook', value: 'Facebook' },
            { label: 'Referral', value: 'Referral' },
            { label: 'Website', value: 'Website' },
            { label: 'Advertisement', value: 'Advertisement' },
            { label: 'Other', value: 'Other' },
          ]}
        />
        <TextAreaInput
          label="Notes / Health Preferences"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any fitness goals, medical considerations, or operational notes..."
          className="sm:col-span-2"
        />

        {/* Section 5: Profile Photo Dropzone (Matching image-1.png upload slip) */}
        <FileUploadDropzone
          label="MEMBER PHOTO"
          title="Upload Member Profile Picture"
          subtitle="Click to browse • JPG, PNG (Max 5MB)"
        />
      </FormSection>
    </form>
  );
};
