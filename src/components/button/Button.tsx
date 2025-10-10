interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger"; // <-- agregado "danger"
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const baseClasses =
    "py-2 px-4 rounded font-semibold transition-colors focus:outline-none";

  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : variant === "danger"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-gray-300 text-gray-800 hover:bg-gray-400"; // secondary

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

