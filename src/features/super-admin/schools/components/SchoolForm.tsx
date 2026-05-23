import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SchoolFormValues } from "../types/school.types";

const schema = z.object({
  school_name: z.string().min(1, "School name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  board: z.string().min(1, "Board is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  whatsappNumber: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit WhatsApp number required"),
  school_code: z.string().min(1, "School code is required"),
  image: z.string().optional().or(z.literal("")),
  logo: z.string().optional().or(z.literal("")),
});

type SchoolFormProps = {
  defaultValues?: Partial<SchoolFormValues>;
  onSubmit: (values: SchoolFormValues) => void;
  loading?: boolean;
};

export const SchoolForm = ({ defaultValues = {}, onSubmit, loading }: SchoolFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SchoolFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>School Name</label>
          <input type="text" {...register("school_name")} className="input" />
          {errors.school_name && <span className="text-red-600">{errors.school_name.message}</span>}
        </div>
        <div>
          <label>School Code</label>
          <input type="text" {...register("school_code")} className="input" />
          {errors.school_code && <span className="text-red-600">{errors.school_code.message}</span>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} className="input" />
          {errors.email && <span className="text-red-600">{errors.email.message}</span>}
        </div>
        <div>
          <label>Phone</label>
          <input type="text" {...register("phone")} className="input" />
          {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
        </div>
        <div>
          <label>City</label>
          <input type="text" {...register("city")} className="input" />
          {errors.city && <span className="text-red-600">{errors.city.message}</span>}
        </div>
        <div>
          <label>State</label>
          <input type="text" {...register("state")} className="input" />
          {errors.state && <span className="text-red-600">{errors.state.message}</span>}
        </div>
        <div>
          <label>Pincode</label>
          <input type="text" {...register("pincode")} className="input" />
          {errors.pincode && <span className="text-red-600">{errors.pincode.message}</span>}
        </div>
        <div>
          <label>Board</label>
          <input type="text" {...register("board")} className="input" />
          {errors.board && <span className="text-red-600">{errors.board.message}</span>}
        </div>
        <div className="col-span-2">
          <label>Address</label>
          <input type="text" {...register("address")} className="input" />
          {errors.address && <span className="text-red-600">{errors.address.message}</span>}
        </div>
        <div>
          <label>WhatsApp Number</label>
          <input type="text" {...register("whatsappNumber")} className="input" />
          {errors.whatsappNumber && <span className="text-red-600">{errors.whatsappNumber.message}</span>}
        </div>
        <div>
          <label>Website</label>
          <input type="text" {...register("website")} className="input" />
          {errors.website && <span className="text-red-600">{errors.website.message}</span>}
        </div>
        <div>
          <label>Logo URL</label>
          <input type="text" {...register("logo")} className="input" />
          {errors.logo && <span className="text-red-600">{errors.logo.message}</span>}
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" {...register("image")} className="input" />
          {errors.image && <span className="text-red-600">{errors.image.message}</span>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
