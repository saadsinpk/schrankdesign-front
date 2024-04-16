/* eslint-disable react/no-unknown-property */
import { Cylinder } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { RoundedBoxGeometry } from "three-stdlib"
import { Geometry, Base, Subtraction } from "@react-three/csg"
import FittingPanelGroup from "./fittingPanelGroup"
import React, { useMemo, useEffect } from "react"

extend({ RoundedBoxGeometry })

import Config from "../../config"
import Plate from "./common/Plate"
import { calculatePlatesInfo } from "../utils/getInfo"
import CustomMaterial from "./common/customMaterial"
import EWidthControl from "./eWidthControl"
import useDimensionStore from "../zustand/dimensionStore"
import useFurnishingStore from "../zustand/furnishingStore"

const ExteriorPlates = React.memo(function ExteriorPlates() {
  const width = useDimensionStore.use.width()
  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const elementsWidths = useDimensionStore.use.elementsWidths()
  const baseType = useDimensionStore.use.baseType()
  const enableCutout = useDimensionStore.use.enableCutout()
  const cutoutDepth = useDimensionStore.use.cutoutDepth()
  const cutoutHeight = useDimensionStore.use.cutoutHeight()

  const setPlatesInfo = useFurnishingStore.use.setPlatesInfo()

  // pos and size of left, right, middleside panels
  const sidesPanelInfo = useMemo(() => {
    const result = []

    for (let index = 0; index < elementsWidths.length + 1; index++) {
      if (baseType == Config.baseType.panel) {
        // floor base panel
        if (index == 0) {
          // left first panel
          result.push({
            pos: [Config.plate.thickness / 2, height / 2, depth / 2],
            size: [Config.plate.thickness, height, depth],
          })
        } else if (index < elementsWidths.length) {
          // middle panels
          result.push({
            pos: [
              result[index - 1].pos[0] +
                elementsWidths[index - 1] +
                Config.plate.thickness,
              height / 2 +
                Config.plate.plinthHeight / 2 +
                Config.plate.thickness / 2,
              depth / 2,
            ],
            size: [
              Config.plate.thickness,
              height - Config.plate.plinthHeight - Config.plate.thickness,
              depth,
            ],
          })
        } else {
          // right last panel
          result.push({
            pos: [
              result[index - 1].pos[0] +
                elementsWidths[index - 1] +
                Config.plate.thickness,
              height / 2,
              depth / 2,
            ],
            size: [Config.plate.thickness, height, depth],
          })
        }
      } else if (baseType == Config.baseType.gliders) {
        // floor gliders
        if (index == 0) {
          // left first panel
          result.push({
            pos: [
              Config.plate.thickness / 2,
              height / 2 + Config.glider.height / 2,
              depth / 2,
            ],
            size: [
              Config.plate.thickness,
              height - Config.glider.height,
              depth,
            ],
          })
        } else if (index < elementsWidths.length) {
          // middle panels
          result.push({
            pos: [
              result[index - 1].pos[0] +
                elementsWidths[index - 1] +
                Config.plate.thickness,
              height / 2 +
                Config.glider.height / 2 +
                Config.plate.thickness / 2,
              depth / 2,
            ],
            size: [
              Config.plate.thickness,
              height - Config.glider.height - Config.plate.thickness,
              depth,
            ],
          })
        } else {
          // right last panel
          result.push({
            pos: [
              result[index - 1].pos[0] +
                elementsWidths[index - 1] +
                Config.plate.thickness,
              height / 2 + Config.glider.height / 2,
              depth / 2,
            ],
            size: [
              Config.plate.thickness,
              height - Config.glider.height,
              depth,
            ],
          })
        }
      }
    }

    return result
  }, [baseType, height, depth, elementsWidths])

  // pos and size of above floors
  const aboveFloorInfo = useMemo(() => {
    const result = []
    for (let index = 0; index < elementsWidths.length; index++) {
      if (index == 0) {
        result.push({
          size: [elementsWidths[index], Config.plate.thickness, depth],
          pos: [
            Config.plate.thickness + elementsWidths[index] / 2,
            height - Config.plate.thickness / 2,
            depth / 2,
          ],
        })
      } else {
        result.push({
          size: [elementsWidths[index], Config.plate.thickness, depth],
          pos: [
            result[index - 1].pos[0] +
              elementsWidths[index - 1] / 2 +
              Config.plate.thickness +
              elementsWidths[index] / 2,
            height - Config.plate.thickness / 2,
            depth / 2,
          ],
        })
      }
    }

    return result
  }, [elementsWidths, height, depth])

  // pos and size of back panels
  const backPanelInfo = useMemo(() => {
    const result = []
    for (let index = 0; index < elementsWidths.length; index++) {
      if (index == 0) {
        result.push({
          size: [
            elementsWidths[index] + Config.plate.backOverlapping * 2,
            height -
              (baseType == Config.baseType.panel
                ? Config.plate.plinthHeight
                : Config.glider.height) -
              Config.plate.thickness * 2 +
              Config.plate.backOverlapping * 2,
            Config.plate.backThickness,
          ],
          pos: [
            Config.plate.thickness + elementsWidths[0] / 2,
            height / 2 +
              (baseType == Config.baseType.panel
                ? Config.plate.plinthHeight
                : Config.glider.height) /
                2,
            Config.plate.backIncident + Config.plate.backThickness / 2,
          ],
        })
      } else {
        result.push({
          size: [
            elementsWidths[index] + Config.plate.backOverlapping * 2,
            height -
              (baseType == Config.baseType.panel
                ? Config.plate.plinthHeight
                : Config.glider.height) -
              Config.plate.thickness * 2 +
              Config.plate.backOverlapping * 2,
            Config.plate.backThickness,
          ],
          pos: [
            aboveFloorInfo[index - 1].pos[0] +
              elementsWidths[index - 1] / 2 +
              Config.plate.thickness +
              elementsWidths[index] / 2,
            height / 2 +
              (baseType == Config.baseType.panel
                ? Config.plate.plinthHeight
                : Config.glider.height) /
                2,
            Config.plate.backIncident + Config.plate.backThickness / 2,
          ],
        })
      }
    }

    return result
  })

  useEffect(() => {
    const calculatedPlatesInfo = calculatePlatesInfo(
      sidesPanelInfo,
      aboveFloorInfo,
      backPanelInfo,
      enableCutout,
      cutoutDepth,
      cutoutHeight,
      width,
      depth
    )
    setPlatesInfo(calculatedPlatesInfo)
  }, [sidesPanelInfo, aboveFloorInfo, backPanelInfo, enableCutout, cutoutDepth, cutoutHeight, width, depth])

  const glidersPosXInfo = useMemo(() => {
    const result = []

    let prevXPos = 0
    for (let index = 0; index < elementsWidths.length; index++) {
      if (index == 0) {
        // left glider
        result.push(Config.plate.thickness + Config.glider.radius)
        prevXPos =
          Config.plate.thickness +
          elementsWidths[0] +
          Config.plate.thickness / 2

        // second glider
        result.push(prevXPos)

        // center glider
        if (elementsWidths[0] > Config.plate.maxDoorLength) {
          result.push(Config.plate.thickness + elementsWidths[0] / 2)
        }
      } else if (index == elementsWidths.length - 1) {
        // right glider
        result.push(width - Config.plate.thickness - Config.glider.radius)

        if (elementsWidths[index] > Config.plate.maxDoorLength) {
          result.push(
            width - Config.plate.thickness - elementsWidths[index] / 2
          )
        }
      } else {
        // need center glider if we have double door
        if (elementsWidths[index] > Config.plate.maxDoorLength) {
          result.push(
            prevXPos + Config.plate.thickness / 2 + elementsWidths[index] / 2
          )
        }

        // middlesides glider
        prevXPos += elementsWidths[index] + Config.plate.thickness
        result.push(prevXPos)
      }
    }

    return result
  })

  return (
    <>
      {
        // sidespanel
        sidesPanelInfo.map((info, index) => {
          if (index > 0 && index < elementsWidths.length) {
            return <Plate key={index} args={info.size} position={info.pos} />
          } else {
            return (
              <mesh key={index} castShadow receiveShadow>
                <CustomMaterial category={Config.color.category.body} />
                <Geometry>
                  <Base position={info.pos}>
                    <roundedBoxGeometry
                      args={[
                        info.size[0],
                        info.size[1],
                        info.size[2],
                        4,
                        Config.plate.radius,
                      ]}
                    />
                  </Base>
                  <Subtraction
                    position={[
                      info.pos[0],
                      cutoutHeight / 2 - 0.25,
                      cutoutDepth / 2 - 0.25,
                    ]}
                  >
                    <boxGeometry
                      args={
                        enableCutout
                          ? [Config.plate.thickness, cutoutHeight, cutoutDepth]
                          : [0, 0, 0]
                      }
                    />
                  </Subtraction>
                </Geometry>
              </mesh>
            )
          }
        })
      }

      {
        // above floor
        aboveFloorInfo.map((info, index) => (
          <Plate key={index} args={info.size} position={info.pos} />
        ))
      }

      {
        // back panel
        backPanelInfo.map((info, index) => (
          <Plate key={index} args={info.size} position={info.pos} />
        ))
      }

      {/* below floor */}
      <Plate
        args={[
          width - Config.plate.thickness * 2,
          Config.plate.thickness,
          depth,
        ]}
        position={[
          width / 2,
          (baseType == Config.baseType.panel
            ? Config.plate.plinthHeight
            : Config.glider.height) +
            Config.plate.thickness / 2,
          depth / 2,
        ]}
      />

      {/* plinth */}
      <Plate
        args={[
          width - Config.plate.thickness * 2,
          Config.plate.plinthHeight,
          Config.plate.thickness,
        ]}
        position={[
          width / 2,
          Config.plate.plinthHeight / 2,
          depth - Config.plate.thickness / 2 - Config.plate.plinthIncident,
        ]}
        visible={baseType === Config.baseType.panel}
      />

      {/* gliders */}
      {glidersPosXInfo.map((info, index) => (
        <group key={index} visible={baseType === Config.baseType.gliders}>
          <Cylinder
            args={[
              Config.glider.radius,
              Config.glider.radius,
              Config.glider.height,
            ]}
            position={[
              info,
              Config.glider.height / 2,
              Config.plate.thickness + Config.glider.radius,
            ]}
            material={Config.glider.material}
          />
          <Cylinder
            args={[
              Config.glider.radius,
              Config.glider.radius,
              Config.glider.height,
            ]}
            position={[
              info,
              Config.glider.height / 2,
              depth - Config.plate.thickness - Config.glider.radius,
            ]}
            material={Config.glider.material}
          />
        </group>
      ))}

      <FittingPanelGroup />

      <EWidthControl />
    </>
  )
})

export default ExteriorPlates
