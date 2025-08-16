import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

function BasicDateRangeCalendar({ onDateChange, startDate, endDate, lang }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{ flexDirection: { xs: "column", md: "row" } }}
        display="flex"
        gap={2}
        width="100%"
        justifyContent="space-between"
      >
        <DatePicker
          sx={{ width: "100%" }}
          value={startDate}
          onChange={(newValue) => onDateChange("startDate", newValue)}
          label={lang === "ar" ? "تاريخ البداية" : "Start Date"}
        />
        <DatePicker
          sx={{ width: "100%" }}
          value={endDate}
          onChange={(newValue) => onDateChange("endDate", newValue)}
          label={lang === "ar" ? "تاريخ النهاية" : "End Date"}
        />
      </Box>
    </LocalizationProvider>
  );
}
export default React.memo(BasicDateRangeCalendar);
