/* eslint-disable react/no-unknown-property */
import { RoundedBox } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { useEffect } from "react"

import Config from "../../config"
import Drawer from "./common/drawer"
import InternalDrawer from "./common/internalDrawer"
import ClothesRail from "./common/clothesRail"
import PantsPullout from "./common/pantsPullout"
import LedLighting from "./common/ledLighting"
import ClothesLift from "./common/clothesLift"
import SlopingFloor from "./common/slopingFloor"
import DividerPage from "./common/didviderPage"
import DimensionLine from "./common/dimensionLine"
import Door from "./common/door"
import {
  getDefaultScale,
  getDraggingInfo,
  getPosZAvailable,
} from "../utils/draggingInfo"
import { getBottom, getTop } from "../utils/availableSpace"
import CustomMaterial from "./common/customMaterial"
import useDndStore from "../zustand/dndStore"
import useDimensionStore from "../zustand/dimensionStore"
import useFurnishingStore from "../zustand/furnishingStore"

let intersects = new Array(1)

// show or hide top and bottom shelf of drawer
let topVisible = true
let bottomVisible = true

// show or hide shelf of neighbors
let topConnected = false
let bottomConnected = false

let topAssetType = "none"

const DraggingObject = React.memo(function DraggingObject({ spaceRef }) {
  // dragging pointer
  const pointer = useMemo(() => new THREE.Vector2(), [])

  const productDragging = useDndStore.use.productDragging()
  const type = useDndStore.use.type()
  const drawerHeight = useDndStore.use.drawerHeight()
  const door_type = useDndStore.use.door_type()
  const door_category = useDndStore.use.door_category()

  const width = useDimensionStore.use.width()
  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const elementsCount = useDimensionStore.use.elementsCount()

  const addAsset = useFurnishingStore.use.addAsset()
  const addLed = useFurnishingStore.use.addLed()
  const addDoor = useFurnishingStore.use.addDoor()

  const { size, camera, raycaster } = useThree()

  // dragging object scale
  const defaultScale = useMemo(
    () => getDefaultScale(type, drawerHeight, depth),
    [type, drawerHeight, depth]
  )

  const [scale, setScale] = useState(defaultScale)

  useEffect(() => {
    setScale(defaultScale)
  }, [defaultScale])

  // Z position when dragging object belongs in available space
  const posZ = useMemo(() => getPosZAvailable(type, depth), [type, depth])

  // ref for dragging objects
  const objectRef = useRef()

  // raster for dragging object
  const raster = useMemo(
    () =>
      type == Config.furnishing.type.shelf ||
      type == Config.furnishing.type.glassBottom
        ? Config.furnishing.shelf.raster
        : Config.furnishing.default.raster,
    [type]
  )

  // show or hide measurement
  const [showMeasure, setShowMeasure] = useState(false)
  const [measureInfo, setMeasureInfo] = useState({
    posX: 0,
    aboveTop: 0,
    aboveBottom: 0,
    belowTop: 0,
    belowBottom: 0,
  })

  // update door type based on element width
  const [doorType, setDoorType] = useState(door_type)

  const [elementIndex, setElementIndex] = useState(Config.elementIndex.first)
  const [top_asset, setTop_asset] = useState("none")
  const [bottom_asset, setBottom_asset] = useState("none")

  useEffect(() => {
    setDoorType(door_type)
  }, [door_type])

  useEffect(() => {
    window.addEventListener("drag", handleProductDrag)
    return () => {
      window.removeEventListener("drag", handleProductDrag)
    }
  }, [objectRef, spaceRef, defaultScale, scale, measureInfo, door_type])

  const handleProductDrag = useCallback(
    (event) => {
      event.preventDefault()

      pointer.x = ((event.clientX - size.left) / size.width) * 2 - 1
      pointer.y = -((event.clientY - size.top) / size.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)

      intersects = raycaster.intersectObjects(spaceRef.children, true)

      if (intersects[0] !== undefined) {
        if (intersects[0].object.name === "available") {
          const {
            xIndex,
            top,
            bottom,
            topAsset,
            bottomAsset,
            availableTop,
            availableBottom,
          } = intersects[0].object.userData

          setTop_asset(topAsset)
          setBottom_asset(bottomAsset)

          topAssetType = topAsset
          if (
            type === Config.furnishing.type.ledLighting ||
            type === Config.furnishing.type.divider ||
            type === Config.furnishing.type.door
          ) {
            if (type === Config.furnishing.type.door) {
              const tempElementIndex =
                xIndex === 0
                  ? Config.elementIndex.first
                  : xIndex === elementsCount - 1
                  ? Config.elementIndex.last
                  : Config.elementIndex.middle

              setElementIndex(tempElementIndex)

              const doorWidth = intersects[0].object.geometry.parameters.width
              if (
                door_type === Config.door.type.revolving_left ||
                door_type === Config.door.type.revolving_right
              ) {
                if (
                  doorWidth >= Config.door.left_type_range.min &&
                  doorWidth <= Config.door.left_type_range.max
                ) {
                  setDoorType(door_type)
                } else {
                  setDoorType(Config.door.type.revolving_double)
                }
              } else if (door_type === Config.door.type.revolving_double) {
                if (
                  doorWidth >= Config.door.double_type_range.min &&
                  doorWidth <= Config.door.double_type_range.max
                ) {
                  setDoorType(door_type)
                } else {
                  setDoorType(Config.door.type.revolving_left)
                }
              }
            }

            objectRef.current?.position.set(
              intersects[0].object.position.x,
              intersects[0].object.position.y,
              posZ
            )

            if (
              scale[0] !== intersects[0].object.geometry.parameters.width ||
              scale[1] !== intersects[0].object.geometry.parameters.height ||
              scale[2] !== defaultScale[2]
            ) {
              setScale([
                intersects[0].object.geometry.parameters.width,
                intersects[0].object.geometry.parameters.height,
                defaultScale[2],
              ])
            }
          } else {
            const result = getDraggingInfo({
              type,
              top,
              bottom,
              topAsset,
              bottomAsset,
              initialPosY: intersects[0].point.y * 100 + height / 2,
              raster,
              availableWidth: intersects[0].object.geometry.parameters.width,
              objectHeight: scale[1],
            })

            topVisible = result.topVisible
            bottomVisible = result.bottomVisible
            topConnected = result.topConnected
            bottomConnected = result.bottomConnected

            objectRef.current?.position.set(
              intersects[0].object.position.x,
              result.posY,
              posZ
            )

            if (
              scale[0] !== result.objectWidth ||
              scale[1] !== defaultScale[1] ||
              scale[2] !== defaultScale[2]
            ) {
              setScale([result.objectWidth, defaultScale[1], defaultScale[2]])
            }

            setShowMeasure(true)

            const tempMeasureInfo = {
              posX: intersects[0].object.position.x,
              aboveTop: availableTop,
              aboveBottom: getBottom(
                result.posY,
                scale[1],
                type,
                Config.furnishing.drawer.topShelfDistance
              ),
              belowTop: getTop(result.posY, scale[1], type),
              belowBottom: availableBottom,
            }

            if (
              JSON.stringify(measureInfo) !== JSON.stringify(tempMeasureInfo)
            ) {
              setMeasureInfo(tempMeasureInfo)
            }
          }
        } else {
          if (
            type === Config.furnishing.type.drawer ||
            type === Config.furnishing.type.internalDrawer
          ) {
            topVisible = true
            topConnected = false

            bottomVisible = true
            bottomConnected = false
          }

          objectRef.current?.position.set(
            intersects[0].point.x * 100 + width / 2,
            intersects[0].point.y * 100 + height / 2,
            depth + depth / 2
          )

          setShowMeasure(false)
        }
      }
    },
    [objectRef, spaceRef, defaultScale, scale, measureInfo, door_type]
  )

  useEffect(() => {
    if (!productDragging) {
      setShowMeasure(false)

      if (intersects[0]?.object?.name === "available") {
        const payload = {}

        if (type === Config.furnishing.type.ledLighting) {
          payload.asset = {
            xIndex: intersects[0].object.userData.xIndex,
            position: [
              objectRef.current?.position.x,
              objectRef.current?.position.y,
              objectRef.current?.position.z,
            ],
            scale,
          }
          addLed(payload)
        } else if (type === Config.furnishing.type.door) {
          payload.asset = {
            xIndex: intersects[0].object.userData.xIndex,
            position: [
              objectRef.current?.position.x,
              objectRef.current?.position.y,
              objectRef.current?.position.z,
            ],
            scale,
            type,
            doorType: doorType,
            doorCategory: door_category,
            topAsset: top_asset,
            bottomAsset: bottom_asset,
            elementIndex: elementIndex,
            selected: true,
            id: Date.now(),
          }
          addDoor(payload)
        } else {
          payload.asset = {
            xIndex: intersects[0].object.userData.xIndex,
            inDivider: intersects[0].object.userData.inDivider,
            d_xIndex: intersects[0].object.userData.d_xIndex,
            d_yPos: intersects[0].object.userData.d_yPos,
            position: [
              objectRef.current?.position.x,
              objectRef.current?.position.y,
              objectRef.current?.position.z,
            ],
            scale,
            type,
            selected: true,
            topAsset: top_asset,
            bottomAsset: bottom_asset,
            topVisible,
            bottomVisible,
            sideVisible: true,
            topShelfDistance:
              type === Config.furnishing.type.drawer
                ? Config.furnishing.drawer.topShelfDistance
                : undefined,
            topShelfVisible:
              type === Config.furnishing.type.divider &&
              (topAssetType === Config.furnishing.type.slopingFloor ||
                topAssetType === Config.furnishing.type.clothesLift ||
                topAssetType === Config.furnishing.type.clothesRail ||
                topAssetType === Config.furnishing.type.pantsPullout)
                ? true
                : false,
            dividerLeftWidth:
              type === Config.furnishing.type.divider
                ? (scale[0] - Config.furnishing.divider.thickness) / 2
                : undefined,
          }

          payload.drawerShelf = []
          if (topConnected) {
            payload.drawerShelf.push({
              location: "top",
              bottomVisible: !topConnected,
            })
          }
          if (bottomConnected) {
            payload.drawerShelf.push({
              location: "bottom",
              topVisible: !bottomConnected,
            })
          }

          addAsset(payload)
        }
      }

      objectRef.current?.position.set(width / 2, height / 2, -posZ)
    }
  }, [productDragging])

  return (
    <group>
      <group ref={objectRef} visible={productDragging}>
        <RoundedBox
          castShadow
          args={scale}
          visible={
            type === Config.furnishing.type.shelf ||
            type === Config.furnishing.type.foldBottom
          }
        >
          <CustomMaterial category={Config.color.category.body} />
        </RoundedBox>

        <RoundedBox
          castShadow
          args={scale}
          visible={type === Config.furnishing.type.glassBottom}
        >
          <CustomMaterial category={Config.color.category.body} />
        </RoundedBox>

        <Drawer
          scale={scale}
          depth={depth}
          elementIndex={Config.elementIndex.middle}
          visible={type === Config.furnishing.type.drawer}
          topVisible={true}
          bottomVisible={true}
          topShelfDistance={Config.furnishing.drawer.topShelfDistance}
        />

        <InternalDrawer
          scale={scale}
          depth={depth}
          visible={type === Config.furnishing.type.internalDrawer}
          topVisible={true}
          bottomVisible={true}
        />

        <ClothesRail
          width={scale[0]}
          visible={type === Config.furnishing.type.clothesRail}
        />

        <ClothesLift
          width={scale[0]}
          visible={type === Config.furnishing.type.clothesLift}
        />

        <PantsPullout
          scale={scale}
          visible={type === Config.furnishing.type.pantsPullout}
        />

        <LedLighting
          scale={scale}
          visible={type === Config.furnishing.type.ledLighting}
        />

        <SlopingFloor
          width={scale[0]}
          depth={scale[2]}
          visible={type === Config.furnishing.type.slopingFloor}
        />

        <DividerPage
          scale={scale}
          leftWidth={(scale[0] - Config.furnishing.divider.thickness) / 2}
          topShelfVisible={false}
          visible={type === Config.furnishing.type.divider}
        />
        <Door
          scale={scale}
          door_type={doorType}
          door_category={door_category}
          elementIndex={elementIndex}
          topAsset={top_asset}
          bottomAsset={bottom_asset}
          visible={type === Config.furnishing.type.door}
          withAnimation={false}
        />
      </group>
      {showMeasure && (
        <>
          <DimensionLine
            points={[
              [measureInfo.posX, measureInfo.aboveTop, depth],
              [measureInfo.posX, measureInfo.aboveBottom, depth],
            ]}
            endDir="X"
            value={parseInt(measureInfo.aboveTop - measureInfo.aboveBottom)}
            center={[
              measureInfo.posX,
              (measureInfo.aboveTop + measureInfo.aboveBottom) / 2,
              depth,
            ]}
            lineWidth={1.8}
            isBig={false}
          />
          <DimensionLine
            points={[
              [measureInfo.posX, measureInfo.belowTop, depth],
              [measureInfo.posX, measureInfo.belowBottom, depth],
            ]}
            endDir="X"
            value={parseInt(measureInfo.belowTop - measureInfo.belowBottom)}
            center={[
              measureInfo.posX,
              (measureInfo.belowTop + measureInfo.belowBottom) / 2,
              depth,
            ]}
            lineWidth={1.8}
            isBig={false}
          />
        </>
      )}
    </group>
  )
})

export default DraggingObject
