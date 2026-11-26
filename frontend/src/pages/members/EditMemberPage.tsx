import React, { useState, useEffect } from 'react';
import { FormSection } from '../../components/common/FormSection';
import {
  TextInput,
  SelectInput,
  TextAreaInput,
} from '../../components/common/FormFields';
import {
  User,
  Phone,
  ShieldAlert,
  FileText,
  Save,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface EditMemberPageProps {
  memberId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditMemberPage: React.FC<EditMemberPageProps> = ({
  memberId,
  onCancel,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    memberCode: '',
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/v1/members/${memberId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const m = json.data;
            setFormData({
              memberCode: m.memberCode || '',
              firstName: m.firstName || '',
              lastName: m.lastName || '',
              gender: m.gender || 'male',
              dateOfBirth: m.dateOfBirth ? m.dateOfBirth.slice(0, 10) : '',
              occupation: m.occupation || '',
              phone: m.phone || '',
              alternatePhone: m.alternatePhone || '',
              email: m.email || '',
              address: m.address || '',
              city: m.city || '',
              state: m.state || '',
              pincode: m.pincode || '',
              emergencyContactName: m.emergencyContactName || '',
              emergencyContactRelation: m.emergencyContactRelation || '',
              emergencyContactPhone: m.emergencyContactPhone || '',
              source: m.source || 'Walk-in',
              notes: m.notes || '',
            });
          }
        }
      } catch (err) {
        console.error('Error loading member:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

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

      const res = await fetch(`/api/v1/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update member');
      }

      setSuccessMsg('Member profile updated successfully');
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: any) {
      setServerError(err.message || 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#84909D]">
        Loading member information...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header with Breadcrumbs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/50">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#84909D]">
          <span>Members</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#303943] font-bold">Edit Profile</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#EBF3FB] text-[#346CB0] font-mono text-[11px] font-bold border border-blue-200/60 ml-2">
            {formData.memberCode}
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
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Section 1: Personal Information */}
      <FormSection icon={<User className="w-4 h-4 text-[#346CB0]" />} title="Personal Information">
        <TextInput
          label="First Name"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <TextInput
          label="Last Name"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
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
        />
      </FormSection>

      {/* Section 2: Contact Information */}
      <FormSection icon={<Phone className="w-4 h-4 text-[#346CB0]" />} title="Contact Information">
        <TextInput
          label="Mobile No."
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <TextInput
          label="WhatsApp / Alt No."
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleChange}
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="sm:col-span-2"
        />
        <TextInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
        <TextInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
        <TextInput
          label="PIN Code"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
        />
      </FormSection>

      {/* Section 3: Emergency Contact */}
      <FormSection
        icon={<ShieldAlert className="w-4 h-4 text-[#346CB0]" />}
        title="Emergency Contact"
      >
        <TextInput
          label="Contact Person Name"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
        <TextInput
          label="Relationship"
          name="emergencyContactRelation"
          value={formData.emergencyContactRelation}
          onChange={handleChange}
        />
        <TextInput
          label="Emergency Phone"
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
        />
      </FormSection>

      {/* Section 4: Additional Details */}
      <FormSection icon={<FileText className="w-4 h-4 text-[#346CB0]" />} title="Additional Details">
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
          label="Notes / Preferences"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="sm:col-span-2"
        />
      </FormSection>
    </form>
  );
};
