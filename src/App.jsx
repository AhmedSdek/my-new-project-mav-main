import "./App.css";
import "animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobal } from "./context/GlobalContext";
import Navs from "./comp/Nave";
import Footer from "./comp/Footer";
import ScrollToTop from "./comp/ScrollToTop";
import MavLoading from "./comp/Loading/MavLoading";

// 🌀 Lazy imports
const Dashboard = lazy(() => import("./comp/admin/Dashboard"));
const ReSale = lazy(() => import("./comp/admin/reSale/ReSale"));
const SaleData = lazy(() => import("./comp/admin/SaleData"));
const FindHomeDetails = lazy(() =>
  import("./comp/Find a Home/FindHomeDetails")
);
const SellDetails = lazy(() => import("./comp/admin/SellDetails"));
const FindCompDetails = lazy(() =>
  import("./comp/Find a Home/FindCompDetails")
);
const NewLaunchesForm = lazy(() =>
  import("./comp/admin/newLaunchesform/NewLaunchesForm")
);
const EditDeveloper = lazy(() =>
  import("./comp/admin/Edit/Developer/EditDeveloper")
);
const EditDealdetails = lazy(() =>
  import("./comp/admin/Edit/Deals/EditDealdetails")
);
const Editdevdetails = lazy(() =>
  import("./comp/admin/Edit/Developer/Editdevdetails")
);
const EditDeals = lazy(() => import("./comp/admin/Edit/Deals/EditDeals"));
const Editluanches = lazy(() =>
  import("./comp/admin/Edit/Luanches/Editluanches")
);
const Editluanchesdetails = lazy(() =>
  import("./comp/admin/Edit/Luanches/Editluanchesdetails")
);
const Err = lazy(() => import("./comp/Err/Err"));
const Cityscape = lazy(() => import("./comp/admin/cityscape/Cityscape"));
const EditCity = lazy(() => import("./comp/admin/Edit/City/EditCity"));
const Inventory = lazy(() => import("./comp/admin/inventory/Inventory"));
const InventoryDetails = lazy(() =>
  import("./comp/inventory/InventoryDetails")
);
const DeveloperForm = lazy(() =>
  import("./comp/admin/developerForm/DeveloperForm")
);
const CompoundsForm = lazy(() => import("./comp/admin/Compound/CompoundsForm"));
const EditCompound = lazy(() =>
  import("./comp/admin/Edit/Compound/EditCompound")
);
const EditCompoundProject = lazy(() =>
  import("./comp/admin/Edit/Compound/EditCompoundProject")
);
const LoginForm = lazy(() => import("./Auth/Login"));
const RegisterForm = lazy(() => import("./Auth/SignUp"));
const EditInventory = lazy(() =>
  import("./comp/admin/Edit/Inventory/EditInventory")
);
const EditinventoryDetails = lazy(() =>
  import("./comp/admin/Edit/Inventory/EditinventoryDetails")
);
const EditcityDetails = lazy(() =>
  import("./comp/admin/Edit/City/EditcityDetails")
);
const SahelForm = lazy(() => import("./comp/admin/sahelForm/SahelForm"));
const EditSahel = lazy(() => import("./comp/admin/Edit/sahel/EditSahel"));
const EditSahelDetails = lazy(() =>
  import("./comp/admin/Edit/sahel/EditSahelDetails")
);
const Home = lazy(() => import("./pages/homeSections/home/Home"));
const SahelMapPage = lazy(() => import("./pages/sahel Page/SahelMapPage"));
const CityscapeProjects = lazy(() =>
  import("./pages/cityscape Page/CityscapeProjects")
);
const NewLaunches = lazy(() => import("./pages/New Launches Page/NewLaunches"));
const NewLaunchDetails = lazy(() =>
  import("./pages/New Launches Page/NewLaunchDetails")
);
const Developers = lazy(() => import("./pages/developers Page/Developers"));
const DeveloperDetails = lazy(() =>
  import("./pages/developers Page/DeveloperDetails")
);
const ProjectDe = lazy(() => import("./pages/developers Page/ProjectDe"));
const MaverickDeals = lazy(() => import("./pages/deals Page/MaverickDeals"));
const DealDetails = lazy(() => import("./pages/deals Page/DealDetails"));
const AboutUs = lazy(() => import("./pages/about page/AboutUs"));
const ContactUs = lazy(() => import("./pages/Contact Page/ContactUs"));
const Sell = lazy(() => import("./pages/sell-rent Page/Sell"));
const FavoriteList = lazy(() => import("./pages/FavList page/FavoriteList"));
const District = lazy(() => import("./pages/district page/District"));
const NorthCoastProjects = lazy(() =>
  import("./pages/north Coast Projects page/NorthCoastProjects")
);
const NorthCoastProjectsDetails = lazy(() =>
  import("./pages/north Coast Projects page/NorthCoastProjectsDetails")
);

