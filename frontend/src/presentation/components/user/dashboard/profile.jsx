import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Unstable_Grid2 as Grid,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useUpdateProfileMutation } from "../../../../application/slice/user/userApiSlice";
import TextfieldWrapper from "../form/Textfield";
import ButtonWrapper from "../form/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setCredentials } from "../../../../application/slice/user/authSlice";
// Initial form state for formik
const INITIAL_FORM_STATE = {
  name: "",

  password: "",
};
// Form validation schema using Yup
const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string().min(5, "Name must be at least 5 characters"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "Password must contain at leastone  one special character"
    ),
  // profilePhoto: Yup.mixed().required("File is required"),
});
const AccountProfileDetails = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const dispatch = useDispatch();
  const [updatProfile] = useUpdateProfileMutation();
  let [imageFile, setImageFile] = useState(null);

  const submitHandler = async (value) => {
    try {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("password", value.password);
      formData.append("profilePhoto", imageFile);
      formData.append("email", user.email);
      const responce = await updatProfile(formData);
      console.log(responce);
      dispatch(setCredentials({ ...responce.data.data }));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={submitHandler}
      >
        <Form encType="multipart/form-data">
          <Card>
            <CardHeader subheader="The information can be edited" />

            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <TextfieldWrapper name="name" label="Username" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextfieldWrapper name="password" label="Password" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <input
                      hidden
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      onChange={(event) => {
                        setImageFile(event.currentTarget.files[0]);
                      }}
                    />
                    <Button variant="outlined">
                      <label htmlFor="profilePhoto">
                        Upload new ProfileImage{<CloudUploadIcon />}
                      </label>
                    </Button>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        sx={{ height: 140 }}
                        src={imageFile ? imageFile : user.profilePhoto}
                        title="Profile photo"
                      />
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <ButtonWrapper>Save details</ButtonWrapper>
            </CardActions>
          </Card>
        </Form>
      </Formik>
    </>
  );
};

export default AccountProfileDetails;
