import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import Layout from "../../Layouts/Layout"
import CommanBanner from "../../components/common/CommanBanner"
import ProductTile from "../../components/products/ProductTile"
import { productsData } from "../../components/home/HomeData"
import { GetSingleCategory } from "../../api/api"
import Loader from "../../components/loaders/Loader"

const SingleProductCollection = () => {
  const pathname = useParams()
  const slug = pathname?.slug
  const [imageBanner, setImageBanner] = useState(false)
  const [title, setTitle] = useState("")
  const [pageLoading, setPageLoading] = useState(false)
  const [bannerImage, setBannerImage] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState(null)

  const getCategory = async () => {
    setPageLoading(true)
    const { data, error } = await GetSingleCategory(slug)
    if (data) {
      setTitle(data?.category?.name)
      if (data?.category?.bannerImage) {
        setImageBanner(true)
        setBannerImage(data?.category?.bannerImage)
      }
      setCategoryProducts(data?.category?.products)
      setPageLoading(false)
    } else if (error) {
      console.log(error)
      setPageLoading(true)
    }
  }

  useEffect(() => {
    getCategory()
    setImageBanner(false)
    if (slug === "waschtische") {
      setImageBanner(true)
    }
    //eslint-disable-next-line
  }, [slug])

  const createBlobUrl = (data, contentType) => {
    const byteArray = new Uint8Array(data)
    const blob = new Blob([byteArray], { type: contentType })
    return URL.createObjectURL(blob)
  }

  return (
    <Layout>
      {pageLoading && <Loader />}
      {/* <img
        src={createBlobUrl(bannerImage?.data?.data, bannerImage?.contentType)}
        alt=""
      /> */}
      {imageBanner && (
        <div
          style={{
            backgroundImage: `url(${createBlobUrl(
              bannerImage?.data?.data,
              bannerImage?.contentType
            )})`,
          }}
          className="single_collection_banner h-[300px] md:h-[400px] lg:h-[500px] relative bg-cover bg-center"
        >
          <div className="bg-black absolute inset-0 opacity-20"></div>
          <div className="text-center text-white absolute inset-0 pt-10">
            <p className="uppercase my-10">JETZT KONFIGURIEREN</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {title}
            </h1>
          </div>
        </div>
      )}
      <div className="md:w-[90%] mx-auto p-5">
        <div className="flex">
          <Link to="/">
            <div className="text-gray-600">Start</div>
          </Link>
          <div className="mx-2">/</div>
          <div>{title && title}</div>
        </div>
        <div className="flex mt-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mx-auto">
            {title && title}
          </h1>
        </div>
        <div className="my-5 md:my-2 md:flex items-center">
          <div className="text-gray-600 w-max">
            {categoryProducts && categoryProducts.length} Produkte
          </div>
          <div className="flex items-center ml-auto">
            <h6 className="text-gray-600 whitespace-nowrap ml-auto">
              Sortieren nach
            </h6>
            <select
              id="filter"
              className="text-base rounded-lg block w-1/2 p-2.5 focus:outline-none"
            >
              <option className="text-base p-2" value="">
                Ausgewählt
              </option>
              <option className="text-base p-2" defaultValue="">
                Meistverkauft
              </option>
              <option className="text-base p-2" value="">
                Alphabetisch, A-Z
              </option>
              <option className="text-base p-2" value="">
                Alphabetisch, Z-A
              </option>
              <option className="text-base p-2" value="">
                Preis, niedrig nach hoch
              </option>
              <option className="text-base p-2" value="">
                Preis, hoch nach niedrig
              </option>
              <option className="text-base p-2" value="">
                Datum, alt zu neu
              </option>
              <option className="text-base p-2" value="">
                Datum, neu zu alt
              </option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-5 md:mt-0">
          {categoryProducts &&
            categoryProducts.map((item) => (
              <ProductTile
                key={item?._id}
                id={item?._id}
                defaultImg={item?.defaultImage}
                hoverImg={item?.hoverImage}
                name={item?.name}
                rating={item?.rating}
                subtitle={item?.subtitle}
                minDimension={item?.minDimension}
                maxDimension={item?.maxDimension}
                price={item?.price}
                buttonText="Add To Cart"
                link={`/products/${item?._id}`}
              />
            ))}
        </div>
        {/* ----------------------Banner-------------------------- */}
      </div>
      <div className="mt-4">
        <CommanBanner />
      </div>
    </Layout>
  )
}

export default SingleProductCollection
