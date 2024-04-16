import * as Yup from 'yup';

// plates functions 
export const platesvalidationSchema = Yup.object().shape({
    name: Yup.string()
        .transform((value) => value.trim())
        .min(3, ("Too Short"))
        .required(("required* ")),
    // configId: Yup.string()
    //     .transform((value) => value.trim())
    //     .required(("required* ")),
    plate_cost: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    price_increase: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    supplier_id: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),
    plate_length: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    plate_width: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    plate_thickness: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    BackP_Id_match: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),
    plate_sort: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),

});


export const EdgevalidationSchema = Yup.object().shape({
    name: Yup.string()
        .transform((value) => value.trim())
        .min(3, ("Too Short"))
        .required(("required* ")),
    edge_cost: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    price_aufschlag: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    supplier_id: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),
    plate_Id_match: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),
    edge_width: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    edge_thickness: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
});


export const DrawervalidationSchema = Yup.object().shape({
    name: Yup.string()
        .transform((value) => value.trim())
        .min(3, ("Too Short"))
        .required(("required* ")),
    supplier_id: Yup.string()
        .transform((value) => value.trim())
        .required(("required* ")),
    price_einkauf: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    price_aufschlag: Yup.string()
        .transform((value) => value.trim())
        .matches(/^\d*\.?\d+$/, "Must be a number or a decimal")
        .required("Required*"),
    // edge_type: Yup.string()
    //     .transform((value) => value.trim())
    //     .required(("required* ")),
});