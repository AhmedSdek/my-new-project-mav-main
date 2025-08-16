import { Close, Tune } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import React, { memo, useState } from "react";

function Filter({
  data,
  lang,
  setFilters,
  filters,
  label,
  length,
  defaultFilters,
}) {
  const [open, setOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 = خط, 1 = مثلث
  const [startY, setStartY] = useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setDragProgress(0);
    setStartY(null);
  };

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (startY !== null) {
      const distance = e.touches[0].clientY - startY;
      const progress = Math.min(Math.max(distance / 100, 0), 1); // بين 0 و 1
      setDragProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
    setDragProgress(0); // يرجع خط بعد ما يسيب
  };

  const handleSliderChange = (type) => (event, newValue) => {
    setFilters((prev) => ({ ...prev, [type]: newValue }));
  };
  return (
    <>
      <Stack
        sx={{
          flexDirection: "row",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          label={`${lang === "ar" ? label.ar : label.en}`}
          variant="outlined"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{
            borderRadius: 1,
            width: 40,
            height: 40,
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <Tune />
        </IconButton>
      </Stack>
      <SwipeableDrawer
        PaperProps={{
          sx: {
            borderRadius: "20px 20px 0 0",
            display: "flex",
            flexDirection: "column",
            height: "80vh", // تحديد ارتفاع مناسب
          },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "13px",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 6 + dragProgress * 8, // يكبر شوية أثناء السحب
              background: "grey",
              borderRadius: `${4 - dragProgress * 4}px ${
                4 - dragProgress * 4
              }px ${dragProgress * 12}px ${dragProgress * 12}px`, // الحواف السفلية تنزل لتحت تدريجيًا
              transition: startY ? "none" : "all 0.3s ease",
            }}
          />
        </Stack>
        {/* ===== Header ثابت ===== */}
        <Box
          sx={{
            flexShrink: 0,
            padding: "15px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "materialBold",
              fontSize: "20px",
              color: "rgb(30, 65, 100)",
              textTransform: "uppercase",
              letterSpacing: "4.14px",
            }}
          >
            {lang === "ar" ? "خيارات البحث" : "Filter options"}
          </Typography>
        </Box>

        <Stack sx={{ flexGrow: 1, overflowY: "auto", padding: "20px" }}>
          <Grid
            container
            spacing={4}
            sx={{
              px: 4,
              justifyContent: { xs: "center", md: "initial" },
            }}
          >
            {/* Type Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(data.map((d) => d.Type?.[lang]))).map(
                    (type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Bedrooms Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Bedrooms</InputLabel>
                <Select
                  label="Bedrooms"
                  value={filters.bed}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bed: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(data.map((d) => d.Bed?.[lang]))].map(
                    (bed, index) => (
                      <MenuItem key={index} value={bed}>
                        {bed}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Bathrooms Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Bath</InputLabel>
                <Select
                  label="Bath"
                  value={filters.bath}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bath: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(data.map((d) => d.Bath?.[lang]))].map(
                    (bath, index) => (
                      <MenuItem key={index} value={bath}>
                        {bath}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Finishing Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Finishing</InputLabel>
                <Select
                  label="Finishing"
                  value={filters.Finsh}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      Finsh: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(data.map((d) => d.Finsh?.[lang]))).map(
                    (Finsh) => (
                      <MenuItem key={Finsh} value={Finsh}>
                        {Finsh}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Sale Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Sale</InputLabel>
                <Select
                  label="Sale"
                  value={filters.sale}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sale: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(data.map((d) => d.Sale?.[lang]))).map(
                    (sale) => (
                      <MenuItem key={sale} value={sale}>
                        {sale}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Money Type Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Money Type</InputLabel>
                <Select
                  label="Money Type"
                  value={filters.monyType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      monyType: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(data.map((d) => d.monyType?.[lang]))).map(
                    (mony) => (
                      <MenuItem key={mony} value={mony}>
                        {mony}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Compound Name Filter */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Compound</InputLabel>
                <Select
                  label="Compound"
                  value={filters.compoundName}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      compoundName: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(
                    new Set(data.map((d) => d.compoundName?.[lang]))
                  ).map((compound, index) => (
                    <MenuItem key={index} value={compound}>
                      {compound}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range Slider */}
          </Grid>
          <Grid container spacing={4} sx={{ p: "20px" }}>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ flexGrow: 1 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.price}
                onChange={handleSliderChange("price")}
                valueLabelDisplay="auto"
                step={100000}
                min={0}
                max={10000000}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ flexGrow: 1 }}>
              <Typography gutterBottom>Area Range (m²)</Typography>
              <Slider
                value={filters.area}
                onChange={handleSliderChange("area")}
                valueLabelDisplay="auto"
                step={10}
                min={0}
                max={10000}
              />
            </Grid>
          </Grid>
        </Stack>
        {/* ===== Actions ثابتة تحت ===== */}
        <Stack
          sx={{
            flexShrink: 0,
            borderTop: "1px solid #ddd",
            padding: "15px 40px",
            flexDirection: { sm: "row" },
            display: "flex",
            justifyContent: "center",
            gap: 3,
            background: "#fff",
          }}
        >
          <Badge
            sx={{ flexGrow: 1 }}
            badgeContent={length.length}
            color="secondary"
            showZero
          >
            <Button
              sx={{ width: "100%" }}
              color="primary"
              variant="contained"
              onClick={toggleDrawer(false)}
            >
              Apply
            </Button>
          </Badge>
          <Button
            sx={{ flexGrow: 1 }}
            color="error"
            variant="outlined"
            onClick={() => {
              setFilters(defaultFilters);
              setOpen(false);
              setDragProgress(0);
              setStartY(null);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </SwipeableDrawer>
    </>
  );
}

export default memo(Filter);
