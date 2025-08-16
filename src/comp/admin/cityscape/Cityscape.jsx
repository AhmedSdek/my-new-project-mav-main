import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Dialog, DialogContent, Divider, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography, styled } from '@mui/material';
import ReactLoading from 'react-loading';
import 'react-phone-input-2/lib/style.css'
import { AddPhotoAlternate, Delete, HelpOutline, Info } from '@mui/icons-material';
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../firebase/config';
import FormGro from '../FormGro';
import Input from '../Input';
import CheckboxCom from '../CheckboxCom';
import FileUpload from '../FileUpload';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
function Cityscape() {
    const nav = useNavigate()
  const [developers, setDevelopers] = useState([]);
  const [devLoading, setDevLoading] = useState(true);
  const [prog, setProg] = useState(0);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [btn, setBtn] = useState(false);
  const [open, setOpen] = useState(false);
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
  const [offers, setOffers] = useState([{ pers: "", year: "", offer: "" }]);
  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
    []
  );
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
      } finally {
        setDevLoading(false);
      }
    };
    fetchDevelopers();
  }, []);
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
  const onchange = useCallback((parentKey, lang) => (e) => {
    setNewData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [lang]: e.target.value
      }
    }));
  }, []);
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
        [fieldName]: selectedObject || prev[fieldName]
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

  const addOffer = () =>
    setOffers((prev) => [...prev, { pers: "", year: "", offer: "" }]);

  const removeOffer = (index) =>
    setOffers((prev) => prev.filter((_, i) => i !== index));

  const sendData = async (dataToSend) => {
    setBtn(true);
    try {
      const id = new Date().getTime();
      await setDoc(doc(db, "cityscape", `${id}`), {
        id: `${id}`,
        ...dataToSend,
      });
      toast.success("The data has been sent..", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard");
      setBtn(false);
    } catch (er) {
      console.error("Send error:", er);
      toast.error("Oops! Something went wrong.", { autoClose: 2000 });
      setBtn(false);
    }
  };
  const onsubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // اربط الـ offers بالـ newData
      const dataToSend = { ...newData, offers };
      console.log(newData);
      await sendData(dataToSend);
    },
    [newData, offers] // لازم تحط offers هنا كمان
  );

  return (
    <>
      <Box
        style={{
          width: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "70px 0 0",
        }}
      >
        <Stack sx={{ alignItems: "center", marginBottom: "10px" }}>
          <Typography variant="h5">{lang === "ar" ? "اضف سكيب" : "Add cityscape"}</Typography>
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
            onSubmit={onsubmit}
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
              label={lang === "ar" ? "اسم السيتي سكيب انجليزي" : "cityscape Name en"}
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
                sx={{ gap: "10px", alignItems: "center", flexDirection: 'row', width: '100%' }}
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
                <Typography style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
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
              ) : (
                lang === "ar" ? "ارسال" : "Send"
              )}
            </Button>
          </Box>
        </Card>
      </Box>
        </>
    )
}

export default Cityscape