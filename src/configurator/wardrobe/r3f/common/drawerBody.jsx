import { RoundedBox } from "@react-three/drei"
import React from "react"

import Config from "../../../config"
import CustomMaterial from "./customMaterial"

const drawerConfig = Config.furnishing.drawer

const DrawerBody = React.memo(function DrawerBody(props) {
  const { scale } = props

  return (
    <group>
      {/* left Side */}
      <RoundedBox
        castShadow
        args={[drawerConfig.thickness, scale[1], scale[2]]}
        position={[-scale[0] / 2 + drawerConfig.thickness / 2, 0, 0]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* right Side */}
      <RoundedBox
        castShadow
        args={[drawerConfig.thickness, scale[1], scale[2]]}
        position={[scale[0] / 2 - drawerConfig.thickness / 2, 0, 0]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* bottom Side */}
      <RoundedBox
        castShadow
        args={[
          scale[0] -
            2 * (drawerConfig.thickness - drawerConfig.bottomOverlapping),
          drawerConfig.thickness,
          scale[2],
        ]}
        position={[
          0,
          -scale[1] / 2 +
            drawerConfig.bottomIncident +
            drawerConfig.thickness / 2,
          0,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* back Side */}
      <RoundedBox
        castShadow
        args={[
          scale[0] - 2 * drawerConfig.thickness,
          scale[1] -
            drawerConfig.bottomIncident -
            drawerConfig.thickness -
            drawerConfig.backHeightDifference,
          drawerConfig.thickness,
        ]}
        position={[
          0,
          (drawerConfig.bottomIncident +
            drawerConfig.thickness -
            drawerConfig.backHeightDifference) /
            2,
          -scale[2] / 2 + drawerConfig.thickness / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
    </group>
  )
})

export default DrawerBody
