import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { db, storage } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
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
import ReactLoading from "react-loading";
import "react-phone-input-2/lib/style.css";
import { HelpOutline } from "@mui/icons-material";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Input from "../Input";
import FormGro from "../FormGro";
import FileUpload from "../FileUpload";
import RadioCom from "../RadioCom";
import CheckboxCom from "../CheckboxCom";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
function Inventory() {
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const [prog3, setProg3] = useState(0);
  const [prog2, setProg2] = useState(0);
  const [btn, setBtn] = useState(false);
  // const [messege, setMessege] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [devLoading, setDevLoading] = useState(true);
  const [compoundNames, setCompoundNames] = useState([]);
  console.log(compoundNames);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCompounds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "compound"));
        const allCompounds = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data?.compoundName?.en || data?.compoundName?.ar) {
            allCompounds.push({
              id: doc.id,
              en: data.compoundName.en,
              ar: data.compoundName.ar,
            });
          }
        });

        setCompoundNames(allCompounds);
      } catch (error) {
        console.error("Error fetching compounds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompounds();
  }, []);

  const [newData, setNewData] = useState({
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    Dis: { ar: "", en: "" },
    compoundName: { ar: "", en: "" },
    compoundId: "",
    img: [],
    Masterimg: [],
    Layoutimg: [],
    monyType: { ar: "", en: "" },
    Area: 0,
    imgtext: { ar: "", en: "" },
    Bed: "",
    Bath: "",
    Location: { ar: "", en: "" },
    Sale: { ar: "", en: "" },
    Finsh: { ar: "", en: "" },
    aminatis: [],
    price: 0,
    downPayment: 0,
    remaining: 0,
    month: 0,
    roofArea: 0,
    landArea: 0,
    rental: 0,
    refNum: 0,
    gardenArea: 0,
    about: { ar: "", en: "" },
    sold: { ar: "", en: "" },
    delivery: { ar: "", en: "" },
    floor: { ar: "", en: "" },
    Type: { ar: "", en: "" },
  });
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
  const handleFileChange = useCallback(async (event) => {
    if (event.target.files.length > 0) {
      // افرغ الصور القديمة
      setNewData((prev) => ({
        ...prev,
        img: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "inventory/" + event.target.files[i].name
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
              img: [...prev.img, downloadURL], // ضيف الصور وحدة وحدة
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
        Masterimg: [],
      }));
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "inventory/" + event.target.files[i].name
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
          setProg3(progress);
          setBtn(true);
        },
        (error) => console.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewData((prev) => ({
              ...prev,
              Masterimg: [...prev.Masterimg, downloadURL], // ضيف الصور وحدة وحدة
            }));
            setBtn(false);
          });
        }
      );
    }
  }, []);
  const handleFiletowChange = useCallback(
    async (event) => {
      if (event.target.files.length > 0) {
        // افرغ الصور القديمة
        setNewData((prev) => ({
          ...prev,
          Layoutimg: [],
        }));
      }

      for (let i = 0; i < event.target.files.length; i++) {
        const storageRef = ref(
          storage,
          "inventory/" + event.target.files[i].name
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
            setBtn(true);
          },
          (error) => console.error(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setNewData((prev) => ({
                ...prev,
                Layoutimg: [...prev.Layoutimg, downloadURL], // ضيف الصور وحدة وحدة
              }));
              setBtn(false);
            });
          }
        );
      }
    },
    [storage]
  );
  const sendData = async (dataToSend) => {
    setBtn(true);
    try {
      const id = new Date().getTime();
      await setDoc(doc(db, "inventory", `${id}`), {
        id: `${id}`,
        ...dataToSend,
      });
      toast.success("The data has been sent..", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard");
      setBtn(false);
    } catch (er) {
      console.error("Send error:", er);
      setBtn(false);
    }
  };

  const onchangesimple = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  const onsubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // console.log(newData);
      await sendData(newData);
    },
    [newData] // لازم تضيف newData هنا عشان يشوف النسخة المحدثة
  );

  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
    []
  );
  const soldOutOptions = useMemo(
    () => [
      { en: "SOLD OUT", ar: "تم البيع" },
      { en: "Not", ar: "متاح" },
    ],
    []
  );
  const deliveryOptions = useMemo(
    () => [
      { en: "Delivered", ar: "تم التسليم" },
      { en: "Rtm", ar: "تحت الإنشاء" },
      { en: "2024", ar: "٢٠٢٤" },
      { en: "2025", ar: "٢٠٢٥" },
      { en: "2026", ar: "٢٠٢٦" },
      { en: "2027", ar: "٢٠٢٧" },
      { en: "2028", ar: "٢٠٢٨" },
      { en: "2029", ar: "٢٠٢٩" },
      { en: "2030", ar: "٢٠٣٠" },
      { en: "2031", ar: "٢٠٣١" },
      { en: "2032", ar: "٢٠٣٢" },
    ],
    []
  );
  const floorOptions = useMemo(
    () => [
      { en: "Typical", ar: "متكرر " },
      { en: "Ground", ar: "أرضي" },
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
  const finshOptions = useMemo(
    () => [
      { en: "Finished", ar: "تشطيب كامل" },
      { en: "Semi Finished", ar: "نصف تشطيب" },
      { en: "Core & Shell", ar: "عظم (أساس فقط)" },
      { en: "Furnished", ar: "مفروش" },
    ],
    []
  );
  const statusOptions = useMemo(
    () => [
      { en: "Resale", ar: "إعادة بيع" },
      { en: "Rent", ar: "إيجار" },
      { en: "Primary", ar: "بيع أولي" },
    ],
    []
  );
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
  const handleDynamicSelectcompond = useCallback(
    (dataArray, fieldName) => (e) => {
      const selectedLabel = e.target.value;
      const selectedObject = dataArray.find(
        (item) => item[lang] === selectedLabel
      );

      if (selectedObject) {
        setNewData((prev) => ({
          ...prev,
          compoundId: selectedObject.id,
          [fieldName]: {
            en: selectedObject.en,
            ar: selectedObject.ar,
          },
        }));
      }
    },
    [lang]
  );

  // console.log(developers)
  return (
    <Box className="w-full flex flex-col justify-center align-items-center pt-16">
      <Stack className="align-items-center mb-2.5">
        <Typography variant="h5">
          {lang === "ar" ? "الوحدات المتاحة" : "inventory"}
        </Typography>
      </Stack>
      <Card
        onSubmit={onsubmit}
        component="form"
        sx={{ gap: "10px" }}
        className="sm:w-11/12 md:w-4/5 flex align-items-center flex-col p-5 mt-2.5 mb-2.5"
      >
        <FormGro
          inputLabel={lang === "ar" ? "اختر المطور" : "Select Developer"}
          name="dev"
          data={developers}
          value={newData.developer?.id || ""}
          fun={handleDevChange}
          lang={lang}
        />
        <IconButton onClick={() => setOpen(true)}>
          <HelpOutline />
        </IconButton>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent>
            <Typography style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
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
        <CheckboxCom
          data={checkBoxOptions1}
          handleCheckboxChange={handleCheckboxChange}
          name={newData.aminatis}
          lang={lang}
        />
        <FormGro
          inputLabel={lang === "ar" ? "اختر الكمبوند" : "Select compound"}
          name="compoundName"
          data={compoundNames}
          value={newData.compoundName[lang] || ""}
          fun={handleDynamicSelectcompond(compoundNames, "compoundName")}
          lang={lang}
        />
        <FileUpload
          multiple
          handleFileChange={handleFileChange}
          prog={prog}
          title="imges"
        />
        <Input
          onChange={onchange("imgtext", "en")}
          type="text"
          id="imgtext"
          label={lang === "ar" ? "تفاصيل الصوره انجليزي" : "img text en"}
          value={newData.imgtext.en}
        />
        <Input
          onChange={onchange("imgtext", "ar")}
          type="text"
          id="imgtextar"
          label={lang === "ar" ? "تفاصيل الصوره عربي" : "img text ar"}
          value={newData.imgtext.ar}
        />
        <FileUpload
          handleFileChange={handleMasterplanImgChange}
          prog={prog3}
          title="Master img"
        />
        <FormGro
          inputLabel={lang === "ar" ? "نوع العمله" : "Money Type"}
          name="monyType"
          data={monyType}
          value={newData.monyType[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(monyType, "monyType")}
          lang={lang}
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
        <Input
          onChange={onchangesimple}
          label={lang === "ar" ? "السعر" : "down Payment"}
          type="number"
          id="downPayment"
          name="downPayment"
          value={newData.downPayment} // نخزن ونعرض الـ id
        />
        <Input
          onChange={onchangesimple}
          id="remaining"
          label={lang === "ar" ? "المتبقي" : "remaining"}
          name="remaining"
          value={newData.remaining}
          type="text"
        />

        <Input
          onChange={onchangesimple}
          id="month"
          label={lang === "ar" ? "الشهور" : "Month"}
          variant="outlined"
          type="number"
          name="month"
          value={newData.month} // نخزن ونعرض الـ id
        />
        <Input
          onChange={onchangesimple}
          variant="outlined"
          id="RoofArea"
          label={lang === "ar" ? "مساحة السطح" : "Roof Area"}
          type="number"
          name="roofArea"
          value={newData.roofArea} // نخزن ونعرض الـ id
        />
        <Input
          onChange={onchangesimple} // نخزن ونعرض الـ id
          id="Land-area"
          label={lang === "ar" ? "مساحة الأرض" : "Land Area"}
          variant="outlined"
          type="number"
          name="landArea"
          value={newData.landArea} // نخزن ونعرض الـ id
        />
        <Input
          onChange={onchangesimple}
          id="rental"
          label={lang === "ar" ? "أقل فترة إيجار" : "Minimum rental period"}
          variant="outlined"
          type="number"
          name="rental"
          value={newData.rental} // نخزن ونعرض الـ id
        />
        <Input
          onChange={onchangesimple}
          id="RefNum"
          label={lang === "ar" ? "رقم المرجع" : "RefNum"}
          variant="outlined"
          type="number"
          name="refNum"
          value={newData.refNum} // نخزن ونعرض الـ id
        />

        <Input
          onChange={onchangesimple}
          id="Garden-area"
          label={lang === "ar" ? "الحديقة" : "Garden area"}
          variant="outlined"
          type="number"
          name="gardenArea"
          value={newData.gardenArea} // نخزن ونعرض الـ id
        />

        <FormGro
          name="sold"
          data={soldOutOptions}
          inputLabel={lang === "ar" ? "التوافر" : "availability"}
          value={newData.sold[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(soldOutOptions, "sold")}
          lang={lang}
        />

        <FormGro
          name="delivery"
          inputLabel={lang === "ar" ? "تسليم" : "Delivery"}
          lang={lang}
          data={deliveryOptions}
          value={newData.delivery[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(deliveryOptions, "delivery")}
        />
        <FormGro
          name="floor"
          lang={lang}
          data={floorOptions}
          value={newData.floor[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(floorOptions, "floor")}
          inputLabel={lang === "ar" ? "دور " : "Floor"}
        />
        <FormGro
          name="Type"
          lang={lang}
          data={typeOptions}
          value={newData.Type[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(typeOptions, "Type")}
          inputLabel={lang === "ar" ? "النوع " : "Type"}
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
        <FormGro
          name="Finsh"
          lang={lang}
          data={finshOptions}
          value={newData.Finsh[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(finshOptions, "Finsh")}
          inputLabel={lang === "ar" ? "الحاله" : "status"}
        />
        <FileUpload
          handleFileChange={handleFiletowChange}
          prog={prog2}
          title="Layout img"
        />
        <FormGro
          name="Sale"
          lang={lang}
          data={statusOptions}
          value={newData.Sale[lang] || ""} // نخزن ونعرض الـ id
          fun={handleDynamicSelectChange(statusOptions, "Sale")}
          inputLabel={lang === "ar" ? "حاله البيع" : "Sale status"}
        />
        {/* <RadioCom
          name="Sale"
          lang={lang}
          label={lang === "ar" ? "حاله البيع" : "Sale status"}
          data={statusOptions}
          value={newData.Sale}
          onChange={onchangesimple}
        /> */}
        <Button
          disabled={btn}
          variant="contained"
          type="submit"
          className="btn w-1/2"
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
  );
}

export default memo(Inventory);
