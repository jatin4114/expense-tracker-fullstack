import "./ErrorMessage.css";

// red box to show when an api call fails or something goes wrong
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <p>⚠️ {message || "Something went wrong. Please try again."}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
