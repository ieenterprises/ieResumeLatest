import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  allowYearMonthOnly?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  allowYearMonthOnly = false,
}: DatePickerProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value);

  const handleSelect = (date: Date | undefined) => {
    if (allowYearMonthOnly && month && date) {
      // If we're in year/month mode and a month was previously selected
      // Just update the month and year, keeping the day as 1
      const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
      onChange(newDate);
      setMonth(newDate);
      setCalendarOpen(false);
    } else {
      onChange(date);
      setMonth(date);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";

    if (allowYearMonthOnly) {
      return format(date, "MMMM yyyy");
    }

    return format(date, "PPP");
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
