import { cn } from "@/lib/utils";

type Card = {
  title: string;
  className?: string;
  content: string | React.ReactNode;
};

export default function CTACard({ content, title, className }: Readonly<Card>) {

  return (
    <div className={cn("bg-black/50 border-l-4 border-primary p-6  shadow-sm shadow-primary   backdrop-blur-sm bg-opacity-95 hover:bg-primary-300/10", className)}>
      <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>
      <p className="text-black-900">
        {content}
      </p>
    </div>
  )
}