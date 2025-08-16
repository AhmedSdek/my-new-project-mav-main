import { Calculate, Close, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Calc() {
  const [openCalc, setOpenCalc] = useState(false);
  const [total, setTotal] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [years, setYears] = useState("");
  const [maintenanceres, setMaintenanceres] = useState(0);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [openDilo, setOpenDilo] = React.useState(false);
  const [month, setMonth] = useState(0);
  const actions = [
    { icon: <Calculate />, name: "Calculator" },
    { icon: <Save />, name: "Save" },
  ];
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickOpen = () => {
    setOpenDilo(true);
  };
  const handleCloseDilo = () => setOpenDilo(false);
  return (
    <>
      <Box
        sx={{
          height: 320,
          transform: "translateZ(0px)",
          flexGrow: 1,
          position: "fixed",
          bottom: "85px",
          right: "5px",
          zIndex: "100",
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{ position: "absolute", bottom: 16, right: 1 }}
          className="calc-icon"
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          <SpeedDialAction
            icon={<Calculate />}
            tooltipTitle="Calculator"
            onClick={() => setOpenDilo(true)}
          />
        </SpeedDial>
      </Box>
      <Dialog
        open={openDilo}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleCloseDilo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Budget Calculator"}</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            sx={{ gap: 1, alignItems: "center", marginBottom: "10px" }}
            onSubmit={async (e) => {
              e.preventDefault();
            }}
          >
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                sx={{ width: "100%" }}
                required
                id="outlined-required"
                label="Total Budget"
                type="number"
                placeholder="EGP"
                value={total}
                className="inbutlapel
                                        "
                size="small"
                onChange={(e) => setTotal(e.target.value)}
              />
              <TextField
                sx={{ width: "100%" }}
                id="maintenance"
                label="Maintenance"
                type="number"
                placeholder="%"
                value={maintenance}
                className="inbutlapel
                                        "
                size="small"
                onChange={(e) => setMaintenance(e.target.value)}
              />
            </Stack>
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                sx={{ width: "100%" }}
                required
                id="downPayment"
                placeholder="%"
                label="Down Payment"
                type="number"
                size="small"
                className="inbutlapel
                                            "
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
              <TextField
                sx={{ width: "100%" }}
                required
                id="years"
                size="small"
                className="inbutlapel"
                label="years Of Installments"
                type="number"
                placeholder="0"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </Stack>
          </Stack>
          <Divider />
          <Container>
            <Row style={{ padding: "5px" }}>
              <Col className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Box sx={{ fontWeight: "bold" }}>
                  Down Paymant Amount
                  <Typography
                    sx={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      backgroundColor: "#0d4d8f2e",
                      color: "rgb(255 110 25)",
                      fontWeight: "bold",
                    }}
                  >
                    {amount} EGP
                  </Typography>
                </Box>
              </Col>
              <Col className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Box sx={{ fontWeight: "bold" }}>
                  Monthly Paymant
                  <Typography
                    sx={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      backgroundColor: "#0d4d8f2e",
                      color: "rgb(255 110 25)",
                      fontWeight: "bold",
                    }}
                  >
                    {month} EGP
                  </Typography>
                </Box>
              </Col>
              <Col className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Box sx={{ fontWeight: "bold" }}>
                  Quarterly payment
                  <Typography
                    sx={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      backgroundColor: "#0d4d8f2e",
                      color: "rgb(255 110 25)",
                      fontWeight: "bold",
                    }}
                  >
                    {month * 3} EGP
                  </Typography>
                </Box>
              </Col>
              <Col className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Box sx={{ fontWeight: "bold" }}>
                  Annual payment
                  <Typography
                    sx={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      backgroundColor: "#0d4d8f2e",
                      color: "rgb(255 110 25)",
                      fontWeight: "bold",
                    }}
                  >
                    {month * 12} EGP
                  </Typography>
                </Box>
              </Col>
              <Col className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Box sx={{ fontWeight: "bold" }}>
                  Maintenance
                  <Typography
                    sx={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      backgroundColor: "#0d4d8f2e",
                      color: "rgb(255 110 25)",
                      fontWeight: "bold",
                    }}
                  >
                    {maintenanceres} EGP
                  </Typography>
                </Box>
              </Col>
            </Row>
          </Container>
        </DialogContent>
        <DialogActions sx={{ gap: 2, justifyContent: "space-evenly" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setOpenDilo(false);
              setTotal("");
              setDownPayment("");
              setYears("");
              setMaintenance("");
              setAmount(0);
              setMonth(0);
              setMaintenanceres(0);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              setAmount((total * downPayment) / 100);
              setMonth((total - (total * downPayment) / 100) / (years * 12));
              setMaintenanceres((total * maintenance) / 100);
            }}
            className="calcbtn"
            type="submit"
            variant="contained"
            sx={{
              width: "150px",
              backgroundColor: "rgb(255 110 25)",
              color: "rgb(30, 65, 100)",
              fontWeight: "bold",
            }}
          >
            Calc
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Calc;
