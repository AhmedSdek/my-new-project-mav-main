import { Box, Card, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../../firebase/config';
import { Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import MavLoading from '../../../Loading/MavLoading';
import Swal from 'sweetalert2';

function EditDeveloper() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [devLoading, setDevLoading] = useState(true);
  const [deletLoading, setDeletLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  console.log(developers)

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
  const handleDelete = async (id) => {
    try {
      setDeletLoading(true)
      await deleteDoc(doc(db, "developer", id));
      setDevelopers(prev => prev.filter(dev => dev.id !== id));
      setDeletLoading(false)
      console.log("✅ تم الحذف بنجاح");
    } catch (error) {
      setDeletLoading(false)
      console.error("❌ خطأ أثناء الحذف:", error);
    }
  };
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
    );
  }
  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 100px)', padding: '70px 0' }}>
      <h2>
          {lang === "ar" ? "تعديل الدفيلوبر" : "Developer Edit page"}
      </h2>
      <Container>
          {developers.length > 0 ?
          <Stack style={{ gap: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: '30px 0' }}>
              {developers.map((product) => {
              // console.log(product.data())
              return (
                <Card key={product.id} className="col-xl-2 col-sm-3 col-6" style={{ backgroundColor: 'rgb(228 228 228)', justifyContent: 'center', alignItems: 'center' }}>
                  <CardMedia >
                    <img src={product.img} alt={product.devName[lang]}></img>
                  </CardMedia>
                  <Stack sx={{ p: '10px' }}>
                    <Typography>
                      {`${product.devName[lang]}`}
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
                            handleDelete(product.id);
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
    </>
  )
}


export default EditDeveloper