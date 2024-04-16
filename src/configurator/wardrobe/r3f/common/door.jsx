/* eslint-disable react/no-unknown-property */
import { RoundedBox } from "@react-three/drei"
import React, { useMemo, useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"

import Config from "../../../config"
import CustomMaterial from "./customMaterial"
import useCornerStore from "../../zustand/cornerStore"

const Door = React.memo(function Door(props) {
  const {
    scale,
    visible,
    door_type,
    elementIndex,
    topAsset,
    bottomAsset,
    // door_category,
    // handle_type,
    withAnimation,
  } = props

  const width = useMemo(() => {
    let tempWidth = scale[0]
    if (elementIndex === Config.elementIndex.first) {
      tempWidth +=
        Config.plate.thickness - Config.furnishing.default.frontInterval
    } else {
      tempWidth += Config.furnishing.default.shelfOverlapping
    }

    if (elementIndex === Config.elementIndex.last) {
      tempWidth +=
        Config.plate.thickness - Config.furnishing.default.frontInterval
    } else {
      tempWidth += Config.furnishing.default.shelfOverlapping
    }

    return tempWidth
  }, [scale[0], elementIndex])

  const posX = useMemo(() => {
    let temp = 0
    if (elementIndex === Config.elementIndex.first) {
      temp -=
        (Config.plate.thickness - Config.furnishing.default.frontInterval) / 2
    } else {
      temp -= Config.furnishing.default.shelfOverlapping / 2
    }

    if (elementIndex === Config.elementIndex.last) {
      temp +=
        (Config.plate.thickness - Config.furnishing.default.frontInterval) / 2
    } else {
      temp += Config.furnishing.default.shelfOverlapping / 2
    }

    return temp
  }, [elementIndex])

  const height = useMemo(() => {
    let temp = scale[1]
    if (topAsset === "none") {
      temp += Config.plate.thickness - Config.furnishing.default.frontInterval
    } else {
      temp += Config.furnishing.default.shelfOverlapping
    }

    // stretch to the bottom
    if (bottomAsset === "none") {
      temp += Config.plate.thickness - Config.furnishing.default.frontInterval
    } else {
      temp += Config.furnishing.default.shelfOverlapping
    }

    return temp
  }, [scale[1], topAsset, bottomAsset])

  const posY = useMemo(() => {
    let temp = 0
    if (topAsset === "none") {
      temp +=
        (Config.plate.thickness - Config.furnishing.default.frontInterval) / 2
    } else {
      temp += Config.furnishing.default.shelfOverlapping / 2
    }

    // stretch to the bottom
    if (bottomAsset === "none") {
      temp -=
        (Config.plate.thickness - Config.furnishing.default.frontInterval) / 2
    } else {
      temp -= Config.furnishing.default.shelfOverlapping / 2
    }

    return temp
  }, [topAsset, bottomAsset])

  const leftRef = useRef()
  const rightRef = useRef()
  const leftDoubleRef = useRef()
  const rightDoubleRef = useRef()

  const openDoor = useCornerStore.use.openDoor()

  const { clock } = useThree()

  useEffect(() => {
    clock.start()
  }, [openDoor])

  useFrame(({ clock }) => {
    if (!withAnimation) return

    if (
      door_type === Config.door.type.revolving_left &&
      leftRef.current === undefined
    )
      return
    if (
      door_type === Config.door.type.revolving_right &&
      rightRef.current === undefined
    )
      return
    if (
      door_type === Config.door.type.revolving_double &&
      leftDoubleRef.current === undefined &&
      rightDoubleRef.current === undefined
    )
      return

    const elapsedTime = clock.getElapsedTime()
    if (openDoor) {
      switch (door_type) {
        case Config.door.type.revolving_left:
          if (leftRef.current.rotation.y > -(Math.PI / 2 - 0.1))
            leftRef.current.rotation.y = -elapsedTime
          else clock.stop()
          break
        case Config.door.type.revolving_right:
          if (rightRef.current.rotation.y < Math.PI / 2 - 0.1)
            rightRef.current.rotation.y = elapsedTime
          else clock.stop()
          break
        case Config.door.type.revolving_double:
          if (
            leftDoubleRef.current.rotation.y > -(Math.PI / 2 - 0.1) ||
            rightDoubleRef.current.rotation.y < Math.PI / 2 - 0.1
          ) {
            leftDoubleRef.current.rotation.y = -elapsedTime
            rightDoubleRef.current.rotation.y = elapsedTime
          } else clock.stop()
          break
        default:
          break
      }
    } else {
      switch (door_type) {
        case Config.door.type.revolving_left:
          if (leftRef.current.rotation.y < 0)
            leftRef.current.rotation.y = -(Math.PI / 2 - 0.1) + elapsedTime
          else {
            leftRef.current.rotation.y = 0
            clock.stop()
          }
          break
        case Config.door.type.revolving_right:
          if (rightRef.current.rotation.y > 0)
            rightRef.current.rotation.y = Math.PI / 2 - 0.1 - elapsedTime
          else {
            rightRef.current.rotation.y = 0
            clock.stop()
          }
          break
        case Config.door.type.revolving_double:
          if (
            leftDoubleRef.current.rotation.y < 0 ||
            rightDoubleRef.current.rotation.y > 0
          ) {
            leftDoubleRef.current.rotation.y =
              -(Math.PI / 2 - 0.1) + elapsedTime
            rightDoubleRef.current.rotation.y = Math.PI / 2 - 0.1 - elapsedTime
          } else {
            leftDoubleRef.current.rotation.y = 0
            rightDoubleRef.current.rotation.y = 0
            clock.stop()
          }
          break
        default:
          break
      }
    }
  })

  return (
    <group visible={visible}>
      {door_type === Config.door.type.revolving_left && (
        <group
          ref={leftRef}
          position={[posX - width / 2, posY, Config.plate.thickness / 2]}
        >
          <RoundedBox
            castShadow
            args={[width, height, scale[2]]}
            position={[width / 2, 0, -Config.plate.thickness / 2]}
            // material={Config.door.material}
          >
            <CustomMaterial category={Config.color.category.front} />
          </RoundedBox>
        </group>
      )}
      {door_type === Config.door.type.revolving_right && (
        <group
          ref={rightRef}
          position={[posX + width / 2, posY, Config.plate.thickness / 2]}
        >
          <RoundedBox
            castShadow
            args={[width, height, scale[2]]}
            position={[-width / 2, 0, -Config.plate.thickness / 2]}
            // material={Config.door.material}
          >
            <CustomMaterial category={Config.color.category.front} />
          </RoundedBox>
        </group>
      )}
      {door_type === Config.door.type.revolving_double && (
        <>
          {/* left part */}
          <group
            ref={leftDoubleRef}
            position={[
              posX -
                Config.furnishing.default.frontInterval -
                (width / 2 - Config.furnishing.default.frontInterval),
              posY,
              Config.plate.thickness / 2,
            ]}
          >
            <RoundedBox
              castShadow
              args={[
                width / 2 - Config.furnishing.default.frontInterval,
                height,
                scale[2],
              ]}
              position={[
                (width / 2 - Config.furnishing.default.frontInterval) / 2,
                0,
                -Config.plate.thickness / 2,
              ]}
              // material={Config.door.material}
            >
              <CustomMaterial category={Config.color.category.front} />
            </RoundedBox>
          </group>
          {/* right part */}
          <group
            ref={rightDoubleRef}
            position={[
              posX +
                Config.furnishing.default.frontInterval +
                (width / 2 - Config.furnishing.default.frontInterval),
              posY,
              Config.plate.thickness / 2,
            ]}
          >
            <RoundedBox
              castShadow
              args={[
                width / 2 - Config.furnishing.default.frontInterval,
                height,
                scale[2],
              ]}
              position={[
                -(width / 2 - Config.furnishing.default.frontInterval) / 2,
                0,
                -Config.plate.thickness / 2,
              ]}
              // material={Config.door.material}
            >
              <CustomMaterial category={Config.color.category.front} />
            </RoundedBox>
          </group>
        </>
      )}
    </group>
  )
})

export default Door
