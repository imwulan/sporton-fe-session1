import Link from "next/link";

type TButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "dark" | "ghost";
  size?: "normal" | "small";
};

type TButtonAsButtonProps = TButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href"> & {
    href?: undefined;
  };

type TButtonAsLinkProps = TButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type TButtonProps = TButtonAsButtonProps | TButtonAsLinkProps;

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "normal",
  href,
  ...props
}: TButtonProps) => {
  const baseStyles =
    "inline-flex gap-2 duration-300 justify-center items-center cursor-pointer hover:scale-105";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/85",
    dark: "bg-dark text-white hover:bg-dark/85",
    ghost: "bg-transparent hover:bg-gray-100 text-dark",
  };

  const sizes = {
    normal: "py-4 px-9",
    small: "py-[10px] px-7",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default Button;
