import DraggingObject from "./draggingObject"
import FurnishingComponent from "./components/FurnishingComponent"
// import { Selection, EffectComposer, Outline } from "@react-three/postprocessing"
import React, { Suspense, useEffect, useMemo, useState } from "react"

import {
  updateDoorAssets,
  updateFurnishing,
  updateFurnishingBaseType,
  updateLedAssets,
} from "../utils/updateFurnishing"
import AvailableSpaceGroup from "./availableSpaceGroup"
import {
  getAvailableSpace,
  getDoorSpace,
  getLedSpace,
} from "../utils/availableSpace"
import Config from "../../config"
import LedLightingComponent from "./components/LedLightingComponent"
import { calculateFurnishingInfo, getArrayIndex } from "../utils/getInfo"
import DoorComponent from "./components/DoorComponent"
import DividerComponent from "./components/DividerComponent"
import DrawerComponent from "./components/DrawerComponent"
import { getDefaultScale } from "../utils/draggingInfo"

import useDndStore from "../zustand/dndStore"
import useDimensionStore from "../zustand/dimensionStore"
import useFurnishingStore from "../zustand/furnishingStore"

const FurnishingGroup = React.memo(function FurnishingGroup() {
  const furnishingAssets = useFurnishingStore.use.furnishingAssets()
  const originalBaseType = useFurnishingStore.use.originalBaseType()
  const internalDrawerSides = useFurnishingStore.use.internalDrawerSides()
  const ledAssets = useFurnishingStore.use.ledAssets()
  const doorAssets = useFurnishingStore.use.doorAssets()

  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const elementsWidths = useDimensionStore.use.elementsWidths()
  const baseType = useDimensionStore.use.baseType()

  const type = useDndStore.use.type()
  const drawerHeight = useDndStore.use.drawerHeight()
  const drawerTopDistance = useDndStore.use.drawerTopDistance()
  const productDragging = useDndStore.use.productDragging()
  const assetDragging = useDndStore.use.assetDragging()

  const setOriginalBaseType = useFurnishingStore.use.setOriginalBaseType()
  const setFurnishingAssets = useFurnishingStore.use.setFurnishingAssets()
  const setTotalSpace = useFurnishingStore.use.setTotalSpace()
  const setLedAssets = useFurnishingStore.use.setLedAssets()
  const setDoorAssets = useFurnishingStore.use.setDoorAssets()

  // const initShelfAssets = useMemo(() => {
  //   let result = []
  //   for (let yIndex = 0; yIndex < elementsCount; yIndex++) {
  //     result.push([])
  //     for (let xIndex = 0; xIndex < elementsCount; xIndex++) {
  //       if (xIndex === 0) {
  //         if (yIndex === 0) {
  //           result[yIndex].push({
  //             pos: [
  //               Config.plate.thickness + elementsWidths[xIndex] / 2,
  //               height - elementsHeights[yIndex] - Config.plate.thickness / 2,
  //               depth / 2,
  //             ],
  //           })
  //         } else {
  //           result[yIndex].push({
  //             pos: [
  //               Config.plate.thickness + elementsWidths[xIndex] / 2,
  //               result[yIndex - 1][xIndex].pos[1] -
  //                 elementsHeights[yIndex] -
  //                 Config.plate.thickness / 2,
  //               depth / 2,
  //             ],
  //           })
  //         }
  //       } else {
  //         if (yIndex === 0) {
  //           result[yIndex].push({
  //             pos: [
  //               result[yIndex][xIndex - 1].pos[0] +
  //                 elementsWidths[xIndex - 1] / 2 +
  //                 Config.plate.thickness +
  //                 elementsWidths[xIndex] / 2,
  //               height - elementsHeights[yIndex] - Config.plate.thickness / 2,
  //               depth / 2,
  //             ],
  //           })
  //         } else {
  //           result[yIndex].push({
  //             pos: [
  //               result[yIndex][xIndex - 1].pos[0] +
  //                 elementsWidths[xIndex - 1] / 2 +
  //                 Config.plate.thickness +
  //                 elementsWidths[xIndex] / 2,
  //               result[yIndex - 1][xIndex].pos[1] -
  //                 elementsHeights[yIndex] -
  //                 Config.plate.thickness / 2,
  //               depth / 2,
  //             ],
  //           })
  //         }
  //       }
  //     }
  //   }
  //   return result
  // }, [elementsWidths, elementsHeights, elementsCount, height, depth])

  // useEffect(() => {
  //   const assets = []
  //   for (let yIndex = 0; yIndex < initShelfAssets.length; yIndex++) {
  //     for (let xIndex = 0; xIndex < initShelfAssets[yIndex].length; xIndex++) {
  //       assets.push({
  //         xIndex: xIndex,
  //         inDivider: false,
  //         d_xIndex: 0,
  //         d_yPos: 0,
  //         position: initShelfAssets[yIndex][xIndex].pos,
  //         scale: [47.4, 1.9, 57.7],
  //         type: Config.furnishing.type.shelf,
  //         selected: false,
  //         topAsset: "none",
  //         bottomAsset: "none",
  //         topVisible: true,
  //         bottomVisible: true,
  //         sideVisible: true,
  //       })
  //     }
  //   }
  //   dispatch(setFurnishingAssets(assets))
  // }, [initShelfAssets])

  // calculate total space for dragging
  const totalSpace = useMemo(() => {
    if (type === Config.furnishing.type.ledLighting) {
      return getLedSpace(elementsWidths, baseType, height, depth, ledAssets)
    } else if (type === Config.furnishing.type.door) {
      return getDoorSpace(
        elementsWidths,
        baseType,
        height,
        depth,
        furnishingAssets,
        doorAssets
      )
    } else {
      return getAvailableSpace(
        elementsWidths,
        baseType,
        height,
        depth,
        type,
        drawerHeight,
        drawerTopDistance,
        furnishingAssets,
        doorAssets
      )
    }
  }, [
    // elementsWidths,
    // baseType,
    // height,
    // depth,
    // type,
    // drawerHeight,
    // drawerTopDistance,
    // furnishingAssets,
    // ledAssets,
    // doorAssets,
    productDragging,
    assetDragging,
  ])

  useEffect(() => {
    setTotalSpace(totalSpace)
  }, [totalSpace])

  // update furnishing assets postion and scale based on the change of elements widths and depth
  useEffect(() => {
    if (furnishingAssets.length !== 0) {
      const updatedFurnishingAssets = updateFurnishing(
        elementsWidths,
        depth,
        furnishingAssets
      )
      setFurnishingAssets(updatedFurnishingAssets)
    }

    if (ledAssets.length !== 0) {
      const updatedLedAssets = updateLedAssets(
        elementsWidths,
        height,
        depth,
        baseType,
        ledAssets
      )
      setLedAssets(updatedLedAssets)
    }

    if (baseType !== originalBaseType) {
      // don't need to change position of assets, keep position same -> consider it later
      const updatedBaseTypeAssets = updateFurnishingBaseType(
        baseType,
        furnishingAssets
      )
      setFurnishingAssets(updatedBaseTypeAssets)
      setOriginalBaseType(baseType)
    }

    if (doorAssets.length !== 0) {
      const updatedDoorAssets = updateDoorAssets(
        elementsWidths,
        height,
        depth,
        doorAssets
      )
      setDoorAssets(updatedDoorAssets)
    }
  }, [elementsWidths, depth, height, baseType])

  useEffect(() => {
    const result = calculateFurnishingInfo({
      furnishingAssets,
      doorAssets,
      elementsWidths,
      depth,
    })
  }, [furnishingAssets, doorAssets])

  // raycasting target group ref
  const [spaceRef, setSpaceRef] = useState(null)

  return (
    <>
      {/* <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            visibleEdgeColor={0x0000ff}
            hiddenEdgeColor={0x000000}
            edgeStrength={100}
          />
        </EffectComposer> */}
      {furnishingAssets.map((asset, index) => (
        <Suspense fallback={null} key={index}>
          {asset.type === Config.furnishing.type.divider ? (
            <DividerComponent
              xIndex={asset.xIndex}
              inDivider={asset.inDivider}
              d_xIndex={asset.d_xIndex}
              d_yIndex={asset.d_yIndex}
              position={asset.position}
              initialScale={asset.scale}
              selected={asset.selected}
              spaceRef={spaceRef}
              topShelfVisible={asset.topShelfVisible}
              dividerLeftWidth={asset.dividerLeftWidth}
            />
          ) : asset.type === Config.furnishing.type.drawer ||
            asset.type === Config.furnishing.type.internalDrawer ? (
            <DrawerComponent
              xIndex={asset.xIndex}
              inDivider={asset.inDivider}
              d_xIndex={asset.d_xIndex}
              d_yIndex={asset.d_yIndex}
              type={asset.type}
              position={asset.position}
              initialScale={asset.scale}
              selected={asset.selected}
              spaceRef={spaceRef}
              topVisible={asset.topVisible}
              bottomVisible={asset.bottomVisible}
              sideVisible={asset.sideVisible}
              topShelfDistance={asset.topShelfDistance}
            />
          ) : (
            <FurnishingComponent
              xIndex={asset.xIndex}
              inDivider={asset.inDivider}
              d_xIndex={asset.d_xIndex}
              d_yIndex={asset.d_yIndex}
              type={asset.type}
              position={asset.position}
              initialScale={asset.scale}
              selected={asset.selected}
              spaceRef={spaceRef}
              topVisible={asset.topVisible}
              bottomVisible={asset.bottomVisible}
              sideVisible={asset.sideVisible}
              topShelfDistance={asset.topShelfDistance}
              topShelfVisible={asset.topShelfVisible}
              dividerLeftWidth={asset.dividerLeftWidth}
            />
          )}
        </Suspense>
      ))}
      {/* </Selection> */}

      {/* led lighting asets */}
      {ledAssets.map((asset, xIndex) => (
        <Suspense fallback={null} key={xIndex}>
          <LedLightingComponent
            xIndex={asset.xIndex}
            position={asset.position}
            initialScale={asset.scale}
            spaceRef={spaceRef}
          />
        </Suspense>
      ))}

      {/* door assets */}
      {doorAssets.map((asset, index) => (
        <Suspense fallback={null} key={index}>
          <DoorComponent
            initialXIndex={asset.xIndex}
            initialScale={asset.scale}
            position={asset.position}
            spaceRef={spaceRef}
            initialDoorType={asset.doorType}
            initialDoorCategory={asset.doorCatergory}
            initialTopAsset={asset.topAsset}
            initialBottomAsset={asset.bottomAsset}
            initialElementIndex={asset.elementIndex}
            selected={asset.selected}
            id={asset.id}
          />
        </Suspense>
      ))}

      {/* internal drawer side panes when we have sequential internal drawers */}
      {/* {internalDrawerSides.map((xAssets, xIndex) =>
        xAssets.map((asset, yIndex) => (
          <group key={xIndex * 10 + yIndex}>
            <RoundedBox
              castShadow
              args={[
                Config.furnishing.internalDrawer.panelWidth,
                asset.stopPosY -
                  asset.startPosY +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[1] /
                    2 +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.stopYIndex)
                  ].scale[1] /
                    2 +
                  Config.furnishing.internalDrawer.bottomShelfDistance,
                depth -
                  Config.plate.backThickness -
                  Config.plate.backIncident -
                  Config.furnishing.internalDrawer.frontInnerSpace,
              ]}
              position={[
                furnishingAssets[xIndex][
                  getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                ].position[0] -
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[0] /
                    2 -
                  Config.furnishing.internalDrawer.panelSpace -
                  Config.furnishing.internalDrawer.panelWidth / 2,
                (asset.startPosY -
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[1] /
                    2 +
                  asset.stopPosY +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.stopYIndex)
                  ].scale[1] /
                    2) /
                  2 +
                  -Config.furnishing.internalDrawer.bottomShelfDistance / 2,
                (depth -
                  Config.furnishing.internalDrawer.frontInnerSpace +
                  Config.plate.backIncident +
                  Config.plate.backThickness) /
                  2,
              ]}
              material={Config.furnishing.drawer.material}
            />
            <RoundedBox
              castShadow
              args={[
                Config.furnishing.internalDrawer.panelWidth,
                asset.stopPosY -
                  asset.startPosY +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[1] /
                    2 +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.stopYIndex)
                  ].scale[1] /
                    2 +
                  Config.furnishing.internalDrawer.bottomShelfDistance,
                depth -
                  Config.plate.backThickness -
                  Config.plate.backIncident -
                  Config.furnishing.internalDrawer.frontInnerSpace,
              ]}
              position={[
                furnishingAssets[xIndex][
                  getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                ].position[0] +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[0] /
                    2 +
                  Config.furnishing.internalDrawer.panelSpace +
                  Config.furnishing.internalDrawer.panelWidth / 2,
                (asset.startPosY -
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.startYIndex)
                  ].scale[1] /
                    2 +
                  asset.stopPosY +
                  furnishingAssets[xIndex][
                    getArrayIndex(furnishingAssets[xIndex], asset.stopYIndex)
                  ].scale[1] /
                    2) /
                  2 +
                  -Config.furnishing.internalDrawer.bottomShelfDistance / 2,
                (depth -
                  Config.furnishing.internalDrawer.frontInnerSpace +
                  Config.plate.backIncident +
                  Config.plate.backThickness) /
                  2,
              ]}
              material={Config.furnishing.drawer.material}
            />
          </group>
        ))
      )} */}

      <AvailableSpaceGroup depth={depth} setSpaceRef={setSpaceRef} />

      <DraggingObject spaceRef={spaceRef} />
    </>
  )
})

export default FurnishingGroup
