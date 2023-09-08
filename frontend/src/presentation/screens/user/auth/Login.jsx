// importing custom components
import AuthComponent from "../../../components/user/auth/Auth";
import TextFieldWrapper from "../../../components/user/form/Textfield";
import ButtonWrapper from "../../../components/user/form/Button";
// importing mui components
import { Box, Grid, Typography, Container, Avatar, Stack } from "@mui/material";
import VideogameAssetOutlinedIcon from "@mui/icons-material/VideogameAssetOutlined";
// importing from redux store
import { useLoginMutation } from "../../../../application/slice/user/authApiSlice";
import { setCredentials } from "../../../../application/slice/user/authSlice";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Initial form state for formik
const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

// Form validation schema using Yup
const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string()
  .email("Invalid email")
  .required("Required"),
  password: Yup.string()
  .required("Required")
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginApi, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Use Effect to check if the user is already logged in, if so, redirect to home page
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // Submit Handler for Login
  const submitHandler = async (values) => {
    try {
      const res = await loginApi({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <AuthComponent>
      <Container>
        <Box height={35} />
        <Box sx={{ position: "relative", top: "50%", left: "37%" }}>
          <Avatar
            sx={{
              ml: "35px",
              mb: "4px",
              bgcolor: "#ffffff",
            }}
          >
            <VideogameAssetOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign In
          </Typography>
        </Box>
        <Box height={35} />

        {/* Using formik  */}
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={submitHandler}
        >
          <Form>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <TextFieldWrapper name="email" label="Email" />
              </Grid>
              <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <TextFieldWrapper name="password" label="Password" />
              </Grid>
              <Grid item xs={12} sx={{ ml: "3rem", mr: "3rem" }}>
                <Stack direction="row" spacing={2}>
                  <Typography
                    variant="body1"
                    component="span"
                    onClick={() => {
                      navigate("/frogot-password");
                    }}
                    style={{
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                <ButtonWrapper>Sign In</ButtonWrapper>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  ml: "3em",
                  mr: "3em",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Typography
                    variant="body1"
                    component="span"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    Not registered yet?{" "}
                    <span
                      style={{
                        color: "#beb4fb",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      Create an Account
                    </span>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Container>
    </AuthComponent>
  );
};

export default Login;
