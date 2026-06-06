import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/store/authStore";

import type {
  AddStudentFormData,
  Student,
} from "../types/student.types";

import { useCreateParentMutation } from "../hooks/useCreateParentMutation";

import type { CreateParentPayload } from "../types/parent.types";

interface CreateStudentResponse {
  status: boolean;
  message: string;
  data: Student;
}

interface AddStudentModalProps {
  onClose: () => void;

  onSubmit: (
    data: AddStudentFormData
  ) => Promise<CreateStudentResponse | undefined>;
}

const EMPTY_FORM: AddStudentFormData = {
  firstName: "",
  lastName: "",
  dob: "",
  admissionNo: "",
  gender: "",
  class: "",
  section: "",
  bloodGroup: "",
  rollNumber: "",
  photo: null,
  residentialAddress: "",
  fatherName: "",
  fatherPhone: "",
  fatherOccupation: "",
  motherName: "",
  motherPhone: "",
  emergencyContact: "",
  whatsappNumber: "",
  sameAsFather: false,
  relation: "",
  email: "",
};

const CLASSES = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const SECTIONS = ["A", "B", "C", "D"].map((s) => ({
  value: s,
  label: s,
}));

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
].map((b) => ({
  value: b,
  label: b,
}));

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {label}
    </label>

    {children}
  </div>
);

