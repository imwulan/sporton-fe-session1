type TFormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  multiline = false,
  rows = 4,
}: TFormFieldProps) => {
  const inputId = `checkout-${name}`;
  const sharedClassName = `w-full border px-4 py-3 outline-none duration-300 focus:border-primary ${
    error ? "border-red-500" : "border-dark/15"
  }`;

  return (
    <div className="flex flex-col gap-2 text-left">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={sharedClassName}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={sharedClassName}
        />
      )}

      {error && (
        <span id={`${inputId}-error`} role="alert" className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
