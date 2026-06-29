import "./loading.scss";

const Loading = ({
  title = "Loading...",
  message = "Please wait while we prepare everything for you.",
  overlay = false,
}) => {
  return (
    <div className={overlay ? "loading-overlay" : "loading-screen"}>
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-dot"></div>
        </div>

        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
