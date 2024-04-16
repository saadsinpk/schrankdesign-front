import { RoundedBox } from "@react-three/drei"
import React from "react"

import DrawerBody from "./drawerBody"
import Config from "../../../config"
import CustomMaterial from "./customMaterial"

const drawerConfig = Config.furnishing.drawer
const internalDrawerConfig = Config.furnishing.internalDrawer

const InternalDrawr = React.memo(function InternalDrawer(props) {
  const { scale, depth, visible, topVisible, bottomVisible, sideVisible } =
    props

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group visible={visible}>
      <DrawerBody scale={scale} />

      {/* right panel */}
      <RoundedBox
        castShadow
        args={[
          internalDrawerConfig.panelWidth,
          scale[1] + internalDrawerConfig.bottomShelfDistance,
          depth -
            Config.plate.backThickness -
            Config.plate.backIncident -
            internalDrawerConfig.frontInnerSpace,
        ]}
        position={[
          scale[0] / 2 +
            internalDrawerConfig.panelSpace +
            internalDrawerConfig.panelWidth / 2,
          -internalDrawerConfig.bottomShelfDistance / 2,
          scale[2] / 2 +
            Config.plate.thickness -
            (depth -
              internalDrawerConfig.frontInnerSpace -
              Config.plate.backIncident -
              Config.plate.backThickness) /
              2,
        ]}
        visible={sideVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>

      {/* left panel */}
      <RoundedBox
        castShadow
        args={[
          internalDrawerConfig.panelWidth,
          scale[1] + internalDrawerConfig.bottomShelfDistance,
          depth -
            Config.plate.backThickness -
            Config.plate.backIncident -
            internalDrawerConfig.frontInnerSpace,
        ]}
        position={[
          -scale[0] / 2 -
            internalDrawerConfig.panelSpace -
            internalDrawerConfig.panelWidth / 2,
          -internalDrawerConfig.bottomShelfDistance / 2,
          scale[2] / 2 +
            Config.plate.thickness -
            (depth -
              internalDrawerConfig.frontInnerSpace -
              Config.plate.backIncident -
              Config.plate.backThickness) /
              2,
        ]}
        visible={sideVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>

      {/* top shelf */}
      <RoundedBox
        castShadow
        args={[
          scale[0] +
            internalDrawerConfig.panelSpace * 2 +
            internalDrawerConfig.panelWidth * 2,
          drawerConfig.shelfThickness1,
          depth -
            Config.plate.backThickness -
            Config.plate.backIncident -
            internalDrawerConfig.frontInnerSpace,
        ]}
        position={[
          0,
          scale[1] / 2 +
            internalDrawerConfig.topShelfDistance +
            drawerConfig.shelfThickness1 / 2,
          scale[2] / 2 +
            Config.plate.thickness -
            (depth -
              internalDrawerConfig.frontInnerSpace -
              Config.plate.backIncident -
              Config.plate.backThickness) /
              2,
        ]}
        visible={topVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>

      {/* bottom shelf */}
      <RoundedBox
        castShadow
        args={[
          scale[0] +
            internalDrawerConfig.panelSpace * 2 +
            internalDrawerConfig.panelWidth * 2,
          drawerConfig.shelfThickness1,
          depth -
            Config.plate.backThickness -
            Config.plate.backIncident -
            internalDrawerConfig.frontInnerSpace,
        ]}
        position={[
          0,
          -scale[1] / 2 -
            internalDrawerConfig.bottomShelfDistance -
            drawerConfig.shelfThickness1 / 2,
          scale[2] / 2 +
            Config.plate.thickness -
            (depth -
              internalDrawerConfig.frontInnerSpace -
              Config.plate.backIncident -
              Config.plate.backThickness) /
              2,
        ]}
        visible={bottomVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>

      {/* front plate */}
      <RoundedBox
        castShadow
        args={[
          scale[0] +
            internalDrawerConfig.panelSpace * 2 -
            internalDrawerConfig.frontSpace * 2,
          scale[1] +
            internalDrawerConfig.bottomShelfDistance -
            internalDrawerConfig.frontSpace,
          Config.plate.thickness,
        ]}
        position={[
          0,
          -(
            internalDrawerConfig.bottomShelfDistance -
            internalDrawerConfig.frontSpace
          ) / 2,
          scale[2] / 2 + Config.plate.thickness / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
    </group>
  )
})

export default InternalDrawr
