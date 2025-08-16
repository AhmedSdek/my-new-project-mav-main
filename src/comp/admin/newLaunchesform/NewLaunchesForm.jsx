import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { db, storage } from '../../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Dialog, DialogContent, IconButton, LinearProgress, Stack, Typography, styled } from '@mui/material';
import ReactLoading from 'react-loading';
import 'react-phone-input-2/lib/style.css'
import { AddPhotoAlternate, HelpOutline, Info } from '@mui/icons-material';
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Input from '../Input';
import FormGro from '../FormGro';
import FileUpload from '../FileUpload';
import MavLoading from '../../Loading/MavLoading';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
function NewLaunchesForm() {
  const { i18n } = useTranslation();
  const lang = i18n.language; // هيطلع "ar" أو "en"
  const nav = useNavigate()
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const [open, setOpen] = useState(false);
  const [btn, setBtn] = useState(false);
  const [prog, setProg] = useState(0)
  const [prog3, setProg3] = useState(0)
  const [prog4, setProg4] = useState(0)
  const [newData, setNewData] = useState({
    Dis: {
      ar: "",
      en: "",
    },
    launchName: {
      ar: "",
      en: "",
    },
    video: "",
    img: [],
    masterplan: "",
    Location: {
      ar: "",
      en: "",
    },
    developer: {},
    countryKey: "",
    devId: "",
    devIcon: "",
    price: 0,
    monyType: { ar: "", en: "" },
  });
  const [developers, setDevelopers] = useState([]);
  const [devLoading, setDevLoading] = useState(true);
  const [devError, setDevError] = useState("");
  const monyType = useMemo(
    () => [
      { en: "dollar", ar: "دولار" },
      { en: "pound", ar: "جنيه مصري" },
      { en: "AED", ar: "الدرهم الإماراتي" },
    ],
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
        setDevError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setDevLoading(false);
      }
    };
    fetchDevelopers();
  }, []);
  const handleDevChange = useCallback(
    (e) => {
      const selectedDev = developers.find((dev) => dev.id === e.target.value);
      console.log(selectedDev);
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
    for (let i = 0; i < event.target.files.length; i++) {
      const storageRef = ref(
        storage,
        "newLaunches/" + event.target.files[i].name
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
  const handleVideoChange = async (event) => {
    // console.log(i)
    const storageRef = ref(storage, event.target.files[0].name);
    const uploadTask = uploadBytesResumable(
      storageRef,
      event.target.files[0]
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setProg4(progress);
        // if (i < event.target.files.length) {
        //     setBtn(true)
        // }
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
            video: [...prev.video, downloadURL],
          }));
          // setVideo(downloadURL);
          setBtn(false);
          // Add a new document in collection "cities"
        });
      }
    );

    // console.log(event.target.files[0].name)

    //     const storageRef = ref(storage, event.target.files[0].name);

    //     const uploadTask = uploadBytesResumable(storageRef, `video/${video}`);
    //     uploadTask.on('state_changed',
    //         (snapshot) => {
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload is ' + progress + '% done');
    //         switch (snapshot.state) {
    //             case 'paused':
    //                 console.log('Upload is paused');
    //                 break;
    //             case 'running':
    //                 console.log('Upload is running');
    //                 break;
    //         }
    //     },
    //     (error) => {
    //         // Handle unsuccessful uploads
    //     },
    //     () => {
    //             // Handle successful uploads on complete
    //             // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 setVideo(downloadURL)
    //                 console.log('File available at', downloadURL);
    //             });
    //     }
    // );
  };
  const handleMasterplanImgChange = useCallback(async (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
  // console.log(i)
      const storageRef = ref(storage, event.target.files[i].name);
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
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              console.log("File available at", downloadURL);
              setNewData((prev) => ({
                ...prev,
                masterplan: [...prev.masterplan, downloadURL],
              }));
              setBtn(false);
          // Add a new document in collection "cities"
            }
          );
        }
      );
    }
  }, []);
  const onchange = useCallback((parentKey, lang) => (e) => {
    setNewData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [lang]: e.target.value
      }
    }));
  }, []);
  const onSimpelchange = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);
  const sendData = async (dataToSend) => {
    // console.log(dataToSend)
    setBtn(true);
    const id = new Date().getTime();
    try {
      await setDoc(doc(db, "newlaunch", `${id}`), {
        id: `${id}`,
        ...dataToSend,
      });
      toast.success("The data has been sent..", { autoClose: 2000 }); // عرض إشعار أنيق
      nav("/dashboard/editluanches");
      setBtn(false);
    } catch (er) { 
      console.log(er)
    }
  };
  const onsubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // setMessege(true);
      // console.log(newData)
      await sendData(newData);
    },
    [newData]
  );
  if (devLoading) {
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
    )
  }
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
            {lang === "ar" ? "وحدات جديده" : "New Launch"}
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
            onSubmit={onsubmit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              margin: "15px 0 0",
              gap: '10px'
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
              value={newData.launchName.en}
              onChange={onchange("launchName", "en")}
              label={lang === "ar" ? "اسم الوحده بالانجليزي" : "Launch Name en"}
              id="outlined-multiline-static"
            />
            <Input
              value={newData.launchName.ar}
              onChange={onchange("launchName", "ar")}
              label={lang === "ar" ? "اسم الوحده بالعربي" : "Launch Name ar"}
              id="outlined-multiline-staticar"
            />
            <Input
              name="price"
              value={newData.price}
              type="number"
              onChange={onSimpelchange}
              label={lang === "ar" ? "السعر" : "Price"}
              id="outlined-multiline-static"
            />
            <FormGro
              inputLabel={lang === "ar" ? "نوع العمله" : "Money Type"}
              name="monyType"
              data={monyType}
              value={newData.monyType[lang] || ""} // نخزن ونعرض الـ id
              fun={handleDynamicSelectChange(monyType, "monyType")}
              lang={lang}
            />
            <FileUpload handleFileChange={handleFileChange} multiple={true} prog={prog}
              title={lang === "ar" ? "رفع الصور" : "Upload Your Images ..."}
            />
            <Input
              value={newData.Location.en}
              onChange={onchange("Location", "en")}
              label={lang === "ar" ? "الموقع انجليزي" : "Location en"}
              id="outlined-Location-static"
            />
            <Input
              value={newData.Location.ar}
              onChange={onchange("Location", "ar")}
              label={lang === "ar" ? "الموقع عربي" : "Location ar"}
              id="outlined-Location-staticar"
            />
            <FileUpload handleFileChange={handleMasterplanImgChange} multiple={false} prog={prog3}
              title={lang === "ar" ? "رفع صوره ماستربلان" : "Master plan Image ..."} />
            <Box sx={{ width: '100%', padding: "5px" }}>
              <Typography variant="body2">{lang === "ar" ? "فيديو" : "Video"}
              </Typography>
              <Button
                component="label"
                variant="outlined"
                sx={{ padding: "10px", margin: "15px" }}
                startIcon={<AddPhotoAlternate />}
                onChange={(e) => {
                  handleVideoChange(e);
                }}
              >
                <VisuallyHiddenInput type="file" />
              </Button>
              <LinearProgress variant="determinate" value={prog4} />
            </Box>
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
              name="Dis"
              value={newData.Dis.en}
              onChange={onchange("Dis", "en")}
              label={lang === "ar" ? "التفاصيل انجليزي" : "Details en"}
              id="outlined-Detailsen"
              multiline
              rows={4}
            />
            <Input
              name="Dis"
              value={newData.Dis.ar}
              onChange={onchange("Dis", "ar")}
              label={lang === "ar" ? "التفاصيل عربي" : "Details ar"}
              id="outlined-Details"
              multiline
              rows={4}
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
          </Box>
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

export default NewLaunchesForm