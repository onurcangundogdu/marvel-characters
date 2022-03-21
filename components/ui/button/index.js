const Button = ({ title, ...props }) => {
  return <button {...props}>{title}</button>;
};

export default Button;
