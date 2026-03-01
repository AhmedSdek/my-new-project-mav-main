import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
  Slide,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Grid,
  Paper,
} from "@mui/material";
import {
  Calculate,
  AccountBalanceWallet,
  CalendarMonth,
  Handyman,
  QueryBuilder,
  EventNote,
} from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// مكون فرعي لعرض النتائج بشكل أنيق
const ResultCard = ({ label, value, icon, color = "#1e4164" }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: "#f8f9fa",
      borderRadius: 3,
      border: "1px solid #edf2f7",
      height: "100%",
    }}>
    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
      {icon}
      <Typography variant="caption" fontWeight="bold" color="text.secondary">
        {label}
      </Typography>
    </Stack>
    <Typography variant="body1" fontWeight="800" color={color}>
      {Number(value).toLocaleString()}{" "}
      <small style={{ fontSize: "10px" }}>EGP</small>
    </Typography>
  </Paper>
);

function Calc() {
  const [open, setOpen] = useState(false);
  const [openDilo, setOpenDilo] = useState(false);

  // States للمدخلات
  const [values, setValues] = useState({
    total: "",
    downPayment: "",
    maintenance: "",
    years: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // حساب النتائج تلقائياً عند تغيير المدخلات
  const results = useMemo(() => {
    const total = parseFloat(values.total) || 0;
    const dpPercent = parseFloat(values.downPayment) || 0;
    const maintPercent = parseFloat(values.maintenance) || 0;
    const yrs = parseFloat(values.years) || 0;

    const dpAmount = (total * dpPercent) / 100;
    const maintAmount = (total * maintPercent) / 100;
    const remaining = total - dpAmount;
    const monthly = yrs > 0 ? remaining / (yrs * 12) : 0;

    return {
      dpAmount,
      monthly,
      quarterly: monthly * 3,
      annual: monthly * 12,
      maintAmount,
    };
  }, [values]);

  const handleReset = () => {
    setValues({ total: "", downPayment: "", maintenance: "", years: "" });
    setOpenDilo(false);
  };

  return (
    <>
      {/* Floating SpeedDial */}
      <SpeedDial
        ariaLabel="Calculator Dial"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        icon={<SpeedDialIcon openIcon={<Calculate />} />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}>
        <SpeedDialAction
          icon={<Calculate />}
          tooltipTitle="Budget Calculator"
          onClick={() => setOpenDilo(true)}
        />
      </SpeedDial>

      <Dialog
        open={openDilo}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDilo(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1e4164",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}>
          <Calculate color="primary" /> Budget Calculator
        </DialogTitle>

        <DialogContent dividers>
          {/* Input Section */}
          <Grid container spacing={2} sx={{ mb: 3, mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Budget"
                name="total"
                type="number"
                variant="outlined"
                size="small"
                value={values.total}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maintenance (%)"
                name="maintenance"
                type="number"
                variant="outlined"
                size="small"
                value={values.maintenance}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Down Payment (%)"
                name="downPayment"
                type="number"
                variant="outlined"
                size="small"
                value={values.downPayment}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Installment Years"
                name="years"
                type="number"
                variant="outlined"
                size="small"
                value={values.years}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.disabled"
              fontWeight="bold">
              CALCULATION RESULTS
            </Typography>
          </Divider>

          {/* Results Display Section */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ResultCard
                label="Down Payment"
                value={results.dpAmount}
                icon={
                  <AccountBalanceWallet
                    fontSize="small"
                    sx={{ color: "#ff6e19" }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ResultCard
                label="Maintenance"
                value={results.maintAmount}
                icon={<Handyman fontSize="small" sx={{ color: "#ff6e19" }} />}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <ResultCard
                label="Monthly"
                value={results.monthly.toFixed(0)}
                icon={
                  <CalendarMonth fontSize="small" sx={{ color: "#1e4164" }} />
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <ResultCard
                label="Quarterly"
                value={results.quarterly.toFixed(0)}
                icon={
                  <QueryBuilder fontSize="small" sx={{ color: "#1e4164" }} />
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ResultCard
                label="Annual"
                value={results.annual.toFixed(0)}
                icon={<EventNote fontSize="small" sx={{ color: "#1e4164" }} />}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleReset} color="inherit" variant="text">
            Clear & Close
          </Button>
          <Button
            onClick={() => setOpenDilo(false)}
            variant="contained"
            sx={{
              bgcolor: "#ff6e19",
              "&:hover": { bgcolor: "#e65a00" },
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
            }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Calc;
