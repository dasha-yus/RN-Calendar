import * as yup from "yup";

export const eventValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});
