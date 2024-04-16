import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Layouts/Layout";
import { AllCategory, CreateSingleProduct } from "../../../api/api";
import Loader from "../../../components/loaders/Loader";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [defaultImage, setDefaultImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState();
  const [subtitle, setSubtitle] = useState("");
  const [rating, setRating] = useState();
  const [minDimension, setMinDimension] = useState();
  const [maxDimension, setMaxDimension] = useState();
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(null);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("defaultImage", defaultImage);
    formData.append("hoverImage", hoverImage);
    formData.append("subtitle", subtitle);
    formData.append("rating", rating);
    formData.append("minDimension", minDimension);
    formData.append("maxDimension", maxDimension);
    formData.append("price", price);
    console.log("Category", category);
    if (!category) {
      toast.error("Category is required");
      setLoading(false);
      return;
    }

    const { data, error } = await CreateSingleProduct(formData);
    if (data) {
      toast.success(data?.message);
      setLoading(false);
      navigate("/dashboard/admin/products");
    } else if (error) {
      setLoading(false);
      console.log("error");
      toast.error(error?.message);
    }
  };

  const getAllCategories = async () => {
    setLoading(true);
    const { data, error } = await AllCategory();
    console.log("Data", data);
    if (data) {
      setLoading(false);
      setCategories(data?.categories);
    } else if (error) {
      toast.error(error?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <Layout>
      {loading && <Loader />}
      <div className="w-[90%] md:w-[60%] 2xl:w-[40%] p-10 pt-4 rounded-2xl mt-2 mb-5 shadow-2xl mx-auto">
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
          Create Collection
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div></div>
          <div>
            <form
              className="max-w-md mx-auto mt-10"
              onSubmit={handleRegisterSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4 w-max">
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Default Image
                  </label>
                  <div className="relative cursor-pointer">
                    {defaultImage ? (
                      <img
                        src={URL.createObjectURL(defaultImage)}
                        alt="avatar"
                        className="h-32 w-32 rounded cursor-pointer"
                      />
                    ) : (
                      <img
                        src="/images/avatar-.jpg"
                        alt="avatar"
                        className="h-32 w-32 rounded cursor-pointer"
                      />
                    )}

                    <input
                      type="file"
                      alt="avatar"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setDefaultImage(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 w-max">
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Hover Image
                  </label>
                  <div className="relative cursor-pointer">
                    {hoverImage ? (
                      <img
                        src={URL.createObjectURL(hoverImage)}
                        alt="avatar"
                        className="h-32 w-32 rounded cursor-pointer"
                      />
                    ) : (
                      <img
                        src="/images/avatar-.jpg"
                        alt="avatar"
                        className="h-32 w-32 rounded cursor-pointer"
                      />
                    )}

                    <input
                      type="file"
                      alt="avatar"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setHoverImage(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Name
                </label>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium  text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Select Category
                </label>
                <select
                  id="filter"
                  className="text-base rounded-lg block w-1/2 p-2.5 focus:outline-none"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value=""></option>
                  {categories &&
                    categories.map((item) => (
                      <option
                        key={item?._id}
                        className="text-base p-2"
                        value={item?._id}
                      >
                        {item?.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Subtitle
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Rating
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={minDimension}
                  onChange={(e) => setMinDimension(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Min Dimension
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Max Dimension
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Price
                </label>
              </div>

              <button
                type="submit"
                className="site-button py-2 px-4 hover:px-5 mt-3 flex"
              >
                Submit
                {loading && (
                  <div className="ml-2 mt-1 animate-spin rounded-full h-4 w-4 border-t-4 border-white border-solid"></div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
