"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

function NavPrevIcon() {
  return <ChevronLeft className="h-4 w-4" aria-hidden />;
}

function NavNextIcon() {
  return <ChevronRight className="h-4 w-4" aria-hidden />;
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 md:p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "space-y-1  mx-auto",
        caption: "flex justify-center pt-0 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 inline-flex items-center justify-center rounded-md hover:bg-muted"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex gap-1 min-[1200px]:gap-2",
        head_cell: "text-muted-foreground rounded-md w-12 min-[1200px]:w-14 font-normal text-[0.8rem]",
        row: "flex w-full mt-1 gap-1 min-[1200px]:gap-2 ",
        cell: cn(
          "text-center text-sm p-0 relative",
        ),
        // TD element wrapper
        day: cn(
          "p-0 font-medium rounded-md focus-visible:outline-none"
        ),
        // Actual button inside the cell
        day_button: cn(
          "md:h-12 h-10 md:w-12 w-10 min-[1200px]:h-14 min-[1200px]:w-14 inline-flex items-center justify-center rounded-md border hover:bg-muted transition-colors shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary",
        day_today: "border-2 border-primary",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: NavPrevIcon,
        IconRight: NavNextIcon,
      }}
      modifiersClassNames={{
        selected: "!bg-primary/90 !text-primary-800 !text-xl !border-primary hover:!bg-primary/20 hover:!text-primary/80",
        today: "ring-1 ring-primary",
        outside: "opacity-50 text-muted-foreground",
        disabled: "opacity-50 text-muted-foreground cursor-not-allowed",
      }}
      {...props}
    />
  );
}

export default Calendar;
