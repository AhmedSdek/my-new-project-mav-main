import { Close, Tune, Search, RestartAlt } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import React, { memo, useState } from "react";

function Filter({
  data,
  lang,
  setFilters,
  filters,
  label,
  length, // بنستلم هنا النتائج
  defaultFilters,
}) {
  const [open, setOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [startY, setStartY] = useState(null);
  const isAr = lang === "ar";

  // حل مشكلة الـ Object: التأكد من تحويل المصفوفة لعدد
  const resultsCount = Array.isArray(length)
    ? length.length
    : typeof length === "object"
    ? 0
    : length;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setDragProgress(0);
  };

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (startY !== null) {
      const distance = e.touches[0].clientY - startY;
      const progress = Math.min(Math.max(distance / 100, 0), 1);
      setDragProgress(progress);
    }
  };
  const handleTouchEnd = () => {
    setStartY(null);
    setDragProgress(0);
  };

  const handleSliderChange = (type) => (event, newValue) => {
    setFilters((prev) => ({ ...prev, [type]: newValue }));
  };

  const filterFields = [
    { label: isAr ? "النوع" : "Type", key: "type", dataKey: "Type" },
    { label: isAr ? "الغرف" : "Bedrooms", key: "bed", dataKey: "Bed" },
    { label: isAr ? "الحمامات" : "Bathrooms", key: "bath", dataKey: "Bath" },
    { label: isAr ? "التشطيب" : "Finishing", key: "Finsh", dataKey: "Finsh" },
    { label: isAr ? "الحالة" : "Sale Status", key: "sale", dataKey: "Sale" },
    {
      label: isAr ? "نوع العملة" : "Currency",
      key: "monyType",
      dataKey: "monyType",
    },
    {
      label: isAr ? "الكمبوند" : "Compound",
      key: "compoundName",
      dataKey: "compoundName",
    },
  ];

  return (
    <>
      {/* Search Bar & Filter Button */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ width: "100%", alignItems: "center" }}>
        <TextField
          fullWidth
          placeholder={isAr ? label.ar : label.en}
          variant="outlined"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "15px",
              bgcolor: "#fcfcfc",
              "& fieldset": { borderColor: "#eee" },
            },
          }}
        />
        <Badge
          badgeContent={
            Object.values(filters).filter(
              (v) => v !== "" && !Array.isArray(v) && v !== 0
            ).length
          }
          color="primary">
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{
              width: 54,
              height: 54,
              bgcolor: "#1e4164",
              color: "white",
              borderRadius: "15px",
              "&:hover": { bgcolor: "#2a5582" },
            }}>
            <Tune />
          </IconButton>
        </Badge>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        PaperProps={{
          sx: {
            borderRadius: "30px 30px 0 0",
            height: "85vh",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            direction: isAr ? "rtl" : "ltr",
          },
        }}>
        {/* شريط السحب العلوي */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
          <Box
            sx={{
              width: 45,
              height: 5 + dragProgress * 5,
              bgcolor: "#e0e0e0",
              borderRadius: "10px",
              transition: "all 0.2s ease",
            }}
          />
        </Box>

        {/* رأس القائمة */}
        <Box
          sx={{
            px: 2.5,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e4164" }}>
            {isAr ? "تصفية النتائج" : "Filter Results"}
          </Typography>
          <IconButton onClick={toggleDrawer(false)} sx={{ bgcolor: "#f5f5f5" }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* محتوى الفلاتر */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 2 }}>
          <Grid container direction="column" spacing={2.5}>
            {filterFields.map((field) => (
              <Grid item xs={12} key={field.key}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 700, color: "#555", px: 0.5 }}>
                  {field.label}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={filters[field.key]}
                    displayEmpty
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "#f9f9f9",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#eee",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff6e19",
                      },
                    }}>
                    <MenuItem value="">{isAr ? "الكل" : "All"}</MenuItem>
                    {Array.from(
                      new Set(data.map((d) => d[field.dataKey]?.[lang]))
                    )
                      .filter(Boolean)
                      .map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 1,
                  p: 3,
                  bgcolor: "#f8f9fb",
                  borderRadius: "20px",
                  border: "1px solid #f0f0f0",
                }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, mb: 3, color: "#1e4164" }}>
                  {isAr ? "نطاق السعر والمساحة" : "Price & Area Range"}
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#777" }}>
                    {isAr
                      ? `السعر الأقصى: ${filters.price.toLocaleString()}`
                      : `Max Price: ${filters.price.toLocaleString()}`}
                  </Typography>
                  <Slider
                    value={filters.price}
                    onChange={handleSliderChange("price")}
                    min={0}
                    max={100000000}
                    step={500000}
                    sx={{ color: "#ff6e19" }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#777" }}>
                    {isAr
                      ? `المساحة القصوى: ${filters.area} م²`
                      : `Max Area: ${filters.area} m²`}
                  </Typography>
                  <Slider
                    value={filters.area}
                    onChange={handleSliderChange("area")}
                    min={0}
                    max={10000}
                    sx={{ color: "#1e4164" }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* أزرار التحكم الثابتة مع العداد المصحح */}
        <Box sx={{ p: 3, borderTop: "1px solid #f0f0f0", bgcolor: "white" }}>
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={() => {
                setFilters(defaultFilters);
                setOpen(false);
              }}
              sx={{
                borderRadius: "14px",
                py: 1.5,
                fontWeight: 700,
                color: "#666",
                borderColor: "#ddd",
              }}>
              {isAr ? "إعادة تعيين" : "Reset"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={toggleDrawer(false)}
              sx={{
                borderRadius: "14px",
                py: 1.5,
                fontWeight: 800,
                bgcolor: "#ff6e19",
                "&:hover": { bgcolor: "#e56216" },
                boxShadow: "0 8px 20px rgba(255, 110, 25, 0.3)",
                display: "flex",
                gap: 1,
              }}>
              <span>{isAr ? "إظهار النتائج" : "Show Results"}</span>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  px: 1,
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                }}>
                {resultsCount}
              </Box>
            </Button>
          </Stack>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default memo(Filter);
