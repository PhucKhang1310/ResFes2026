const ForbiddenMessage = ({
  message = "You do not have permission to access this area.",
}: {
  message?: string;
}) => (
  <div className="rounded-lg border border-amber-50/10 bg-black px-4 py-6 text-sm text-amber-50/60">
    {message}
  </div>
);

export default ForbiddenMessage;
