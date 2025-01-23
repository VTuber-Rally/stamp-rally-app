import clsx from "clsx";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
  type: string;
  name: string;
  placeholder: string;
  // register: UseFormRegister<FieldValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any; // car ça marche pas avec UseFormRegister<FieldValues>
  errors?: FieldError;
  required?: boolean;
};

const InputField = ({
  type,
  name,
  placeholder,
  register,
  errors,
  required = true,
}: InputFieldProps) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      className={clsx(
        "mb-2 bg-secondary/50 text-primary p-2 rounded-xl border-[1px] border-black",
        errors ? "border-2 border-red-500" : "",
      )}
      {...register(name, { required })}
    />
    {errors && (
      <span className={"text-red-500"}>
        {errors.message ? errors.message : "This field is required"}
      </span>
    )}
  </>
);

export default InputField;
