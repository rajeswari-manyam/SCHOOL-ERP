import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-3xl bg-white shadow-sm border">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        </div>
        <Button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
          Create report
        </Button>
      </div>
      <p className="text-sm text-slate-500 max-w-2xl">{subtitle}</p>
    </div>
  );
};
