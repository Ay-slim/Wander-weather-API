import Joi from "joi";
import { CUSTOM_ERROR_PREFIX } from "../utils/constants";

export default Joi.object({
  city: Joi.string()
    .required()
    .messages({
      "string.base": `${CUSTOM_ERROR_PREFIX}'city' should be a type of 'string'`,
      "string.empty": `${CUSTOM_ERROR_PREFIX}'city' cannot be an empty field`,
      "any.required": `${CUSTOM_ERROR_PREFIX}'city' is a required field`,
    }),
  date: Joi.string()
    .isoDate()
    .required()
    .messages({
      "string.base": `${CUSTOM_ERROR_PREFIX}'date' should be a type of 'string'`,
      "string.empty": `${CUSTOM_ERROR_PREFIX}'date' cannot be an empty field`,
      "string.isoDate": `${CUSTOM_ERROR_PREFIX}'date' must be a valid ISO date (use the format yyyy-mm-dd)`,
      "any.required": `${CUSTOM_ERROR_PREFIX}'date' is a required field`,
    }),
});
