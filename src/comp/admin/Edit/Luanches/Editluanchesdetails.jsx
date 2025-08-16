import { Button, Card, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../../../../firebase/config';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import Input from '../../Input';
import FormGro from '../../FormGro';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import FileUpload from '../../FileUpload';
import { HelpOutline } from '@mui/icons-material';
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function Editluanchesdetails() {
  const { editluanchesdetailsId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [btn, setBtn] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const nav = useNavigate();
  const [value, loading] = useDocument(doc(db, "newlaunch", editluanchesdetailsId));
  const [oldData, setOldData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    Dis: { ar: "", en: "" },
    Location: { ar: "", en: "" },
    img: [],
    masterplan: [],
    launchName: { ar: "", en: "" },
    monyType: { ar: "", en: "" },
    video: [],
    price: 0,
  });
  const [prog, setProg] = useState(0);
  const [prog3, setProg3] = useState(0);
  const [prog4, setProg4] = useState(0);
  const [newData, setNewData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    Dis: { ar: "", en: "" },
    Location: { ar: "", en: "" },
    img: [],
    masterplan: [],
    launchName: { ar: "", en: "" },
    monyType: { ar: "", en: "" },
    video: [],
    price: 0,
  });
  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
    []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const data = value.data();
      const fullData = {
        developer: {},
        countryKey: "",
        devId: "",
        devIcon: "",
        Dis: { ar: "", en: "" },
        Location: { ar: "", en: "" },
        img: [],
        masterplan: [],
        launchName: { ar: "", en: "" },
        monyType: { ar: "", en: "" },
        video: [],
        price: 0,
        ...data,
      };
      setNewData(fullData);
      setOldData(fullData); // 💪
    }
  }, [value]);
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
  const onchangesimple = useCallback((e) => {
    setNewData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
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
      const docRef = doc(db, "newlaunch", editluanchesdetailsId);
      await updateDoc(docRef, changedFields);
      // console.log(changedFields)
      setBtn(false);
      toast.success("The modification has been made.", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard/editluanches");
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
  const handleFileChange = useCallback(async (event) => {
    if (event.target.files.length > 0) {
      // افرغ الصور القديمة
      setNewData((prev) => ({
        ...prev,
        img: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(storage, "newLaunches/" + event.target.files[i].name);
      const uploadTask = uploadBytesResumable(storageRef, event.target.files[i]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProg(progress);
          setBtn(true);
        },
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewData((prev) => ({
              ...prev,
              img: [...prev.img, downloadURL], // ضيف الصور وحدة وحدة
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);
  const handleVideoChange = async (event) => {
    if (event.target.files.length > 0) {
      // امسح الفيديو القديم
      setNewData((prev) => ({
        ...prev,
        video: [],
      }));
    }

    const storageRef = ref(storage, event.target.files[0].name);
    const uploadTask = uploadBytesResumable(
      storageRef,
      event.target.files[0]
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProg4(progress);
        setBtn(true);
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // حط الفيديو الجديد مكان القديم
          setNewData((prev) => ({
            ...prev,
            video: [downloadURL],
          }));
          setBtn(false);
        });
      }
    );
  };
  const handleMasterplanImgChange = useCallback(async (event) => {
    if (event.target.files.length > 0) {
      // امسح الصور القديمة
      setNewData((prev) => ({
        ...prev,
        masterplan: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(storage, event.target.files[i].name);
      const uploadTask = uploadBytesResumable(storageRef, event.target.files[i]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProg3(progress);
          setBtn(true);
        },
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // خليه يحط الصورة الجديدة مكان القديم (واحدة بس)
            setNewData((prev) => ({
              ...prev,
              masterplan: [downloadURL],
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);

  const getChangedFields = (newObj, oldObj) => {
    let changedFields = {};
    for (let key in newObj) {
      if (typeof newObj[key] === "object" && newObj[key] !== null && !Array.isArray(newObj[key])) {
        if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj?.[key])) {
          // في حالة object (زي dealName) ارسل كامل الـ object
          changedFields[key] = newObj[key];
        }
      } else if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj?.[key])) {
        changedFields[key] = newObj[key];
      }
    }
    return changedFields;
  };
    return (
      <Stack sx={{
        minHeight: "calc(100vh - 100px)", padding: "70px 0 0",
        width: "100%",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Stack sx={{ alignItems: "center", marginBottom: "10px" }}>
          <Typography variant="h5">{lang === "ar" ? "تعديل لونش" : "ُEdit Luanch"}</Typography>
        </Stack>
        <Card
          onSubmit={handleUpdate}
          component="form"
          sx={{ gap: '10px' }}
          className="sm:w-11/12 md:w-4/5 flex align-items-center flex-col p-5 mt-2.5 mb-2.5"
        >
          <Input
            onChange={onchange("launchName", "en")}
            label={lang === "ar" ? "اسم اللونش انجليزي" : "launchName en"}
            value={newData.launchName.en}
            id="outlined-title-static"
          />
          <Input
            onChange={onchange("launchName", "ar")}
            label={lang === "ar" ? "اسم اللونش عربي" : "launchName ar"}
            value={newData.launchName.ar}
            id="outlined-title-static-ar"
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
            inputLabel={lang === "ar" ? "اختر المطور" : "Select Developer"}
            name="dev"
            data={developers}
            value={newData.developer?.id || ""}
            fun={handleDevChange}
            lang={lang}
          />
          <FormGro
            inputLabel={lang === "ar" ? "نوع العمله" : "Money Type"}
            name="monyType"
            data={monyType}
            value={newData.monyType[lang] || ""} // نخزن ونعرض الـ id
            fun={handleDynamicSelectChange(monyType, "monyType")}
            lang={lang}
          />
          <FileUpload multiple={true} handleFileChange={handleFileChange} prog={prog} title='Upload Your Images ...' />
          <Input
            onChange={onchangesimple}
            id="Price"
            name='price'
            label={lang === "ar" ? "السعر" : "Price"}
            type="number"
            value={newData.price} // نخزن ونعرض الـ id
          />
          <FileUpload handleFileChange={handleVideoChange} prog={prog4} title="video" />
          <FileUpload handleFileChange={handleMasterplanImgChange} prog={prog3} title='Master img' />

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
          <Button
            disabled={btn}
            variant="contained"
            type="submit"
            style={{ width: "50%" }}
            className="btn"
          >
            {btn ? (
              <ReactLoading type={"spin"} height={"20px"} width={"20px"} />
            ) : (
              lang === "ar" ? "ارسال" : "Send"
            )}
          </Button>
        </Card>
      </Stack>
    )
}

export default Editluanchesdetails