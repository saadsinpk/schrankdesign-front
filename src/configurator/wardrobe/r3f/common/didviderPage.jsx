import { RoundedBox } from "@react-three/drei"
import Config from "../../../config"
import CustomMaterial from "./customMaterial"
import React from "react"

const DividerPage = React.memo(function DividerPage(props) {
  const { scale, leftWidth, visible, topShelfVisible } = props

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group visible={visible}>
      <RoundedBox
        castShadow
        receiveShadow
        args={[
          Config.furnishing.divider.thickness,
          topShelfVisible === true
            ? scale[1] - Config.furnishing.divider.thickness
            : scale[1],
          scale[2],
        ]}
        position={[
          -scale[0] / 2 + leftWidth + Config.furnishing.divider.thickness / 2,
          topShelfVisible === true
            ? -Config.furnishing.divider.thickness / 2
            : 0,
          0,
        ]}
        // material={Config.plate.material}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* top shelf */}
      <RoundedBox
        castShadow
        receiveShadow
        args={[scale[0], Config.furnishing.divider.thickness, scale[2]]}
        position={[
          0,
          scale[1] / 2 - Config.furnishing.divider.thickness / 2,
          0,
        ]}
        // material={Config.plate.material}
        visible={topShelfVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
    </group>
  )
})

export default DividerPage
