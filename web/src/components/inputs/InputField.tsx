import clsx from "clsx";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  type: string;
  name: Path<T>;
  placeholder: string;
  register: UseFormRegister<T>;
  errors?: FieldError;
  required?: boolean | string;
  className?: string;
  inputType?: "input" | "textarea";
  disabled?: boolean;
};

const InputField = <T extends FieldValues>({
  type,
  name,
  placeholder,
  register,
  errors,
  required = true,
  className,
  inputType = "input",
  disabled = false,
}: InputFieldProps<T>) => {
  const commonProps = {
    placeholder,
    className: clsx(
      "mb-2 bg-secondary/50 text-primary p-2 rounded-xl border-[1px] border-black",
      errors ? "border-2 border-red-500" : "",
      disabled ? "opacity-60" : "",
      className,
    ),
    disabled,
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
