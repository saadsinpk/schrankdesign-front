import { useCallback } from "react"
import Config from "../../config"

import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg"
import useDndStore from "../zustand/dndStore"
import useCornerStore from "../zustand/cornerStore"
import useFurnishingStore from "../zustand/furnishingStore"

export default function ProductCard(props) {
  const { imageUrl, title, type, drawerHeight, door_type } = props
  const setType = useDndStore.use.setType()
  const setDoorType = useDndStore.use.setDoorType()
  const setDrawerHeight = useDndStore.use.setDrawerHeight()
  const setDrawerTopDistance = useDndStore.use.setDrawerTopDistance()
  const setProductDragging = useDndStore.use.setProductDragging()

  const setShowDimensions = useCornerStore.use.setShowDimensions()

  const updateSelected = useFurnishingStore.use.updateSelected()
  const updateDoorSelected = useFurnishingStore.use.updateDoorSelected()

  const handleDragStart = useCallback(
    (event) => {
      // event.dataTransfer.setData("application/dnd", nodeType)
      event.dataTransfer.effectAllowed = "move"

      // Create an image element with a transparent source
      const transparentImage = new Image()
      transparentImage.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAA5ElEQVR42mJ0VcBwAABIP4PjlWIxRS8BPD+DAzO7Z2FgGIC9AGZJ/UdMCLGedTkxnhRJTDF3AAdEwARHg4ArJCA1DKAgQwAKjAdKpS5gACg4ArCCAQEAAgLAjQozIAQAA1kO6BpMAiGABABFgQAVABIQAAEoAIBAAASKAAgEAAEiAAgEAABIoACCwB8Mz5zW0WiAAAAAElFTkSuQmCC"

      // Set the transparent image as the drag image
      event.dataTransfer.setDragImage(transparentImage, 0, 0)
      setProductDragging(true)
      setType(type)
      updateSelected({ selected: false })
      if (drawerHeight !== undefined) setDrawerHeight(drawerHeight)
      if (type === Config.furnishing.type.drawer)
        setDrawerTopDistance(Config.furnishing.drawer.topShelfDistance)

      if (type === Config.furnishing.type.door) {
        setDoorType(door_type)
        updateDoorSelected({ selected: false })
      }
      setShowDimensions(false)
    },
    [type, drawerHeight]
  )

  return (
    <div className="relative">
      <div
        className={`${
          title === undefined ? "" : "p-3 border border-black"
        } cursor-pointer bg-[#f5f5f5]`}
        onDragStart={handleDragStart}
        draggable
      >
        <img src={imageUrl} className="mb-1" draggable={false} />
      </div>
      <div className="my-1 text-lg text-black text-center">{title}</div>
      <div className="absolute right-0 top-0 cursor-target">
        <InfoIcon />
      </div>
    </div>
  )
}
