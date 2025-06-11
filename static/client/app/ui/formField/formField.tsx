import classNames from "classnames";

interface IFormFieldProps extends React.HTMLAttributes<HTMLLabelElement> {
  label: string;
  errors?: string;
}

export const FormField: React.FC<IFormFieldProps> = ({
  label,
  errors,
  children,
  className,
}) => {
  return (
    <label className={classNames(className, "flex flex-col")}>
      <span className={`mb-[12px]`}>{label}</span>
      {children}
      {errors && (
        <span className="text-red-600 text-[15px] mt-1 font-semibold">
          {errors}
        </span>
      )}
    </label>
  );
};
