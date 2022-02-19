const Button = (props) => {
  const { loading, type, children, disabled, onClick, cancel } = props;

  const onClickHandler = (event) => {
    if (disabled || loading) return;
    onClick && onClick(event);
  };

  return (
    <button
      onClick={onClickHandler}
      className={`bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 md:px-8 px-4 lg:w-44 xl:w-44 w-auto text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none ${loading && "cursor-not-allowed"
        } ${disabled && "opacity-50"}
       ${cancel && "opacity-70 hover:opacity-100"}`}
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

export default Button;
