import { BottomNav } from "@/components/app/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 bg-[#FAF3EE] pb-24">{children}</div>
      <BottomNav />
    </div>
  );
}
