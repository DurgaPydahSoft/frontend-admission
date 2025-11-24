'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { leadAPI, utmAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { getAllStates, getDistrictsByState, getMandalsByStateAndDistrict } from '@/lib/indian-states-data';

export default function LeadFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Capture UTM parameters from URL
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });

  // Extract UTM parameters from URL on mount and track click if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || '',
      });

      // Track click if redirect=false or redirect parameter is missing (long URL direct click)
      const redirectParam = urlParams.get('redirect');
      if (redirectParam !== 'true') {
        // This is a long URL click - track it
        utmAPI.trackClick(window.location.href).catch((err: any) => {
          // Silently fail - tracking is not critical
          console.log('Click tracking failed:', err);
        });
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    hallTicketNumber: '',
    name: '',
    phone: '',
    email: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    gender: '',
    courseInterested: '',
    interCollege: '',
    rank: '',
    village: '',
    district: '',
    mandal: '',
    state: '',
    quota: 'Not Applicable',
    applicationStatus: '',
    isNRI: false,
  });

  // Get all states
  const states = useMemo(() => getAllStates(), []);

  // Get districts based on selected state
  const districts = useMemo(() => {
    if (!formData.state) return [];
    return getDistrictsByState(formData.state);
  }, [formData.state]);

  // Get mandals based on selected state and district
  const mandals = useMemo(() => {
    if (!formData.state || !formData.district) return [];
    return getMandalsByStateAndDistrict(formData.state, formData.district);
  }, [formData.state, formData.district]);

  // Reset district and mandal when state changes
  useEffect(() => {
    if (formData.state) {
      setFormData((prev) => ({ ...prev, district: '', mandal: '' }));
    }
  }, [formData.state]);

  // Reset mandal when district changes
  useEffect(() => {
    if (formData.district) {
      setFormData((prev) => ({ ...prev, mandal: '' }));
    }
  }, [formData.district]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    // Reset mandal if district is changed
    if (name === 'district') {
      setFormData((prev) => ({ ...prev, mandal: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.phone ||
      !formData.fatherName ||
      !formData.fatherPhone ||
      !formData.village ||
      !formData.state ||
      !formData.district ||
      !formData.mandal
    ) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await leadAPI.submitPublicLead({
        hallTicketNumber: formData.hallTicketNumber || undefined,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        motherName: formData.motherName || undefined,
        gender: formData.gender || undefined,
        courseInterested: formData.courseInterested || undefined,
        interCollege: formData.interCollege || undefined,
        rank: formData.rank ? Number(formData.rank) : undefined,
        village: formData.village,
        state: formData.state,
        district: formData.district,
        mandal: formData.mandal,
        isNRI: formData.isNRI,
        quota: 'Not Applicable',
        applicationStatus: 'Not Provided',
        source: 'Public Form',
        utmSource: utmParams.utm_source || undefined,
        utmMedium: utmParams.utm_medium || undefined,
        utmCampaign: utmParams.utm_campaign || undefined,
        utmTerm: utmParams.utm_term || undefined,
        utmContent: utmParams.utm_content || undefined,
      });

      // Show success message
      setShowSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          hallTicketNumber: '',
          name: '',
          phone: '',
          email: '',
          fatherName: '',
          fatherPhone: '',
          motherName: '',
          gender: '',
          courseInterested: '',
          interCollege: '',
          rank: '',
          village: '',
          district: '',
          mandal: '',
          state: '',
          quota: 'Not Applicable',
          applicationStatus: '',
          isNRI: false,
        });
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Lead Submission Form</h1>
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showSuccess ? (
            <Card>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your lead information has been submitted successfully. We will get back to you soon.
                </p>
                <Link href="/">
                  <Button variant="primary">Go to Home</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Please fill in your details</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hall Ticket Number */}
                  <div>
                    <Input
                      label="Hall Ticket Number"
                      name="hallTicketNumber"
                      value={formData.hallTicketNumber}
                      onChange={handleChange}
                      placeholder="Enter Hall Ticket Number"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <Input
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Input
                      label="Phone Number *"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      label="Email (Optional)"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Father Name */}
                  <div>
                    <Input
                      label="Father's Name *"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Father Phone */}
                  <div>
                    <Input
                      label="Father's Phone Number *"
                      name="fatherPhone"
                      type="tel"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <Input
                      label="Mother's Name (Optional)"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Not Specified">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Village */}
                  <div>
                    <Input
                      label="Village *"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Select State</option>
                      {states && states.length > 0 ? (
                        states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Loading states...</option>
                      )}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      disabled={!formData.state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.state ? 'Select District' : 'Select State first'}
                      </option>
                      {districts && districts.length > 0 ? (
                        districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))
                      ) : formData.state ? (
                        <option value="" disabled>No districts found for this state</option>
                      ) : null}
                    </select>
                  </div>

                  {/* Mandal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mandal/Tehsil *
                    </label>
                    <select
                      name="mandal"
                      value={formData.mandal}
                      onChange={handleChange}
                      required
                      disabled={!formData.district}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.district ? 'Select Mandal/Tehsil' : 'Select District first'}
                      </option>
                      {mandals && mandals.length > 0 ? (
                        mandals.map((mandal) => (
                          <option key={mandal} value={mandal}>
                            {mandal}
                          </option>
                        ))
                      ) : formData.district ? (
                        <option value="" disabled>No mandals/tehsils found for this district</option>
                      ) : null}
                    </select>
                  </div>

                  {/* NRI Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="isNRI"
                        checked={formData.isNRI}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isNRI: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all group-hover:border-blue-400"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                        Non-Resident Indian (NRI)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                      Check this if you are a Non-Resident Indian
                    </p>
                  </div>

                  {/* Course Interested */}
                  <div>
                    <Input
                      label="Course Interested (Optional)"
                      name="courseInterested"
                      value={formData.courseInterested}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Inter College */}
                  <div>
                    <Input
                      label="Inter College (Optional)"
                      name="interCollege"
                      value={formData.interCollege}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Rank */}
                  <div>
                    <Input
                      label="Rank (Optional)"
                      name="rank"
                      type="number"
                      min="0"
                      value={formData.rank}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

