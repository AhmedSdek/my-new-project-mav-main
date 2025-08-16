import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import FormGro from "../../FormGro";
import Input from "../../Input";
import FileUpload from "../../FileUpload";
import { HelpOutline } from "@mui/icons-material";
import BasicDateRangeCalendar from "../../sahelForm/BasicDateRangeCalendar";
import ReactLoading from "react-loading";
import { ref } from "firebase/storage";
import { db, storage } from "../../../../firebase/config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function EditSahelDetails() {
  const { sahelid } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const nav = useNavigate();
  const [newData, setNewData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    compoundName: { ar: "", en: "" },
    img: [],
    Location: { ar: "", en: "" },
    Type: { ar: "", en: "" },
    Area: 0,
    peopleNumber: 0,
    Bed: "",
    Bath: "",
    price: 0,
    Layoutimg: [],
    Masterimg: [],
    Dis: { ar: "", en: "" },
    monyType: { ar: "", en: "" },
    googleMap: "",
    startDate: null,
    endDate: null,
    refNum: 0,
  });
  const [oldData, setOldData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    compoundName: { ar: "", en: "" },
    img: [],
    Location: { ar: "", en: "" },
    Type: { ar: "", en: "" },
    Area: 0,
    peopleNumber: 0,
    Bed: "",
    Bath: "",
    price: 0,
    Layoutimg: [],
    Masterimg: [],
    Dis: { ar: "", en: "" },
    monyType: { ar: "", en: "" },
    googleMap: "",
    startDate: null,
    endDate: null,
    refNum: 0,
  });
  const [developers, setDevelopers] = useState([]);
  const [compoundNames, setCompoundNames] = useState([]);
  const [devLoading, setDevLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [btn, setBtn] = useState(false);
  const [prog, setProg] = useState(0);
  const [prog2, setProg2] = useState(0);
  const [prog3, setProg3] = useState(0);
  const [value, dataloading] = useDocument(doc(db, "northcoast", sahelid));

  const handleFileChange = useCallback(async (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "northcoast/" + event.target.files[i].name
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        event.target.files[i]
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          setProg(progress);
          if (i < event.target.files.length) {
            setBtn(true);
          }
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            setNewData((prev) => ({
              ...prev,
              img: [...prev.img, downloadURL],
            }));
            setBtn(false);
            // Add a new document in collection "cities"
          });
        }
      );
    }
  }, []);
  const handleMasterplanImgChange = useCallback(async (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "northcoast/" + event.target.files[i].name
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        event.target.files[i]
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          setProg3(progress);
          if (i < event.target.files.length) {
            setBtn(true);
          }
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            setNewData((prev) => ({
              ...prev,
              Masterimg: downloadURL,
            }));
            setBtn(false);
            // Add a new document in collection "cities"
          });
        }
      );
    }
  }, []);
  const handleFiletowChange = useCallback(
    async (event) => {
      for (let i = 0; i < event.target.files.length; i++) {
        const storageRef = ref(
          storage,
          "northcoast/" + event.target.files[i].name
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
            setProg2(progress);
            if (i < event.target.files.length) {
              setBtn(true);
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
              case "storage/canceled":
              case "storage/unknown":
                break;
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setNewData((prev) => ({
                ...prev,
                Layoutimg: downloadURL,
              }));
              setBtn(false);
            });
          }
        );
      }
    },
    [storage]
  );
  useEffect(() => {
    if (value) {
      const data = value.data();
      const fullData = {
        developer: {},
        countryKey: "",
        devId: "",
        devIcon: "",
        compoundName: { ar: "", en: "" },
        img: [],
        Location: { ar: "", en: "" },
        Type: { ar: "", en: "" },
        Area: 0,
        peopleNumber: 0,
        Bed: "",
        Bath: "",
        price: 0,
        Layoutimg: [],
        Masterimg: [],
        Dis: { ar: "", en: "" },
        monyType: { ar: "", en: "" },
        googleMap: "",
        startDate: null,
        endDate: null,
        ...data,
      };
      setNewData(fullData);
      setOldData(fullData); // 💪
    }
  }, [value]);
  useEffect(() => {
    const fetchCompounds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "compound"));
        const allCompoundNames = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (Array.isArray(data.compounds)) {
            data.compounds.forEach((item) => {
              if (item.compoundName) {
                allCompoundNames.push(item.compoundName);
              }
            });
          }
        });
        setCompoundNames(allCompoundNames);
      } catch (error) {
        console.error("Error fetching compounds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompounds();
  }, []);

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
  const handleDateChange = useCallback((key, value) => {
    setNewData((prev) => ({
      ...prev,
      [key]: value ? value.toISOString() : null, // نحول التاريخ إلى نص علشان يتسجل في Firestore
    }));
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
  const onchangesimple = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);
  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
    []
  );
  const typeOptions = useMemo(
    () => [
      { en: "Apartment", ar: "شقة" },
      { en: "Duplex", ar: "دوبلكس" },
      { en: "Studio", ar: "استوديو" },
      { en: "Penthouse", ar: "بنتهاوس" },
      { en: "Family", ar: "منزل عائلي" },
      { en: "Standalone", ar: "فيلا مستقلة" },
      { en: "Twin house", ar: "توين هاوس" },
      { en: "Clinic", ar: "عيادة" },
      { en: "Office", ar: "مكتب" },
      { en: "Retail", ar: "محل تجاري" },
      { en: "Cabin", ar: "كوخ" },
      { en: "Townhouse", ar: "تاون هاوس" },
      { en: "Chalet", ar: "شاليه" },
      { en: "One storey Villa", ar: "فيلا دور واحد" },
    ],
    []
  );
  const bedroomOptions = useMemo(
    () => [
      { en: "1", ar: "١" },
      { en: "2", ar: "٢" },
      { en: "3", ar: "٣" },
      { en: "4", ar: "٤" },
      { en: "5", ar: "٥" },
      { en: "6", ar: "٦" },
      { en: "7", ar: "٧" },
      { en: "8", ar: "٨" },
      { en: "9", ar: "٩" },
      { en: "10", ar: "١٠" },
    ],
    []
  );
  const bathroomOptions = useMemo(
    () => [
      { en: "1", ar: "١" },
      { en: "2", ar: "٢" },
      { en: "3", ar: "٣" },
      { en: "4", ar: "٤" },
      { en: "5", ar: "٥" },
    ],
    []
  );
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
      const docRef = doc(db, "northcoast", sahelid);
      await updateDoc(docRef, changedFields);
      // console.log(changedFields)
      setBtn(false);
      toast.success("The modification has been made.", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard/editsahel");
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
          <Typography variant="h5">
            {lang === "ar" ? "تعديل مشروع" : "Edit Project"}
          </Typography>
        </Stack>
        <Card
          onSubmit={handleUpdate}
          component="form"
          sx={{ gap: "10px", width: "100%" }}
          className="flex align-items-center flex-col p-5 mt-2.5 mb-2.5"
        >
          <FormGro
            inputLabel={lang === "ar" ? "اختر المطور" : "Select Developer"}
            name="dev"
            data={developers}
            value={newData.developer?.id || ""}
            fun={handleDevChange}
            lang={lang}
          />
          <FormGro
            inputLabel={lang === "ar" ? "اختر الكمبوند" : "Select compound"}
            name="compoundName"
            data={compoundNames}
            value={newData.compoundName[lang] || ""}
            fun={handleDynamicSelectChange(compoundNames, "compoundName")}
            lang={lang}
          />

          <Input
            onChange={onchange("Location", "en")}
            type="text"
            label={lang === "ar" ? "الموقع" : "Location"}
            id="Location"
            value={newData.Location.en}
          />
          <Input
            onChange={onchange("Location", "ar")}
            type="text"
            label={lang === "ar" ? "الموقع عربي" : "Location ar"}
            id="Locationar"
            value={newData.Location.ar}
          />

          <FormGro
            inputLabel={lang === "ar" ? "نوع العمله" : "Money Type"}
            name="monyType"
            data={monyType}
            value={newData.monyType[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(monyType, "monyType")}
            lang={lang}
          />
          <FileUpload
            handleFileChange={handleFileChange}
            prog={prog}
            multiple
            title="Upload Your Images ..."
          />
          <Input
            onChange={onchangesimple}
            id="Price"
            name="price"
            label={lang === "ar" ? "السعر" : "Price"}
            type="number"
            value={newData.price} // نخزن ونعرض الـ id
          />
          <Input
            onChange={onchangesimple}
            id="RefNum"
            label={lang === "ar" ? "رقم المرجع" : "RefNum"}
            variant="outlined"
            type="number"
            name="refNum"
            value={newData.refNum}
          />
          <Input
            onChange={onchangesimple}
            id="peopleNumber"
            label={lang === "ar" ? "عدد الافراد" : "people Number"}
            variant="outlined"
            type="number"
            name="peopleNumber"
            value={newData.peopleNumber}
          />
          <FormGro
            name="Type"
            lang={lang}
            data={typeOptions}
            value={newData.Type[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(typeOptions, "Type")}
            inputLabel={lang === "ar" ? "النوع " : "Type"}
          />
          <FileUpload
            handleFileChange={handleFiletowChange}
            prog={prog2}
            title="Layout img"
          />

          <Input
            onChange={onchangesimple}
            id="area"
            label={lang === "ar" ? "المساحة (م)" : "Area(m)"}
            variant="outlined"
            type="number"
            name="Area"
            value={newData.Area} // نخزن ونعرض الـ id
          />
          <FileUpload
            handleFileChange={handleMasterplanImgChange}
            prog={prog3}
            title="Master img"
          />
          <FormGro
            name="Bed"
            data={bedroomOptions}
            lang={lang}
            value={newData.Bed[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(bedroomOptions, "Bed")}
            inputLabel={lang === "ar" ? "غرف نوم" : "Bedrooms"}
          />
          <FormGro
            name="Bath"
            lang={lang}
            data={bathroomOptions}
            value={newData.Bath[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(bathroomOptions, "Bath")}
            inputLabel={lang === "ar" ? "حمامات" : "Bathrooms"}
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
# عنوان رئيسي (H1)
## عنوان فرعي (H2)
### عنوان (H3)
#### عنوان (H4)
##### عنوان (H5)
###### عنوان (H6)
*نص مائل*           ← نص مائل
**نص عريض**         ← نص بولد
~~نص مشطوب~~        ← خط على النص
- عنصر              ← قائمة نقطية
1. عنصر مرقم        ← قائمة مرقمة
> اقتباس            ← اقتباس
`}{" "}
              </Typography>
            </DialogContent>
          </Dialog>
          <Input
            onChange={onchange("Dis", "en")}
            label={lang === "ar" ? "التفاصيل انجليزي" : "Description en"}
            value={newData.Dis.en}
            rows={4}
            multiline
            id="outlined-multiline-static"
          />
          <Input
            onChange={onchange("Dis", "ar")}
            label={lang === "ar" ? "التفاصيل عربي" : "Description ar"}
            value={newData.Dis.ar}
            rows={4}
            multiline
            id="outlined-multiline-staticar"
          />
          <Input
            onChange={onchangesimple}
            type="text"
            name="googleMap"
            label={lang === "ar" ? "الموقع" : "google Map"}
            id="googleMap"
            value={newData.googleMap}
          />
          <BasicDateRangeCalendar
            onDateChange={handleDateChange}
            startDate={newData.startDate ? dayjs(newData.startDate) : null}
            endDate={newData.endDate ? dayjs(newData.endDate) : null}
            lang={lang}
          />
          <Button
            disabled={btn}
            variant="contained"
            type="submit"
            style={{ width: "50%" }}
            className="btn"
          >
            {btn ? (
              <ReactLoading type={"spin"} height={"20px"} width={"20px"} />
            ) : lang === "ar" ? (
              "ارسال"
            ) : (
              "Send"
            )}
          </Button>
        </Card>
      </Box>
    </>
  );
}

export default EditSahelDetails;
