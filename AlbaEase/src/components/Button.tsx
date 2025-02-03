import styles from "./Button.module.css";

/* html 태그의 props들 커스텀하기 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    width?: string;
    height?: string;
    variant?: "green" | "gray";
}

const Button: React.FC<ButtonProps> = ({
    width,
    height,
    variant = "green",
    children,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]}`}
            style={{ width, height }}
            {...props}>
            {children}
        </button>
    );
};

export default Button;
