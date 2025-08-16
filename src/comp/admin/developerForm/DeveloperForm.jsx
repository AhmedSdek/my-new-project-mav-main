import { useCallback, useMemo, useState } from "react";
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
import { HelpOutline, Info } from "@mui/icons-material";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import Input from "../Input";
import FileUpload from "../FileUpload";
import { useTranslation } from "react-i18next";
import FormGro from "../FormGro";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
function DeveloperForm() {
  const { i18n } = useTranslation();
  const lang = i18n.language; // هيطلع "ar" أو "en"
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const [btn, setBtn] = useState(false);
  // const [messege, setMessege] = useState(false);
  const [newData, setNewData] = useState({
    devDis: {
      ar: "",
      en: ""
    },
    img: [],
    devName: {
      ar: "",
      en: ""
    },
    country: {
      ar: "",
      en: ""
    }
  });
  const CountryOptions = useMemo(
    () => [
      { ar: "مصر", en: "egypt" },
      { ar: "الامارات", en: "uae" },
    ],
    []
  );
  const handleFileChange = useCallback(async (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "developer/" + event.target.files[i].name
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
  const sendData = async (dataToSend) => {
    setBtn(true);
    try {
      const id = new Date().getTime();
      await setDoc(doc(db, "developer", `${id}`), {
        id: `${id}`,
        ...dataToSend,
      });
      toast.success("The data has been sent..", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard");
      setBtn(false);
    } catch (er) {
      console.error("Send error:", er);
      setBtn(false);
      toast.error("Oops! Something went wrong.", { autoClose: 2000 });
    }
  };

  const onchange = useCallback((parentKey, lang) => (e) => {
    setNewData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [lang]: e.target.value
      }
    }));
  }, []);
  const onsubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // console.log(newData)
      await sendData(newData);
    },
    [newData] // لازم تضيف newData هنا عشان يشوف النسخة المحدثة
  );
  const handleSelectChange = useCallback(
    (e) => {
      const selectedLabel = e.target.value;
      console.log(selectedLabel)
      const selectedObject = CountryOptions.find(
        (item) =>
          (item[lang] || item.en) === selectedLabel
      );
      setNewData((prev) => ({
        ...prev,
        country: selectedObject || prev.country
      }));
    },
    [CountryOptions, lang]
  );

  return (
    <>
      <Box sx={{
        minHeight: 'calc(100vh - 100px)'
      }}
        className="w-full flex flex-col justify-center align-items-center pt-16" >
      <Stack className="align-items-center mb-2.5">
          <Typography variant="h5">{lang === "ar" ? "اضف المطور" : "Add developers"}</Typography>
      </Stack>
      <Card
        onSubmit={onsubmit}
        component="form"
          sx={{ gap: '10px', width: '100%' }}
        className="sm:w-11/12 md:w-4/5 flex align-items-center flex-col p-5 mt-2.5 mb-2.5"
      >
        <Input
            onChange={onchange("devName", "en")}
            type="text"
            id="DevNameEn"
            label={lang === "ar" ? "اسم المطور انجليزي" : "Developer Name en"}
            value={newData.devName.en}
          />
          <Input
            onChange={onchange("devName", "ar")}
            type="text"
            id="DevNameAr"
            label={lang === "ar" ? "اسم المطور عربي" : "Developer Name ar"}
            value={newData.devName.ar}
          />
          <FormGro
            inputLabel={lang === "ar" ? "اختر البلد" : "Select Country"}
            name="country"
            data={CountryOptions}
            value={newData.country[lang] || ""}
            fun={handleSelectChange}
            lang={lang}
          /> 
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
            onChange={onchange("devDis", "en")}
            type="text"
            id="DevDisEn"
            label={lang === "ar" ? "التفاصيل انجليزي" : "Description (English)"}
            value={newData.devDis.en}
            multiline
            rows={4}
          />
          <Input
            onChange={onchange("devDis", "ar")}
            type="text"
            id="DevDisAr"
            label={lang === "ar" ? "التفاصيل عربي" : "Description (Arabic)"}
            value={newData.devDis.ar}
            multiline
            rows={4}
          />
          <FileUpload handleFileChange={handleFileChange} prog={prog} title={lang === "ar" ? "ايقونه المطور" : "Develper Icon"}
          />
        <Button
          disabled={btn}
          variant="contained"
          type="submit"
          className="btn w-1/2"
        >
          {btn ? (
            <ReactLoading type={"spin"} height={"20px"} width={"20px"} />
          ) : (
                lang === "ar" ? "ارسال" : "Send"
          )}
        </Button>
      </Card>
    </Box>
      {/* <p
        style={{
          zIndex: "10",
          backgroundColor: "whitesmoke",
          display: "flex",
          alignItems: "center",
          color: "black",
          padding: "10px",
          borderRadius: "6px",
          boxShadow: "rgb(255 255 255 / 25%) 0px 5px 30px 0px",
          position: "fixed",
          top: "100px",
          right: messege ? "20px" : "-230px",
          transition: "0.8s",
          scale: messege ? "1" : "0",
        }}
      >
        Data has been sent successfully
        <Info
          style={{ margin: "3px 0 0 10px", fontSize: "20px", color: "teal" }}
        />
      </p> */}
    </>
  );
}

export default DeveloperForm