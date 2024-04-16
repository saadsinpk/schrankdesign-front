import { useCallback } from "react"
import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg"
import Config from "../../config"
import useColorStore from "../zustand/colorStore"

export default function ColorCard(props) {
  const { imageUrl, type, textureType, category } = props
  const setBodyType = useColorStore.use.setBodyType()
  const setFrontType = useColorStore.use.setFrontType()
  const setBodyTexture = useColorStore.use.setBodyTexture()
  const setFrontTexture = useColorStore.use.setFrontTexture()

  const handleClick = useCallback(() => {
    if (category === Config.color.category.body) {
      setBodyType(type)
      setBodyTexture(textureType)
    } else if (category === Config.color.category.front) {
      setFrontType(type)
      setFrontTexture(textureType)
    }
  }, [type, textureType, category])

  return (
    <div
      className="w-[100px] border border-black rounded-[12px] rounded-tr-none bg-[#f5f5f5] cursor-pointer max-h-36 relative m-auto"
      onClick={handleClick}
    >
      <img src={imageUrl} draggable={false} className="rounded-lg" />
      <div className="absolute right-0 top-0 cursor-target">
        <InfoIcon />
      </div>
    </div>
  )
}
