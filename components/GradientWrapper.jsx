const GradientWrapper = ({ children, ...props }) => (
    <div {...props} className={`relative ${props.className || ""}`}>
      <div
        className={`absolute m-auto blur-[120px] ${props.wrapperClassName || ""}`}
        style={{
          background:
            "radial-gradient(circle, #007f00 0%, #004d26 100%)", // Degradado radial con verde más fuerte y menos brillo
        }}
      ></div>
      <div className="relative">{children}</div>
    </div>
  );
  
  export default GradientWrapper;
  