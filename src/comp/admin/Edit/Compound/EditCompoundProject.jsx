import { Box, Button, Card, Container, Dialog, DialogContent, Divider, IconButton, Stack, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../../../../firebase/config';
import FormGro from '../../FormGro';
import Input from '../../Input';
import FileUpload from '../../FileUpload';
import CheckboxCom from '../../CheckboxCom';
import { Delete, HelpOutline } from '@mui/icons-material';
import isEqual from "lodash.isequal";
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useDocument } from "react-firebase-hooks/firestore";
import Swal from "sweetalert2";

function EditCompoundProject() {
  const { editcompoundprojId, editcompoundId } = useParams();
  // console.log(editcompoundprojId)
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [developers, setDevelopers] = useState([]);
  // console.log(developers)
  const [devLoading, setDevLoading] = useState(true);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [btn, setBtn] = useState(false);
  const [prog3, setProg3] = useState(0);
  const [prog, setProg] = useState(0);
  const [value, loading] = useDocument(doc(db, "compound", editcompoundprojId));

  const [newData, setNewData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    compoundName: {
      ar: "",
      en: "",
    },
    compoundImgs: [],
    district: {
      ar: "",
      en: "",
    },
    price: 0,
    compoundDes: {
      ar: "",
      en: "",
    },
    masterplanImg: [],
    Location: {
      ar: "",
      en: "",
    },
    aminatis: [],
    type: [],
    monyType: { ar: "", en: "" },
    offers: [{ pers: "", year: "", offer: "" }],
  });

  console.log(newData);
  const [oldData, setOldData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    compoundName: {
      ar: "",
      en: "",
    },
    compoundImgs: [],
    district: {
      ar: "",
      en: "",
    },
    price: 0,
    compoundDes: {
      ar: "",
      en: "",
    },
    masterplanImg: [],
    Location: {
      ar: "",
      en: "",
    },
    aminatis: [],
    type: [],
    monyType: { ar: "", en: "" },
    offers: [{ pers: "", year: "", offer: "" }],
  });
  console.log(oldData);
  useEffect(() => {
    if (value) {
      const data = value.data();
      const fullData = {
        developer: {},
        countryKey: "",
        devId: "",
        devIcon: "",
        compoundName: {
          ar: "",
          en: "",
        },
        compoundImgs: [],
        district: {
          ar: "",
          en: "",
        },
        price: 0,
        compoundDes: {
          ar: "",
          en: "",
        },
        masterplanImg: [],
        Location: {
          ar: "",
          en: "",
        },
        aminatis: [],
        type: [],
        monyType: { ar: "", en: "" },
        offers: [{ pers: "", year: "", offer: "" }],
        ...data,
      };
      setNewData(fullData);
      setOldData(fullData);
      setOffers(fullData.offers || [{ pers: "", year: "", offer: "" }]);
    }
  }, [value]);
  // useEffect(() => {
  //   const fetchCompoundData = async () => {
  //     try {
  //       const snapshot = await getDocs(collection(db, "compound"));
  //       let found = false;
  //       snapshot.forEach((docSnap) => {
  //         const data = docSnap.data();
  //         const compounds = data.compounds || [];
  //         const targetCompound = compounds.find(
  //           (comp) => comp.id === editcompoundprojId
  //         );
  //         console.log(targetCompound);
  //         if (targetCompound) {
  //           setNewData(targetCompound);
  //           setOldData(targetCompound);
  //           setOffers(
  //             targetCompound.offers || [{ pers: "", year: "", offer: "" }]
  //           );
  //           found = true;
  //         }
  //       });
  //       if (!found) {
  //         console.warn("🚨 لم يتم العثور على الكمباوند المطلوب");
  //       }
  //     } catch (err) {
  //       console.error("❌ خطأ أثناء تحميل بيانات الكمباوند:", err);
  //     }
  //   };

  //   fetchCompoundData();
  // }, [editcompoundprojId]);

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

  const handleChange = useCallback((e) => {
    setNewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);
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
    if (event.target.files.length > 0) {
      // افرغ الصور القديمة
      setNewData((prev) => ({
        ...prev,
        compoundImgs: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(storage, "compound/" + event.target.files[i].name);
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
              compoundImgs: [...prev.compoundImgs, downloadURL], // ضيف الصور وحدة وحدة
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);

  const handleMasterplanImgChange = useCallback(async (event) => {
    if (event.target.files.length > 0) {
      // افرغ الصور القديمة
      setNewData((prev) => ({
        ...prev,
        masterplanImg: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(storage, "compound/" + event.target.files[i].name);
      const uploadTask = uploadBytesResumable(
        storageRef,
        event.target.files[i]
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProg3(progress);
          setBtn(true);
        },
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewData((prev) => ({
              ...prev,
              masterplanImg: [...prev.masterplanImg, downloadURL], // ضيف الصور وحدة وحدة
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);

  const handleCheckboxChange = useCallback((selectedItem) => {
    setNewData((prev) => {
      const exists = prev.aminatis.some(
        (item) => item.en === selectedItem.en && item.ar === selectedItem.ar
      );
      return {
        ...prev,
        aminatis: exists
          ? prev.aminatis.filter(
              (item) =>
                item.en !== selectedItem.en || item.ar !== selectedItem.ar
            )
          : [...prev.aminatis, selectedItem],
      };
    });
  }, []);

  const handleCheckbox2Change = useCallback((selectedItem) => {
    setNewData((prev) => {
      const exists = prev.type.some(
        (item) => item.en === selectedItem.en && item.ar === selectedItem.ar
      );
      return {
        ...prev,
        type: exists
          ? prev.type.filter(
              (item) =>
                item.en !== selectedItem.en || item.ar !== selectedItem.ar
            )
          : [...prev.type, selectedItem],
      };
    });
  }, []);

  // Offers Handlers
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
  const addOffer = () =>
    setOffers((prev) => [...prev, { pers: "", year: "", offer: "" }]);

  const removeOffer = (index) =>
    setOffers((prev) => prev.filter((_, i) => i !== index));

  const checkBoxOptions1 = useMemo(
    () => [
      { en: "Clubhouse", ar: "النادي الاجتماعي" },
      { en: "Commercial Strip", ar: "الشريط التجاري" },
      { en: "Underground Parking", ar: "مواقف سيارات تحت الأرض" },
      { en: "Outdoor Pools", ar: "حمامات سباحة خارجية" },
      { en: "Jogging Trail", ar: "مسار للجري" },
      { en: "Bicycles Lanes", ar: "مسارات للدراجات" },
      { en: "Business Hub", ar: "مركز أعمال" },
      { en: "Schools", ar: "مدارس" },
      { en: "Sports Clubs", ar: "أندية رياضية" },
      { en: "Livability", ar: "جودة الحياة" },
      { en: "Infrastructure", ar: "البنية التحتية" },
      { en: "mosque", ar: "مسجد" },
      { en: "children area", ar: "منطقة للأطفال" },
      { en: "kids' area", ar: "منطقة لعب للأطفال" },
      { en: "gym", ar: "صالة رياضية (جيم)" },
      { en: "spa", ar: "مركز سبا" },
      { en: "Educational hub", ar: "مركز تعليمي" },
      { en: "Commercial area", ar: "منطقة تجارية" },
      { en: "Medical centre", ar: "مركز طبي" },
    ],
    []
  );
  const checkBoxOptions2 = useMemo(
    () => [
      { en: "Villa", ar: "فيلا" },
      { en: "Retail", ar: "محل تجاري" },
      { en: "Office", ar: "مكتب" },
      { en: "Cabin", ar: "كوخ / كابينة" },
      { en: "Clinic", ar: "عيادة" },
      { en: "Townhouse", ar: "تاون هاوس" },
      { en: "Chalet", ar: "شاليه" },
      { en: "One storey Villa", ar: "فيلا دور واحد" },
      { en: "Twin house", ar: "توين هاوس" },
      { en: "Standalone", ar: "مستقل" },
      { en: "Family house", ar: "بيت عائلي" },
      { en: "Penthouse", ar: "بنتهاوس" },
      { en: "Studio", ar: "استوديو" },
      { en: "Duplex", ar: "دوبلكس" },
      { en: "Apartment", ar: "شقة" },
    ],
    []
  );
  // const onsubmit = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     // ✅ لو مفيش اي تغيير في الداتا مش نعمل حاجة
  //     if (isEqual(newData, oldData)) {
  //       toast.info("No changes detected", { autoClose: 2000 });
  //       return;
  //     }

  //     try {
  //       setBtn(true);
  //       const projectObject = {
  //         ...newData,
  //         offers,
  //         id: newData.id,
  //       };

  //       // احنا محتاجين نجيب الـ developer document
  //       const docRef = doc(db, "compound", newData.developer.id);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         const compounds = data.compounds || [];
  //         // نعمل map ونستبدل الكمباوند بالـ id ده بالـ data الجديدة
  //         const updatedCompounds = compounds.map((comp) =>
  //           comp.id === newData.id ? projectObject : comp
  //         );
  //         await updateDoc(docRef, {
  //           compounds: updatedCompounds,
  //         });
  //         toast.success("Data updated successfully!", { autoClose: 2000 });
  //         nav(`/dashboard/editcompound/${editcompoundId}`);
  //       } else {
  //         console.error("⚠️ هذا المطور غير موجود");
  //       }
  //       setBtn(false);
  //     } catch (err) {
  //       console.error("❌ خطأ:", err);
  //       setBtn(false);
  //     }
  //   },
  //   [newData, oldData, offers, nav]
  // );
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
      const docRef = doc(db, "compound", editcompoundprojId);
      await updateDoc(docRef, changedFields);
      // console.log(changedFields)
      setBtn(false);
      toast.success("The modification has been made.", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard/editcompound");
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
      <>
        <h2>loading</h2>
      </>
    );
  }
  return (
    <Box sx={{ minHeight: "calc(100vh - 100px)", padding: "70px 0" }}>
      <h2>{lang === "ar" ? "تعديل الكومباوند" : "Edit Compound page"}</h2>
      <Container>
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
              // disabled
              data={developers}
              value={newData.developer?.id || ""}
              fun={handleDevChange}
              lang={lang}
            />
            <Input
              onChange={onchange("compoundName", "en")}
              id="Compound Name en"
              label={
                lang === "ar" ? "اسم الكومباوند انجليزي" : "Compound Name en"
              }
              type="text"
              value={newData.compoundName.en}
            />
            <Input
              onChange={onchange("compoundName", "ar")}
              id="Compound Name ar"
              label={lang === "ar" ? "اسم الكومباوند عربي" : "Compound Name ar"}
              type="text"
              value={newData.compoundName.ar}
            />
            <CheckboxCom
              data={checkBoxOptions1}
              handleCheckboxChange={handleCheckboxChange}
              name={newData.aminatis}
              lang={lang}
            />

            <Divider />
            <FileUpload
              handleFileChange={handleFileChange}
              prog={prog}
              title={
                lang === "ar"
                  ? "ارفع صور المشروع"
                  : "Upload Your Project Images ..."
              }
            />
            <Input
              onChange={onchange("district", "en")}
              id="district"
              label={lang === "ar" ? " المنطقة انجليزي" : "District en"}
              type="text"
              value={newData.district.en}
            />
            <Input
              onChange={onchange("district", "ar")}
              id="district"
              label={lang === "ar" ? " المنطقة عربي" : "District ar"}
              type="text"
              value={newData.district.ar}
            />
            <Input
              onChange={handleChange}
              id="price"
              label={lang === "ar" ? "السعر" : "Price"}
              type="number"
              name="price"
              value={newData.price}
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
            <CheckboxCom
              data={checkBoxOptions2}
              handleCheckboxChange={handleCheckbox2Change}
              name={newData.type}
              lang={lang}
            />
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
              onChange={onchange("compoundDes", "en")}
              id="projectDes"
              label={
                lang === "ar"
                  ? "تفاصيل الكومباوند انجليزي"
                  : "Compound Description en"
              }
              type="text"
              value={newData.compoundDes.en}
              multiline
              rows={4}
            />
            <Input
              onChange={onchange("compoundDes", "ar")}
              id="projectDesar"
              label={
                lang === "ar"
                  ? "تفاصيل الكومباوند عربي"
                  : "Compound Description ar"
              }
              type="text"
              value={newData.compoundDes.ar}
              multiline
              rows={4}
            />
            <FileUpload
              handleFileChange={handleMasterplanImgChange}
              prog={prog3}
              title={
                lang === "ar" ? " صوره الماستر بلان" : "Master plan Images ..."
              }
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
      </Container>
    </Box>
  );
}

export default EditCompoundProject