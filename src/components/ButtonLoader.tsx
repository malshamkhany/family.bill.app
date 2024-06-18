export default function ButtonLoader({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="loader">
        <div className="justify-content-center jimu-primary-loading"></div>
      </div>
    </div>
  );
}
