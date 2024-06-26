import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Form, Formik } from "formik";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SignUpFormFields from "./SignUpFormFields";
import SubmitButton from "@/src/common/components/forms/SubmitButton";
import AccountsService from "../service/AccountsService";
import { Purples, neutral } from "@/src/common/config/colors";
import { SignUpFormValidationSchema } from "../utils/helper";
import {
  FRONTEND_LOGIN_PAGE_URL,
  FRONTEND_VERIFY_EMAIL_URL,
  FRONTEND_TERMS_AND_CONDITIONS_URL,
} from "@/src/common/utils/constants";

const accountsService = new AccountsService();
const SignUpForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const initialState = {
    name: "",
    mail: "",
    password: "",
    gender: "",
    username: "",
  };

  const handleSubmit = async (data, actions) => {
    console.log(data);
    try {
      const { name, mail, password, gender, username } = data;
      // const reqUrl = `${process.env.API_BASE_SERVICE}/api/auth/signup`;
      const reqUrl = "https://lgbtq-backend.onrender.com/api/auth/signup";
      console.log(reqUrl);
      const requestData = {
        name,
        email: mail,
        password,
        gender,
        username,
      };
      console.log(requestData);
      actions.setSubmitting(true);
      const Response = await accountsService.post(reqUrl, requestData);
      actions.setSubmitting(false);
      enqueueSnackbar("User successfully signed up", {
        variant: "info",
        autoHideDuration: 2000,
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      router.push(FRONTEND_VERIFY_EMAIL_URL);
    } catch (error) {
      await new Promise((r) => setTimeout(r, 1000));
      console.error('Error details:', error);
  
      if (error.response && error.response.status === 409) {
        // Assuming 409 Conflict is returned for existing email
        enqueueSnackbar("Email already in use, please use a different email", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      } 
      else {
        enqueueSnackbar("Something went wrong, please try again", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      }
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  };
  
  return (
    <>
      <Formik
        initialValues={initialState}
        validationSchema={SignUpFormValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <SignUpFormFields />
            <Typography
              variant="h6"
              mt={2}
              sx={{
                fontSize: { xs: 12, lg: 12 },
                color: neutral["900"],
                fontWeight: 400,
              }}
            >
              By signing up, you agree to our{" "}
              <Link
                href={FRONTEND_TERMS_AND_CONDITIONS_URL}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontSize: { xs: 12, lg: 12 },
                    color: Purples["A100"],
                    fontWeight: 700,
                  }}
                >
                  Terms and Conditions
                </Typography>{" "}
              </Link>
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              mt={6}
              flexDirection="column"
              rowGap={2}
            >
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                variant="contained"
              >
                Explore
              </SubmitButton>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: 12, lg: 12 },
                  color: neutral["900"],
                  fontWeight: 400,
                }}
              >
                Already have an account?{" "}
                <Link
                  href={FRONTEND_LOGIN_PAGE_URL}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontSize: { xs: 12, lg: 12 },
                      color: Purples["A100"],
                      fontWeight: 700,
                    }}
                  >
                    Login
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
