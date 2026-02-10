/**
 * Auth layout - minimal centered layout without dashboard chrome.
 * Used for sign-in, sign-up, and other authentication pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
