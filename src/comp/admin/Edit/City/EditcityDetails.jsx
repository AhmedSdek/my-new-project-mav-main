import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../../../firebase/config";
import MavLoading from "../../../Loading/MavLoading";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FormGro from "../../FormGro";
import Input from "../../Input";
import FileUpload from "../../FileUpload";
import { Delete, HelpOutline } from "@mui/icons-material";
import ReactLoading from "react-loading";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function EditcityDetails() {
  const { editcityId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [btn, setBtn] = useState(false);
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const [developers, setDevelopers] = useState([]);
  const nav = useNavigate();
  const [value, loading] = useDocument(doc(db, "cityscape", editcityId));
  const [newData, setNewData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    cityscapeName: {
      ar: "",
      en: "",
    },
    cityscapeImgs: [],
    monyType: { ar: "", en: "" },
    downPayment: 0,
    years: 0,
    cashDiscount: 0,
    Location: {
      ar: "",
      en: "",
    },
    price: 0,
    discription: { ar: "", en: "" },
    offers: [{ pers: "", year: "", offer: "" }],
  });
  const [oldData, setOldData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    cityscapeName: {
      ar: "",
      en: "",
    },
    cityscapeImgs: [],
    monyType: { ar: "", en: "" },
    downPayment: 0,
    years: 0,
    cashDiscount: 0,
    Location: {
      ar: "",
      en: "",
    },
    price: 0,
    discription: { ar: "", en: "" },
    offers: [{ pers: "", year: "", offer: "" }],
  });
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "developer"));
        const devs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevelopers(devs);
      } catch (err) {
        console.error("خطأ أثناء جلب المطورين:", err);
      }
    };
    fetchDevelopers();
  }, []);
  const [offers, setOffers] = useState([{ pers: "", year: "", offer: "" }]);
  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
    []
  );
  const handleDevChange = useCallback(
    (e) => {
      const selectedDev = developers.find((dev) => dev.id === e.target.value);
      if (selectedDev) {
        setNewData((prev) => ({
          ...prev,
          developer: selectedDev,
          countryKey: selectedDev.country.en,
          devId: selectedDev.id,
          devIcon: selectedDev.img,
        }));
      }
    },
    [developers]
  );
  const onchange = useCallback(
    (parentKey, lang) => (e) => {
      setNewData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [lang]: e.target.value,
        },
      }));
    },
    []
  );
  const handleFileChange = useCallback(async (event) => {
    // أول ما تختار صور جديدة امسح الصور القديمة
    setNewData((prev) => ({
      ...prev,
      cityscapeImgs: [],
    }));

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "cityscape/" + event.target.files[i].name
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        event.target.files[i]
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProg(progress);
          setBtn(true);
        },
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewData((prev) => ({
              ...prev,
              cityscapeImgs: [...prev.cityscapeImgs, downloadURL],
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  const handleDynamicSelectChange = useCallback(
    (dataArray, fieldName) => (e) => {
      const selectedLabel = e.target.value;
      const selectedObject = dataArray.find(
        (item) => (item[lang] || item.en) === selectedLabel
      );
      setNewData((prev) => ({
        ...prev,
        [fieldName]: selectedObject || prev[fieldName],
      }));
    },
    [lang]
  );
  const handleOfferChange = useCallback(
    (index, field) => (e) => {
      const value = e.target.value;
      setOffers((prev) => {
        const updated = [...prev];
        updated[index][field] = value;
        return updated;
      });
    },
    []
  );
  useEffect(() => {
    if (value) {
      const data = value.data();
      const fullData = {
        developer: {},
        countryKey: "",
        devId: "",
        devIcon: "",
        cityscapeName: {
          ar: "",
          en: "",
        },
        cityscapeImgs: [],
        monyType: { ar: "", en: "" },
        downPayment: 0,
        years: 0,
        cashDiscount: 0,
        Location: {
          ar: "",
          en: "",
        },
        price: 0,
        discription: { ar: "", en: "" },
        offers: [{ pers: "", year: "", offer: "" }],
        ...data,
      };
      setNewData(fullData);
      setOldData(fullData);
      setOffers(fullData.offers || [{ pers: "", year: "", offer: "" }]);
    }
  }, [value]);
  const addOffer = () =>
    setOffers((prev) => [...prev, { pers: "", year: "", offer: "" }]);

  const removeOffer = (index) =>
    setOffers((prev) => prev.filter((_, i) => i !== index));
  const getChangedFields = (newObj, oldObj) => {
    let changedFields = {};
    for (let key in newObj) {
      if (
        typeof newObj[key] === "object" &&
        newObj[key] !== null &&
        !Array.isArray(newObj[key])
      ) {
        if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj?.[key])) {
          // في حالة object (زي dealName) ارسل كامل الـ object
          changedFields[key] = newObj[key];
        }
      } else if (
        JSON.stringify(newObj[key]) !== JSON.stringify(oldObj?.[key])
      ) {
        changedFields[key] = newObj[key];
      }
    }
    return changedFields;
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setBtn(true);
    try {
      if (!oldData) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "⚠️ البيانات الأصلية لم تحمل بعد",
        });
        // alert();
        return;
      }
      const changedFields = getChangedFields(newData, oldData);
      if (Object.keys(changedFields).length === 0) {
        Swal.fire({
          icon: "info",
          title: "No changes",
          text: "No changes were made to the data.",
        });
        // alert("⚠️ لا يوجد أي تعديل");
        return;
      }
      const docRef = doc(db, "cityscape", editcityId);
      await updateDoc(docRef, changedFields);
      // console.log(changedFields)
      setBtn(false);
      toast.success("The modification has been made.", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard/editcity");
    } catch (err) {
      console.error(err);
      setBtn(false);
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Oops ! Can't Edit",
      });
      // alert("❌ فشل في التعديل");
    } finally {
      setBtn(false);
    }
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <MavLoading />
      </div>
    );
  }
  return (
    <Stack
      sx={{
        minHeight: "calc(100vh - 100px)",
        padding: "70px 0 0",
        width: "100%",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack sx={{ alignItems: "center", marginBottom: "10px" }}>
        <Typography variant="h5">
          {lang === "ar" ? "تعديل العرض" : "ُEdit Deal"}
        </Typography>
      </Stack>
      <Card
        sx={{
          width: { xs: "90%", sm: "80%" },
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          margin: "10px 0 ",
        }}
      >
        <Box
          component="form"
          onSubmit={handleUpdate}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            margin: "15px 0 0",
            gap: "10px",
          }}
        >
          <FormGro
            inputLabel={lang === "ar" ? "اختر المطور" : "Select Developer"}
            name="dev"
            data={developers}
            value={newData.developer?.id || ""}
            fun={handleDevChange}
            lang={lang}
          />
          <Input
            onChange={onchange("cityscapeName", "en")}
            id="cityscape Name en"
            label={
              lang === "ar" ? "اسم السيتي سكيب انجليزي" : "cityscape Name en"
            }
            type="text"
            value={newData.cityscapeName.en}
          />

          <Input
            onChange={onchange("cityscapeName", "ar")}
            id="cityscape Name ar"
            label={lang === "ar" ? "اسم السيتي سكيب عربي" : "cityscape Name ar"}
            type="text"
            value={newData.cityscapeName.ar}
          />
          <Divider />
          <FileUpload
            handleFileChange={handleFileChange}
            multiple
            prog={prog}
            title={
              lang === "ar"
                ? "ارفع صور المشروع"
                : "Upload Your Project Images ..."
            }
          />
          <Input
            onChange={handleChange}
            id="price"
            label={lang === "ar" ? "السعر" : "Price"}
            type="number"
            name="price"
            value={newData.price}
          />
          <Input
            onChange={handleChange}
            id="cashDiscount"
            label={lang === "ar" ? "الخصم" : "cashDiscount"}
            type="number"
            name="cashDiscount"
            value={newData.cashDiscount}
          />
          <Input
            onChange={handleChange}
            id="years"
            label={lang === "ar" ? "عدد السنين" : "years"}
            type="number"
            name="years"
            value={newData.years}
          />
          <Input
            onChange={handleChange}
            id="downPayment"
            label={lang === "ar" ? "مقدم" : "downPayment"}
            type="number"
            name="downPayment"
            value={newData.downPayment}
          />
          <FormGro
            inputLabel={lang === "ar" ? "نوع العمله" : "Money Type"}
            name="monyType"
            data={monyType}
            value={newData.monyType[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(monyType, "monyType")}
            lang={lang}
          />
          {offers.map((offer, index) => (
            <Stack
              key={index}
              sx={{
                gap: "10px",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Input
                onChange={handleOfferChange(index, "pers")}
                label={`Pers ${index + 1}`}
                type="number"
                value={offer.pers}
              />
              <Input
                onChange={handleOfferChange(index, "year")}
                label={`Year ${index + 1}`}
                type="text"
                value={offer.year}
              />
              <Input
                onChange={handleOfferChange(index, "offer")}
                label={`Offer ${index + 1}`}
                type="text"
                value={offer.offer}
              />
              <Button
                onClick={() => removeOffer(index)}
                variant="outlined"
                color="error"
              >
                <Delete />
              </Button>
            </Stack>
          ))}
          <Button
            onClick={addOffer}
            variant="contained"
            style={{ margin: "10px 0" }}
          >
            {lang === "ar" ? "اضافه عرض +" : "+ Add Offer"}
          </Button>
          <IconButton onClick={() => setOpen(true)}>
            <HelpOutline />
          </IconButton>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
              <Typography
                style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}
              >
                {`📝 إزاي تستخدم Markdown:
 # عنوان رئيسي
 ## عنوان فرعي
 ### عنوان
 #### عنوان
 ##### عنوان
 ###### عنوان
 * نص مائل
 ** نص عريض
 ~~ نص مشطوب
 - قائمة نقطية
 1. قائمة مرقمة
 > اقتباس
 `}{" "}
              </Typography>
            </DialogContent>
          </Dialog>

          <Input
            onChange={onchange("discription", "en")}
            id="discription"
            label={lang === "ar" ? "تفاصيل انجليزي" : " Description en"}
            type="text"
            value={newData.discription.en}
            multiline
            rows={4}
          />
          <Input
            onChange={onchange("discription", "ar")}
            id="discriptioner"
            label={lang === "ar" ? "تفاصيل عربي" : "Description ar"}
            type="text"
            value={newData.discription.ar}
            multiline
            rows={4}
          />
          <Input
            onChange={onchange("Location", "en")}
            id="location"
            label={lang === "ar" ? "الموقع انجليزي" : "Location en"}
            type="text"
            value={newData.Location.en}
          />
          <Input
            onChange={onchange("Location", "ar")}
            id="location"
            label={lang === "ar" ? "الموقع عربي" : "Location ar"}
            type="text"
            value={newData.Location.ar}
          />
          <Button
            disabled={btn}
            variant="contained"
            type="submit"
            style={{ width: "50%" }}
          >
            {btn ? (
              <ReactLoading type={"spin"} height={"20px"} width={"20px"} />
            ) : lang === "ar" ? (
              "ارسال"
            ) : (
              "Send"
            )}
          </Button>
        </Box>
      </Card>
    </Stack>
  );
}

export default EditcityDetails;
