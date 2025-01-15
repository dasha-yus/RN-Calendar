import * as yup from "yup";

export const notificationValidationSchema = yup.object().shape({
  text: yup.string().required("Text is required"),
});
