/* eslint-disable react/no-unknown-property */
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei"
// import { Perf } from "r3f-perf"
import WardrobeGroup from "./wardrobeGroup"
import Config from "../../config"
import { useThree } from "@react-three/fiber"
import React, { useEffect } from "react"
import useDimensionStore from "../zustand/dimensionStore"
import useCornerStore from "../zustand/cornerStore"

const R3F = React.memo(function R3F() {
  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const width = useDimensionStore.use.width()
  const isCornerView = useDimensionStore.use.isCornerView()

  const viewOption = useCornerStore.use.viewOption()

  const { camera, controls } = useThree()

  useEffect(() => {
    if (controls === null) return

    if (
      viewOption === Config.view.front ||
      viewOption === Config.view.dimension
    ) {
      camera.position.set(0, 0, 6)
      controls.target.set(0, 0, 0)
      controls.update()
      // controlRef.current.target.set(0, 0, 0)
    } else {
      if (isCornerView) {
        camera.position.set(
          -3.060997342564021,
          -0.10552836085033701,
          0.00024554701159093637
        )
        controls.target.set(
          -0.2879208479033169,
          -1.736773727929659,
          -0.041413008745240634
        )
        controls.update()
      } else {
        camera.position.set(0, 0, 6)
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }
  }, [viewOption, isCornerView])

  return (
    <>
      {/* <Perf position="top-right" /> */}

      {/* <color args={["ivory"]} attach="background" /> */}

      {/* <SoftShadows size={10} focus={0.3}/> */}

      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={30} />

      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 2}
        enableDamping={false}
        enabled={viewOption === Config.view.around}
        // enablePan={false}
        makeDefault
        // minDistance={3}
        maxDistance={8}
      />

      {/* <fog attach="fog" args={["white", 0, 40]} /> */}

      <directionalLight
        position={[-3, 3, 3]}
        intensity={4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        // shadow-camera-near={1}
        // shadow-camera-far={10}
        // shadow-camera-top={5}
        // shadow-camera-right={5}
        // shadow-camera-bottom={-5}
        // shadow-camera-left={-5}
      />

      {/* <pointLight
        position={[0, 0, depth / 100 + 1]}
        color="white"
        intensity={3}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={1000}
        shadow-camera-top={500}
        shadow-camera-right={500}
        shadow-camera-bottom={-500}
        shadow-camera-left={-500}
      /> */}

      {/* <ambientLight intensity={0.3} /> */}

      <WardrobeGroup
        position={[-width / 200, -height / 200, -depth / 200]}
        scale={[0.01, 0.01, 0.01]}
      />

      {/* <Environment preset="city"/> */}
      <Environment files="/images/env/small_empty_room_3_1k.hdr" />
    </>
  )
})

// eslint-disable-next-line react-refresh/only-export-components
export default R3F
