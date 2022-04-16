import "./LoadingSpinner.css";

// small reusable spinner, show this while waiting for api calls
function LoadingSpinner({ text }) {
  return (
    <div className="loading-wrap">
      <div className="spinner"></div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
