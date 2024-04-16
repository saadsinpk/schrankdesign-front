import DropdownArrowMain from "../../../public/images/furniture_configurator/dropdown-arrow-main.png";
import DropdownCloseIcon from "../../../public/images/furniture_configurator/dropdown-close-icon.png";
import PlatesTest from "../../../public/images/furniture_configurator/plates-test.png";
import Input from "../Input";
import DeleteIcon from "../../../public/images/furniture_configurator/delete-icon.png";
import Dropdown from "../dropdown/index";
import { platesvalidationSchema } from "../../Formik/FormikFunctions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import {
  CreatePlates,
  DeltePlate,
  EditPlates,
} from "../../Functions-configurator/Function-configurator";
import { useEffect, useRef, useState } from "react";

const baseUrl = import.meta.env.VITE_BACKEND_URL_img;

export const PlatesAccordianBefore = ({ handleToggle, viewdata }) => {
  const HandleEdit = (id) => {
    localStorage.setItem("editplate_id", id);
    handleToggle();
  };
  const [Image, setImage] = useState();

  useEffect(() => {
    if (viewdata?.images?.length > 0) {
      setImage(`${baseUrl}${viewdata?.images[0]}`);
    }
  }, [viewdata?.images[0]]);
  return (
    <div className="flex flex-col sm:flex-row items-center gap-[15px] w-full flex-wrap justify-between">
      <div>
        <div className="w-[50px] h-[50px]">
          <img
            className="w-[50px] h-[50px]"
            src={viewdata?.images?.length > 0 ? `${baseUrl}${viewdata?.images[0]}` : PlatesTest}
            alt="Plates_Test"
          />
        </div>
      </div>
      <div className="border-l-2 border-[#D9D9D9] flex-wrap px-6 py-1 flex flex-row items-center gap-[15px] justify-between">
        <h1 className="font-[karla] text-[20px] font-medium">Name</h1>
        <div className="w-[170px]">
          <div className="relative">
            <span className="block text-[20px] leading-[30px] font-[karla] font-bold  outline-none w-full border border-solid border-black bg-[#F6F6F6] rounded-[3px] px-3">
              {viewdata?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="border-l-2 border-[#D9D9D9] flex-wrap px-6 py-1 flex flex-row items-center gap-[15px] justify-between">
        <h1 className="font-[karla] text-[20px] font-medium">Config ID</h1>
        <div className="w-[170px]">
          <div className="relative">
            <span className="block text-[20px] leading-[30px] font-[karla] font-bold  outline-none w-full border border-solid border-black bg-[#F6F6F6] rounded-[3px] px-3">
              {viewdata?.configId}
            </span>
          </div>
        </div>
      </div>
      <div className="border-l-2 border-[#D9D9D9] flex-wrap px-6 py-1 flex flex-row items-center gap-[15px] justify-between">
        <h1 className="font-[karla] text-[20px] font-medium">Edge Cost</h1>
        <div className="w-[170px]">
          <div className="relative">
            <span className="block text-[20px] leading-[30px] font-[karla] font-bold  outline-none w-full border border-solid border-black bg-[#F6F6F6] rounded-[3px] px-3">
              {viewdata?.plate_cost}
            </span>
          </div>
        </div>
      </div>
      <button className="w-[31px] shrink-0" onClick={() => HandleEdit(viewdata._id)}>
        <img src={DropdownArrowMain} alt="dropdown_arrow_main" />
      </button>
    </div>
  );
};

export const PlatesAccordianAfter = ({ handleToggle, newPlate, viewdata, createplate }) => {
  const [Image, setImage] = useState();
  const [disabled, setdisabled] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (viewdata?.images?.length > 0) {
      setImage(`${baseUrl}${viewdata?.images[0]}`);
    }
  }, [viewdata?.images[0]]);

  const list1 = [
    {
      label: "Name",
      logo: null,
      name: "name",
    },
    {
      label: "Config-ID",
      logo: null,
      name: "configId",
    },
    {
      label: "Plate Cost/m2",
      logo: "€/m²",
      name: "plate_cost",
    },
    {
      label: "Price-Increase",
      logo: "%",
      name: "price_increase",
    },
    {
      label: "Supplier ID",
      logo: null,
      name: "supplier_id",
    },
  ];

  const list2 = [
    {
      label: "Plate Length",
      logo: "mm",
      name: "plate_length",
    },
    {
      label: "Plate Width",
      logo: "mm",
      name: "plate_width",
    },
    {
      label: "Plate Thickness",
      logo: "mm",
      name: "plate_thickness",
    },
    {
      label: "Plate-Sort",
      logo: null,
      name: "",
    },
    {
      label: "Backplate ID",
      logo: null,
      name: "BackP_Id_match",
    },
  ];

  const platesinitialValues = {
    name: viewdata?.name || "",
    configId: viewdata?.configId || "",
    plate_cost: viewdata?.plate_cost || "",
    price_increase: viewdata?.price_increase || "",
    supplier_id: viewdata?.supplier_id || "",
    plate_length: viewdata?.plate_length || "",
    plate_width: viewdata?.plate_width || "",
    plate_thickness: viewdata?.plate_thickness || "",
    BackP_Id_match: viewdata?.BackP_Id_match || "",
    plate_sort: viewdata?.plate_sort || "dekorplate",
    images: viewdata?.images[0],
  };
  const dropdownOptions = [
    "Dekorplate",
    "Furnierplate",
    "Backplate",
    "Wood-Dekorplate",
    "Massiv-wood",
  ];

  const Handlesubmit = async (values, { resetForm }) => {
    setdisabled(true);
    if (createplate) {
      const { data, error } = await CreatePlates(values);
      if (data) {
        resetForm();
        toast.success(data?.message);

        newPlate(data?.data);
        setImage(null);
        setdisabled(false);
        handleToggle(); // Close the form or accordion section
      } else {
        toast.error(error?.message);
        setdisabled(false);
      }
    } else {
      const id = localStorage.getItem("editplate_id");
      const { data, error } = await EditPlates(values, id);
      if (data) {
        toast.success(data?.message);
        newPlate(data?.data);
        setdisabled(false);
        handleToggle(); // Close the form or accordion section
      } else {
        toast.error(error?.message);
        setdisabled(false);
      }
    }
  };

  const DeleteSelectedPlate = async (id) => {
    setdisabled(true);
    const { data, error } = await DeltePlate(id);
    if (data) {
      toast.success(data?.message);
      newPlate(data?.data);
      setdisabled(false);
      handleToggle(); // Close the form or accordion section
    } else {
      toast.error(error?.message);
      setdisabled(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e, formik) => {
    const selectedFile = e.target.files[0];
    setImage(URL.createObjectURL(selectedFile));
    formik.setFieldValue("images", selectedFile);
  };
  return (
    <Formik
      initialValues={platesinitialValues}
      onSubmit={Handlesubmit}
      validationSchema={platesvalidationSchema}
      enableReinitialize
    >
      {(formik) => (
        <Form className="w-full">
          <div className="flex relative justify-between flex-wrap p-5 pr-16">
            <div className="flex items-center justify-center h-full">
              <div
                className="w-[182px] text-lg cursor-pointer h-48 bg-[#F6F6F6] flex items-center justify-center"
                onClick={handleImageClick}
              >
                {Image === "https://backend.schrankdesign.net/uploads/undefined" || !Image ? (
                  "upload image"
                ) : (
                  <img className="w-full h-full" src={Image} alt="Plates_TEst" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".jpeg, .jpg, .png"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, formik)}
                />
              </div>
            </div>
            <div className="w-[2px] bg-[#D9D9D9] h-auto " />
            <div className="flex flex-col items-center justify-between h-full">
              {list1.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full flex-row items-center justify-between gap-[20px] mb-2"
                  >
                    <h1 className="font-[karla] text-[18px] font-semibold">{item.label}</h1>
                    <div className="w-[170px]">
                      <div className="relative">
                        <Field
                          className={`block text-[20px] leading-[30px] font-[karla] font-bold  outline-none w-full border border-solid border-black bg-[#F6F6F6] rounded-[3px] pl-3 ${item.logo ? "pr-14" : "pr-3"
                            }`}
                          id={item.name}
                          name={item.name}
                          disabled={item.name === "configId" && true
                          }
                        // placeholder={item.placeholder}
                        />
                        {item.logo && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex  pr-3">
                            <p className="text-[18px] leading-[30px] font-[karla] font-normal">
                              {item?.logo}
                            </p>
                          </div>
                        )}
                        <ErrorMessage
                          name={item?.name}
                          component="div"
                          className="mt-2 text-red-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-[2px] bg-[#D9D9D9] h-auto " />
            <div className="flex flex-col items-start justify-between h-full">
              {list2.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full flex-row  justify-between items-center gap-[15px] mb-2"
                  >
                    <h1 className="font-[karla] text-[18px] font-semibold">{item.label}</h1>
                    <div className="w-[170px]">
                      {item.label === "Plate-Sort" ? (
                        <Field
                          as="select"
                          name="plate_sort"
                          className="w-full border h-[32px] border-solid border-black bg-[#F6F6F6] rounded-[3px] px-[12px] text-[20px] font-[karla] font-bold"
                        >
                          <option value="dekorplate">Dekorplate</option>
                          <option value="furnierplate">Furnierplate</option>
                          <option value="backplate">Backplate</option>
                          <option value="wood-Dekorplate">Wood-Dekorplate</option>
                          <option value="massiv-wood">Massiv-wood</option>
                        </Field>
                      ) : (
                        <div className="relative">
                          <Field
                            className={`block text-[20px] leading-[30px] font-[karla] font-bold  outline-none w-full border border-solid border-black bg-[#F6F6F6] rounded-[3px] pl-3 ${item.logo ? "pr-14" : "pr-3"
                              }`}
                            id={item.name}
                            name={item.name}
                          />
                          {item.logo && (
                            <div className="pointer-events-none absolute top-0 right-0 flex  pr-3">
                              <p className="text-[18px] leading-[30px] font-[karla] font-normal">
                                {item?.logo}
                              </p>
                            </div>
                          )}
                          <ErrorMessage
                            name={item?.name}
                            component="div"
                            className="mt-2 text-red-500"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
            <div className="w-[2px] bg-[#D9D9D9] h-auto " />
            <div className="flex gap-[25px] h-full mt-auto">
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[5px]">
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Plate Cost:
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      {parseFloat((((formik?.values?.plate_length * formik?.values?.plate_width) / 1000000) * (+formik?.values?.plate_cost)).toFixed(2))}  €/pcs
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Plate-Waste:
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">20 %</h1>
                  </div>
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Edge ID:
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      {Array.isArray(viewdata?.edgeConfigIds) && viewdata?.edgeConfigIds.length > 0 ? viewdata?.edgeConfigIds.join(', ') : 'N/A'}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Price selling:
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      {(() => {
                        const plateCost = +formik?.values?.plate_cost || 0;
                        const priceIncrease = +formik?.values?.price_increase || 0;
                        const totalSalePrice = parseFloat((plateCost + (plateCost * priceIncrease / 100)).toFixed(2));

                        // Displaying the calculated total sale price
                      return `${totalSalePrice} €/m²`; // Display the area in square meters
                      })()}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Plate total m² :
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                    {(() => {
                      const plateLengthInMeters = (+formik?.values?.plate_length || 0) / 1000; // Convert mm to meters
                      const plateWidthInMeters = (+formik?.values?.plate_width || 0) / 1000; // Convert mm to meters
                      
                      const areaInSquareMeters = (plateLengthInMeters * plateWidthInMeters).toFixed(2); // Area in m², fixed to 2 decimal places for readability
                      
                      return `${areaInSquareMeters} m²`; // Display the area in square meters
                    })()}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between gap-6">
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                      Profit m² :
                    </h1>
                    <h1 className="font-[karla] leading-[16px] font-semibold text-[18px]">
                        {(() => {
                          const plateCost = +formik?.values?.plate_cost || 0;
                          const priceIncrease = +formik?.values?.price_increase || 0;
                          const totalProfit = parseFloat((plateCost * priceIncrease / 100).toFixed(2));

                          // Displaying the calculated total sale price
                        return `${totalProfit} €/m²`; // Display the area in square meters
                        })()}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  {!createplate && (
                    <button
                      disabled={disabled}
                      onClick={() => DeleteSelectedPlate(viewdata?._id)}
                      className="cursor-pointer"
                      type="button"
                    >
                      <img className="w-[28px]" src={DeleteIcon} alt="DeleteIcon" />
                    </button>
                  )}
                  <div>
                    <button
                      disabled={disabled}
                      type="submit"
                      className="font-[karla] text-white font-bold bg-[#36695C] rounded-[5px] px-[9px] py-[4px] shadow-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="absolute right-5 top-5 w-[31px]"
              onClick={() => {
                localStorage.removeItem("editplate_id");
                handleToggle();
              }}
            >
              <img src={DropdownCloseIcon} alt="dropdown_arrow_main" />
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
