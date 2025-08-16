import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../../firebase/config';
import { Box, Card, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import MavLoading from '../../../Loading/MavLoading';
import Swal from 'sweetalert2';

function Editluanches() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [newlaunch, setNewlaunch] = useState([]);
  const [launchLoading, setLaunchLoading] = useState(true);
  useEffect(() => {
    const fetchNewlaunch = async () => {
      try {
        const snapshot = await getDocs(collection(db, "newlaunch"));
        const launch = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewlaunch(launch);
      } catch (err) {
        console.error("خطأ أثناء جلب الديل:", err);
      } finally {
        setLaunchLoading(false);
      }
    };

    fetchNewlaunch();
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "newlaunch", id));
      setNewlaunch(prev => prev.filter(deal => deal.id !== id));
      console.log("✅ تم الحذف بنجاح");
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
    }
  };
  if (launchLoading) {
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
          {lang === "ar" ? "تعديل المشاريع الجديده" : "New luanches Edit page"}
        </h2>
        <Container>
          {newlaunch.length > 0 ?
            <Stack style={{ gap: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: '30px 0' }}>
              {newlaunch.map((product) => {
                console.log(product)
                return (
                  <Card key={product.id} className="col-xl-4 col-sm-6 col-12" style={{ backgroundColor: 'rgb(228 228 228)', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                    <CardMedia >
                      <img src={product.img[0]} alt={product.launchName[lang]} />
                    </CardMedia>
                    <Stack sx={{ p: '10px' }}>
                      <Typography>
                        {`${product.launchName[lang]}`}
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

export default Editluanches