function App() {
  const { i18n } = useTranslation();
  const { setCountry } = useGlobal();
  const [mode, setMode] = useState(localStorage.getItem("mtTheme") || "light");

  const darkTheme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? { background: { default: "#f0f2f5" } }
        : { background: { default: "#000000eb" } }),
    },
  });

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
      setCountry(JSON.parse(savedCountry));
    } else {
      const defaultCountry = { en: "egypt", ar: "مصر" };
      setCountry(defaultCountry);
      localStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box>
        <Navs />
        <ToastContainer />
        <ScrollToTop />
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 100px)",
              }}
            >
              <MavLoading />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<SaleData />} />
              <Route path="developerform" element={<DeveloperForm />} />
              <Route path="resale" element={<ReSale />} />
              <Route path="compound" element={<CompoundsForm />} />
              <Route path="editcompound" element={<EditCompound />} />
              <Route
                path="editcompound/:editcompoundprojId"
                element={<EditCompoundProject />}
              />
              <Route path="inventory" element={<Inventory />} />
              <Route path="editinventory" element={<EditInventory />} />
              <Route
                path="editinventory/:inventoryId"
                element={<EditinventoryDetails />}
              />
              <Route path="details/:id" element={<SellDetails />} />
              <Route path="newlaunchesform" element={<NewLaunchesForm />} />
              <Route path="editDeveloper" element={<EditDeveloper />} />
              <Route
                path="editDeveloper/:editDeveloperId"
                element={<Editdevdetails />}
              />
              <Route path="editDeals" element={<EditDeals />} />
              <Route
                path="editDeals/:editeDealdetailsId"
                element={<EditDealdetails />}
              />
              <Route path="editluanches" element={<Editluanches />} />
              <Route
                path="editluanches/:editluanchesdetailsId"
                element={<Editluanchesdetails />}
              />
              <Route path="cityscape" element={<Cityscape />} />
              <Route path="editcity" element={<EditCity />} />
              <Route
                path="editcity/:editcityId"
                element={<EditcityDetails />}
              />
              <Route path="northcoast" element={<SahelForm />} />
              <Route path="editsahel" element={<EditSahel />} />
              <Route path="editsahel/:sahelid" element={<EditSahelDetails />} />
            </Route>

            <Route path="/:districtid" element={<District />} />
            <Route path="findhome" element={<FindHomeDetails />}>
              <Route
                path=":districtid/:findprojId"
                element={<FindCompDetails />}
              />
            </Route>
            <Route path="newlaunches" element={<NewLaunches />} />
            <Route
              path="newlaunches/:launchId"
              element={<NewLaunchDetails />}
            />
            <Route path="northcoast" element={<NorthCoastProjects />} />
            <Route
              path="northcoast/:id"
              element={<NorthCoastProjectsDetails />}
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/favoriteList" element={<FavoriteList />} />
            <Route path="/sahelmap" element={<SahelMapPage />} />
            <Route path="/cityscapeprojects" element={<CityscapeProjects />} />
            <Route path="/maverickdeals" element={<MaverickDeals />} />
            <Route path="/maverickdeals/:dealId" element={<DealDetails />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/developers/:devId" element={<DeveloperDetails />} />
            <Route path="/developers/:devId/:projId" element={<ProjectDe />} />
            <Route
              path="/developers/:devId/:projId/:compId"
              element={<InventoryDetails />}
            />
            <Route path="/*" element={<Err />} />
          </Routes>
        </Suspense>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
