import React, { ReactNode } from "react";
import { useSliderContext } from ".";

interface ButtonProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <button
    style={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(5px)",
        color: "white",
        fontWeight: "bold",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
        borderRadius: "50%",
        aspectRatio: "1/1",
        transition: "all 0.3s",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

export const NextButton: React.FC<ButtonProps> = ({ onClick }) => {
  const { next } = useSliderContext();
  return (
    <Button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e);
        next();
      }}
    >
      <i 
        className="fas fa-chevron-right"
        style={{
          fontSize: "20px",
        }}
        ></i>
    </Button>
  );
};

