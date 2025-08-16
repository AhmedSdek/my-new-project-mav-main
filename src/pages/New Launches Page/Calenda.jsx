import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./styles.css";
export default function ReadOnlyDateRange({ from, to }) {
  const selectedRange = { from: new Date(from), to: new Date(to) };

  return (
    <div>
      <DayPicker
        mode="range"
        selected={selectedRange}
        numberOfMonths={1}
        showOutsideDays
        disabled={() => true} // ✅ يمنع الاختيار لكن يسيب الأسهم تشتغل
      />
    </div>
  );
}
