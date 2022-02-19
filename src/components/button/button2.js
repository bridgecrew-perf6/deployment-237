const Button2 = (props) => {
  const { loading, type, children, disabled, onClick } = props;

  const onClickHandler = (event) => {
    if (disabled || loading) return;
    onClick && onClick(event);
  };

  return (
    <button
      onClick={onClickHandler}
      className={`bg-gradient-to-r border hover:border-0 border-white
       py-2 px-4 w-44 text-sm tracking-normal rounded-3xl hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none ${
         loading && "cursor-not-allowed"
       } ${disabled && "opacity-50"}`}
      disabled={disabled}
      type={type}
      aria-label={type}
      {...props}
    >
      {!loading && children}
      {loading && (
        <div
          className="h-5 w-5 border-2 border-hippie-blue-800 border-t-2 rounded-full animate-spin mx-auto "
          style={{ borderTopColor: "#f1f1f1" }}
        />
      )}
    </button>
  );
};

export default Button2;
