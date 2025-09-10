import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegistrationMutation } from "@/slice/authApiSlice";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();
  const [registerUser] = useRegistrationMutation();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data).unwrap(); // unwrap để nhận error response nếu có
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col w-[1200px] mx-auto mt-5">
      <div className="flex">
        <Link className="text-blue-500" to="/">
          Home
        </Link>
        <h1>/ Register</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-[6px_12px_60px_rgba(0,0,0,0.2)] rounded-2xl bg-white p-8 w-[480px] mx-auto my-20"
      >
        <h1 className="text-2xl text-center">Register</h1>

        <div className="flex flex-col mt-5 justify-start space-y-3">
          {/* Username */}
          <Input
            {...register("username", { required: "Username is required" })}
            className="rounded-xs p-5 text-xl border border-slate-400"
            type="text"
            placeholder="Username"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}

          {/* Email */}
          <Input
            {...register("email", { required: "Email is required" })}
            className="rounded-xs p-5 text-xl border border-slate-400"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          {/* Password */}
          <Input
            {...register("password", { required: "Password is required" })}
            className="rounded-xs p-5 text-xl border border-slate-400"
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="rounded-xs text-xl p-5 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </div>

        <div className="flex justify-center items-center gap-4 mt-2">
          <Link className="text-blue-500" to="/login">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
