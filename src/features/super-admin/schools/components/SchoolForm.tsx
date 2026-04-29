import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  subscriptionPlan: z.enum(["basic", "premium", "enterprise"]),
});

type SchoolFormValues = z.infer<typeof schema>;

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
          <input type="text" {...register("name")} className="input" />
          {errors.name && <span className="text-red-600">{errors.name.message}</span>}
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
          <label>Subscription Plan</label>
          <select {...register("subscriptionPlan")} className="input">
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div className="col-span-2">
          <label>Address</label>
          <input type="text" {...register("address")} className="input" />
          {errors.address && <span className="text-red-600">{errors.address.message}</span>}
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
          <label>Country</label>
          <input type="text" {...register("country")} className="input" />
          {errors.country && <span className="text-red-600">{errors.country.message}</span>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
