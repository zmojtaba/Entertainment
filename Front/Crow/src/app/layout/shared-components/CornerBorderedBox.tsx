import React from 'react';


interface CornerBorderedBoxProps {
  children?: React.ReactNode; // علامت ? باعث می‌شود children اختیاری باشد
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  backgroundColor?: string;
  padding?: number;
  className?: string;
}
const CornerBorderedBox: React.FC<CornerBorderedBoxProps> = ({
  children,
  borderColor = '#4f46e5',
  borderWidth = 4,
  borderRadius = 10,
  backgroundColor = 'transparent',
  padding = 0,
  className = ''
}) => {
  const boxStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: backgroundColor,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
  };

  const cornerStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${borderWidth * 4}px`,
    height: `${borderWidth * 3}px`,
    borderColor: borderColor,
    borderStyle: 'solid',
    backgroundColor: backgroundColor,
  };

  return (
    <div className={` ${className}`} style={boxStyle}>
      {/* گوشه بالا سمت چپ */}
      <div style={{
        ...cornerStyle,
        top: `-${borderWidth}px`,
        left: `-${borderWidth}px`,
        borderWidth: `${borderWidth}px 0 0 ${borderWidth}px`,
        borderRadius: `${borderRadius}px 0 0 0`,
      }} />

      {/* گوشه بالا سمت راست */}
      <div style={{
        ...cornerStyle,
        top: `-${borderWidth}px`,
        right: `-${borderWidth}px`,
        borderWidth: `${borderWidth}px ${borderWidth}px 0 0`,
        borderRadius: `0 ${borderRadius}px 0 0`,
      }} />

      {/* گوشه پایین سمت راست */}
      <div style={{
        ...cornerStyle,
        bottom: `-${borderWidth}px`,
        right: `-${borderWidth}px`,
        borderWidth: `0 ${borderWidth}px ${borderWidth}px 0`,
        borderRadius: `0 0 ${borderRadius}px 0`,
      }} />

      {/* گوشه پایین سمت چپ */}
      <div style={{
        ...cornerStyle,
        bottom: `-${borderWidth}px`,
        left: `-${borderWidth}px`,
        borderWidth: `0 0 ${borderWidth}px ${borderWidth}px`,
        borderRadius: `0 0 0 ${borderRadius}px`,
      }} />

      {/* محتوای داخل باکس */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default CornerBorderedBox;