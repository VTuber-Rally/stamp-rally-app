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
  className?: string;
  inputType?: "input" | "textarea";
};

const InputField = ({
  type,
  name,
  placeholder,
  register,
  errors,
  required = true,
  className,
  inputType = "input",
}: InputFieldProps) => {
  const commonProps = {
    placeholder,
    className: clsx(
      "mb-2 bg-secondary/50 text-primary p-2 rounded-xl border-[1px] border-black",
      errors ? "border-2 border-red-500" : "",
      className,
    ),
    ...register(name, { required }),
  };

  return (
    <>
      {inputType === "input" ? (
        <input type={type} {...commonProps} />
      ) : (
        <textarea {...commonProps} />
      )}
      {errors && (
        <span className={"text-red-500"}>
          {errors.message ? errors.message : "This field is required"}
        </span>
      )}
    </>
  );
};

export default InputField;
