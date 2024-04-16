import { Fade } from "react-awesome-reveal"
import { ReactComponent as IconStar } from "../icons/star.svg"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addToBasket } from "../../store/features/cart/cartSlice"
import toast from "react-hot-toast"

const ProductTile = ({
  id,
  defaultImg,
  hoverImg,
  name,
  subtitle,
  rating,
  minDimension,
  maxDimension,
  price,
  buttonText,
  link,
  quantity,
}) => {
  
  const dispatch = useDispatch()
  const generateStars = () => {
    const starArray = []
    for (let i = 0; i < rating; i++) {
      starArray.push(
        <span key={i}>
          <IconStar className="text-yellow-400 fill-yellow-400 mr-2 text-xs h-5 w-5" />
        </span>
      )
    }
    return starArray
  }
  
  const handleAddToCart = async () => {
    const product = {
      id,
      defaultImg,
      hoverImg,
      name,
      subtitle,
      rating,
      minDimension,
      maxDimension,
      price,
    }
    dispatch(addToBasket(product))
    toast.success("Added to Cart.")
  }
  // console.log("Image Type in props", typeof defaultImg)

  return (
    <>
      <div
        key={id}
        className="bg-white rounded-2xl shadow-2xl single_product cursor-pointer mt-2 md:mt-5"
      >
        <Link to={link}>
          <Fade>
            <img
              src={
                typeof defaultImg === "string"
                  ? defaultImg
                  : `data:${
                      defaultImg?.contentType
                    };base64,${String.fromCharCode(
                      ...new Uint8Array(defaultImg?.data?.data)
                    ).toString("utf-8")}`
              }
              alt=""
              className="rounded-2xl cursor-pointer  w-max image1"
            />
          </Fade>
          <Fade>
            <img
              src={
                typeof hoverImg === "string"
                  ? hoverImg
                  : `data:${hoverImg?.contentType};base64,${String.fromCharCode(
                      ...new Uint8Array(hoverImg?.data?.data)
                    ).toString("utf-8")}`
              }
              alt=""
              className="rounded-2xl cursor-pointer image2"
            />
          </Fade>
        </Link>
        <div className="text-center my-2 pb-4">
          <h5 className="text-xl mt-4 font-medium">{name}</h5>

          {rating && (
            <div className="flex my-2 mx-auto w-max">
              {rating > 0 && (
                <div className="flex w-max">{generateStars()}</div>
              )}
              {!rating > 0 && (
                <div className="flex w-max">
                  {" "}
                  <IconStar className="text-yellow-400 fill-yellow-400 mr-2 text-xs h-5 w-5 invisible" />
                </div>
              )}
            </div>
          )}
          {subtitle && (
            <div className="flex my-2 mx-auto w-max">
              <p className="w-max">{subtitle}</p>
            </div>
          )}
          <h5 className="text-lg font-medium mt-2">
            Dimensions {minDimension} - {maxDimension}
          </h5>
          <div className="mt-2 text-base">ab {price} €</div>
          {buttonText && (
            <button
              onClick={handleAddToCart}
              className="site-button mt-4 text-base font-light"
            >
              {buttonText}
            </button>
          )}
          {quantity && (
            <p className="mt-4 italic text-gray-600">Quantity: {quantity}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductTile
