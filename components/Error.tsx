interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function Error({ title = "Error", message, onRetry }: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-4xl mb-2">⚠️</p>
      <h3 className="font-bold text-red-700 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary bg-red-600 hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
