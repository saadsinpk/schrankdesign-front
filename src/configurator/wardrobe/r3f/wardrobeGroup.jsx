/* eslint-disable react/no-unknown-property */
import ExteriorPlates from "./exteriorPlates"
import DimensionGroup from "./dimensionGroup"
import FurnishingGroup from "./furnishingGroup"
import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import React from "react"
import useDimensionStore from "../zustand/dimensionStore"

const WardrobeGroup = React.memo(function WardrobeGroup(props) {
  const width = useDimensionStore.use.width()

  const [floor_texture, floor_normalMap, floor_armMap] = useLoader(
    THREE.TextureLoader,
    [
      "/images/configurator/textures/floor/laminate_floor_02_diff_1k.jpg",
      "/images/configurator/textures/floor/laminate_floor_02_nor_gl_1k.png",
      "/images/configurator/textures/floor/laminate_floor_02_arm_1k.jpg",
    ]
  )

  floor_texture.wrapS = THREE.RepeatWrapping
  floor_texture.wrapT = THREE.RepeatWrapping
  floor_texture.repeat.set(10, 10)
  floor_texture.colorSpace = THREE.SRGBColorSpace

  floor_normalMap.wrapS = THREE.RepeatWrapping
  floor_normalMap.wrapT = THREE.RepeatWrapping
  floor_normalMap.repeat.set(10, 10)

  floor_armMap.wrapS = THREE.RepeatWrapping
  floor_armMap.wrapT = THREE.RepeatWrapping
  floor_armMap.repeat.set(10, 10)

  return (
    <group dispose={null} {...props} castShadow>
      {/* <Stage
        shadows={ { type: 'contact', opacity: 0.3, blur: 3 } }
        environment="night"
        preset="portrait"
        intensity={ 5 }
      > */}

      <ExteriorPlates />

      <DimensionGroup />

      <FurnishingGroup />

      {/* floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, -1, 365]}
        // castShadow
        receiveShadow
      >
        <planeGeometry args={[920, 730]} />
        <meshStandardMaterial
          map={floor_texture}
          normalMap={floor_normalMap}
          aoMap={floor_armMap}
          roughnessMap={floor_armMap}
          metalnessMap={floor_armMap}
        />
      </mesh>

      {/* wall back*/}
      <mesh position={[width / 2, 229, 0]} castShadow receiveShadow>
        <planeGeometry args={[920, 460]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>

      {/* wall right */}
      <mesh
        position={[width + 360, 229, 365]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[730, 460]} />
        <meshStandardMaterial color="lightgrey" side={THREE.BackSide} />
      </mesh>

      {/* wall left */}
      <mesh
        position={[-360, 229, 365]}
        rotation={[0, Math.PI / 2, 0]}
        // castShadow
        receiveShadow
      >
        <planeGeometry args={[730, 460]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>

      {/* </Stage> */}
    </group>
  )
})

export default WardrobeGroup