const StepIndicator = ({ step }: { step: 1 | 2 }) => (
  <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
    {[1, 2].map((n) => (
      <div key={n} className="flex items-center gap-1.5 sm:gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
            step >= n
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {step > n ? "✓" : n}
        </div>

        <span
          className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
            step >= n ? "text-indigo-700" : "text-gray-400"
          }`}
        >
          {n === 1 ? "Personal Details" : "Parent Details"}
        </span>

        {n < 2 && (
          <div
            className={`w-6 sm:w-12 h-0.5 shrink-0 ${
              step > n ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const AddStudentModal = ({
  onClose,
  onSubmit,
}: AddStudentModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] =
    useState<AddStudentFormData>(EMPTY_FORM);

  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState<{
    id?: string;
  } | null>(null);

  // AUTH STORE
  const { user } = useAuthStore();

  // PARENT API
  const {
    mutateAsync: createParent,
    isPending: parentLoading,
    error: parentApiError,
    reset: resetParentError,
  } = useCreateParentMutation();

  const set =
    (field: keyof AddStudentFormData) =>
    (value: string | boolean) =>
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

  // STEP 1 -> CREATE STUDENT
  const handleNext = async () => {
    setLoading(true);

    try {
      const response = await onSubmit(form);

      console.log(
        "DEBUG: Student API raw response:",
        response
      );

      const student = response?.data;

      if (!student || !student.id) {
        throw new Error(
          "Student creation failed. No ID returned."
        );
      }

      setStudentData({
        id: student.id,
      });

      setStep(2);
    } catch (err: any) {
      setStudentData(null);

      console.error("FULL Student API Error:", err);

      console.error(
        "Student API Error Response:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Student API error";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  // VALIDATE PARENT PAYLOAD
  const validateParentPayload = (
    payload: CreateParentPayload
  ) => {
    if (!payload.parent_name?.trim())
      return "Parent name is required.";

    if (!payload.relation?.trim())
      return "Relation is required.";

    if (!payload.occupation?.trim())
      return "Occupation is required.";

    if (!payload.phone?.trim())
      return "Phone is required.";

    if (!payload.students?.[0]?.trim())
      return "Student ID is required.";

    if (!payload.address?.trim())
      return "Address is required.";

    if (!payload.school_id?.trim())
      return "School ID is required.";

    return null;
  };

  // STEP 2 -> CREATE PARENT
  const handleSubmit = async () => {
    setLoading(true);

    resetParentError();

    try {
      if (!studentData?.id) {
        alert(
          "Student data missing. Please add student first."
        );

        return;
      }

      // SCHOOL ID FROM AUTH STORE
      const schoolId = user?.schoolcode || "";

      // UPDATED PAYLOAD
      const parentPayload: CreateParentPayload = {
        parent_name: form.fatherName,
        relation: form.relation,
        occupation: form.fatherOccupation,
        email: form.email,
        phone: form.fatherPhone,
        students: [studentData.id],
        address: form.residentialAddress,
        school_id: schoolId,
      };

      console.log(
        "FINAL PARENT PAYLOAD:",
        JSON.stringify(parentPayload, null, 2)
      );

      const validationError =
        validateParentPayload(parentPayload);

      if (validationError) {
        alert(validationError);

        return;
      }

      const parentRes =
        await createParent(parentPayload);

      console.log(
        "Parent API response:",
        parentRes
      );

      alert("Student & Parent added successfully");

      // RESET
      setForm(EMPTY_FORM);

      setStudentData(null);

      setStep(1);

      onClose();
    } catch (err: any) {
      console.error(
        "FULL Parent API Error:",
        err
      );

      console.error(
        "Parent API Error Response:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Parent API error";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* MOBILE HANDLE */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* HEADER */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              Add New Student
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Enter student details
            </p>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <StepIndicator step={step} />

          {/* STEP 1 */}
          {step === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="First Name">
                <Input
                  placeholder="Rahul"
                  value={form.firstName}
                  onChange={(e) =>
                    set("firstName")(e.target.value)
                  }
                />
              </Field>

              <Field label="Last Name">
                <Input
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={(e) =>
                    set("lastName")(e.target.value)
                  }
                />
              </Field>

              <Field label="Date of Birth">
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) =>
                    set("dob")(e.target.value)
                  }
                />
              </Field>

              <Field label="Admission Number">
                <div className="relative">
                  <Input
                    placeholder="ADR-2025-343"
                    value={form.admissionNo}
                    onChange={(e) =>
                      set("admissionNo")(e.target.value)
                    }
                    className="pr-28"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      set("admissionNo")(
                        `ADR-2025-${
                          Math.floor(
                            Math.random() * 900
                          ) + 100
                        }`
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded"
                  >
                    Generate
                  </button>
                </div>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Gender">
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map(
                      (g) => (
                        <Button
                          key={g}
                          type="button"
                          variant={
                            form.gender === g
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            set("gender")(g)
                          }
                          className="flex-1"
                        >
                          {g}
                        </Button>
                      )
                    )}
                  </div>
                </Field>
              </div>

              <Field label="Class">
                <Select
                  value={form.class}
                  onValueChange={set("class")}
                  options={CLASSES}
                  placeholder="Select Class"
                />
              </Field>

              <Field label="Section">
                <Select
                  value={form.section}
                  onValueChange={set("section")}
                  options={SECTIONS}
                  placeholder="Select Section"
                />
              </Field>

              <Field label="Blood Group">
                <Select
                  value={form.bloodGroup}
                  onValueChange={set("bloodGroup")}
                  options={BLOOD_GROUPS}
                  placeholder="Select Blood Group"
                />
              </Field>

              <Field label="Roll Number">
                <Input
                  placeholder="24"
                  value={form.rollNumber}
                  onChange={(e) =>
                    set("rollNumber")(e.target.value)
                  }
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Residential Address">
                  <Textarea
                    placeholder="Enter complete address..."
                    value={form.residentialAddress}
                    onChange={(e) =>
                      set(
                        "residentialAddress"
                      )(e.target.value)
                    }
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          ) : (
            /* STEP 2 */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Parent Name">
                <Input
                  placeholder="Parent Name"
                  value={form.fatherName}
                  onChange={(e) =>
                    set("fatherName")(e.target.value)
                  }
                />
              </Field>

              <Field label="Relation">
                <Input
                  placeholder="Father/Mother/Guardian"
                  value={form.relation}
                  onChange={(e) => set("relation")(e.target.value)}
                />
              </Field>

              <Field label="Occupation">
                <Input
                  placeholder="Occupation"
                  value={form.fatherOccupation}
                  onChange={(e) =>
                    set(
                      "fatherOccupation"
                    )(e.target.value)
                  }
                />
              </Field>

              <Field label="Phone">
                <Input
                  placeholder="Phone"
                  value={form.fatherPhone}
                  onChange={(e) =>
                    set("fatherPhone")(e.target.value)
                  }
                />
              </Field>

              <Field label="Email">
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address">
                  <Textarea
                    placeholder="Address"
                    value={form.residentialAddress}
                    onChange={(e) =>
                      set(
                        "residentialAddress"
                      )(e.target.value)
                    }
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          {step === 1 && (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 text-white"
            >
              {loading
                ? "Creating..."
                : "Next →"}
            </Button>
          )}

          {step === 2 && (
            <>
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full sm:w-auto"
              >
                ← Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={loading || parentLoading}
                className="w-full sm:w-auto bg-emerald-600 text-white"
              >
                {loading || parentLoading
                  ? "Adding..."
                  : "Add Student & Parent"}
              </Button>
            </>
          )}
        </div>

        {parentApiError && (
          <div className="px-6 pb-4 text-xs text-red-500">
            {(parentApiError as Error)?.message ||
              "Failed to create parent"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudentModal;