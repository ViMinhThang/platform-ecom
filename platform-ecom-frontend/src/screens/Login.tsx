import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/slice/authApiSlice";
import { useAuth } from "@/context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const [login] = useLoginMutation();
  const { setUser } = useAuth(); 
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data).unwrap();
      setUser({
        id: res.id,
        username: res.username,
        roles: res.roles,
      });

      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex flex-col w-[1200px] mx-auto mt-5">
      <div className="flex">
        <Link className="text-blue-500" to="/">
          Home
        </Link>
        <h1>/ Login</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-[6px_12px_60px_rgba(0,0,0,0.2)] rounded-2xl bg-white p-8 w-[480px] mx-auto my-20"
      >
        <h1 className="text-2xl text-center">Login</h1>

        <div className="flex flex-col mt-5 justify-start space-y-3">
          <Input
            {...register("email", { required: "Email is required" })}
            className="rounded-xs p-5 text-xl border border-slate-400"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

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

          <Button
            type="submit"
            className="rounded-xs text-xl p-5 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>

        <div className="flex justify-center items-center gap-4 mt-2">
          <Link className=" text-blue-500" to="/create-account">
            Create an account
          </Link>
          <Link to="/forgot-password">Forgot your Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
