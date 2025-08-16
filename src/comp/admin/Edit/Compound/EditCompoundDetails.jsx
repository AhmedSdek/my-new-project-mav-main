import { Box, Card, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../../firebase/config';
import Swal from 'sweetalert2';
import { Delete, Edit } from '@mui/icons-material';

function EditCompoundDetails() {
  const { editcompoundId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [compounds, setCompounds] = useState([]);
  // console.log(compounds)
  const getCompoundsOfDeveloper = async (developerId) => {
    try {
      const docRef = doc(db, "compound", developerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const compounds = data.compounds || [];
        return compounds;
      } else {
        console.log("⚠️ هذا المطور غير موجود");
        return [];
      }
    } catch (err) {
      console.error("❌ خطأ أثناء جلب الكومباوندز:", err);
      return [];
    }
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await getCompoundsOfDeveloper(editcompoundId);
      setCompounds(data);
    };
    fetch();
  }, []);
  const deleteCompoundFromDeveloper = async (developerId, compoundIdToDelete) => {
    try {
      const docRef = doc(db, "compound", developerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const compounds = data.compounds || [];

        // احذف الكمباوند المطلوب
        const updatedCompounds = compounds.filter(compound => compound.id !== compoundIdToDelete);

        // حدث الدوكومنت بالـ array الجديدة في Firestore
        await updateDoc(docRef, {
          compounds: updatedCompounds
        });

        // 💥 وبعدها حدث الـ state عشان الـ UI يتحدث
        setCompounds(updatedCompounds);

        console.log("✅ تم حذف الكمباوند بنجاح");
      } else {
        console.log("⚠️ هذا المطور غير موجود");
      }
    } catch (err) {
      console.error("❌ خطأ أثناء حذف الكمباوند:", err);
    }
  };
  // if (devLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <MavLoading />
  //     </div>
  //   );
  // }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 100px)', padding: '70px 0' }}>
      <h2>
        {lang === "ar" ? "كل الكومباوندس" : "All Compounds page"}
      </h2>
      <Container>
        {compounds.length > 0 ?
          <Stack style={{ gap: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: '30px 0' }}>
            {compounds.map((product) => {
              console.log(product)
              return (
                <Card key={product.id} className="col-xl-4 col-sm-6 col-12" style={{ backgroundColor: 'rgb(228 228 228)', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                  <CardMedia >
                    <img src={product.compoundImgs[0]} alt={product.compoundName[lang]} />
                  </CardMedia>
                  <Stack sx={{ p: '10px' }}>
                    <Typography>
                      {`${product.compoundName[lang]}`}
                    </Typography>
                    <Typography variant='caption'>
                      {`${product.Location[lang]}`}
                    </Typography>
                    <Typography >
                      {`${Intl.NumberFormat("en-US").format(
                        product.price
                      )} ${product.monyType.en === "dollar"
                        ? "$"
                        : "EGP"
                        }`}
                    </Typography>
                  </Stack>
                  <Stack sx={{ flexDirection: 'row' }}>
                    <IconButton
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!"
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteCompoundFromDeveloper(editcompoundId, product.id);
                            Swal.fire({
                              title: "Deleted!",
                              text: "Your file has been deleted.",
                              icon: "success"
                            });
                          }
                        });
                      }}
                      sx={{ width: '50px', height: '50px' }}
                    >
                      <Delete color='error' />
                    </IconButton>
                    <Link to={`${product.id}`} >
                      <IconButton sx={{ width: '50px', height: '50px' }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </Stack>
                </Card>
              )
            })}
          </Stack>
          :
          <Typography>
            no Data !
          </Typography>
        }
      </Container>
    </Box>
  )
}

export default EditCompoundDetails