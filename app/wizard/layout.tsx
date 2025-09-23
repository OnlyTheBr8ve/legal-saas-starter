// app/wizard/layout.tsx
export const dynamic = "force-dynamic";
/**
 * `revalidate` MUST be a number (>= 0) or false.
 * Using 0 forces no cache; either 0 or false will fix the error.
 */
export const revalidate = 0;
// Alternatively: export const revalidate = false;

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
