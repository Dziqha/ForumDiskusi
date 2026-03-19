export default function LoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 w-full bg-blue-200 overflow-hidden">
        <div className="h-full w-1/3 bg-blue-600 animate-loading-bar" />
      </div>
    </div>
  );
}
