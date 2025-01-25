import React from "react";

interface IconProps {
  src: string; // Path to the SVG or the SVG content itself
  backgroundColor?: string;
  size?: string; // Size as a string (e.g., "40px", "3rem")
  borderRadius?: string; // Optional border radius
}

const Icon: React.FC<IconProps> = ({
  src,
  backgroundColor = "gray", // Default background color
  size = "40px", // Default size
  borderRadius = "50%", // Default border radius (circle)
}) => {
  const iconStyle = {
    backgroundColor: backgroundColor,
    padding: "0.5rem", // Padding around the icon
    borderRadius: borderRadius, // Border radius for rounded background
    display: "inline-flex", // Display inline
    justifyContent: "center", // Center the icon inside
    alignItems: "center", // Center the icon inside
    width: size, // Set the width to the provided size
    height: size, // Set the height to the provided size
  };

  return (
    <div style={iconStyle}>
      <img src={src} alt="icon" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Icon;
