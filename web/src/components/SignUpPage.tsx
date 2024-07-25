import { useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/InputField.tsx";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { AppwriteException } from "appwrite";
import { useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser.ts";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

function SignUpPage() {
  const { user, register: registerAuth } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      if (user) {
        await navigate({ to: "/standists" });
      }
    };
    redirect();
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignupForm>();
  const onSubmitRegister: SubmitHandler<SignupForm> = async (data) => {
    try {
      clearErrors();
      const result = await registerAuth(data.email, data.password, data.name);
      console.log(result);
      await navigate({ to: "/standists" });
    } catch (error) {
      console.log(error);
      setError("password", {
        type: "manual",
        message: (error as AppwriteException).message,
      });
    }
  };
  return (
    <div>
      <h1 className={"mb-4"}>Register</h1>
      <form className={"flex flex-col"}>
        <InputField
          type={"text"}
          name={"name"}
          placeholder={"Name"}
          register={register}
          errors={errors["name"]}
        />

        <InputField
          type={"email"}
          name={"email"}
          placeholder={"Email"}
          register={register}
          errors={errors["email"]}
        />

        <InputField
          type={"password"}
          name={"password"}
          placeholder={"Password"}
          register={register}
          errors={errors["password"]}
        />

        <button
          className="p-2 bg-tertiary text-black rounded-xl"
          onClick={handleSubmit(onSubmitRegister)}
          type="button"
        >
          Register
        </button>
      </form>

      <hr className={"my-4"} />

      <ButtonLink href={"/standists/signin"} size={"small"}>
        Sign in instead
      </ButtonLink>
    </div>
  );
}

export default SignUpPage;
