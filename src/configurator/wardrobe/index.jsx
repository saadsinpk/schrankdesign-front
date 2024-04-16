import { useCallback } from "react"
import * as THREE from "three"

import Header from "../../Layouts/AppLayout/Header"
import Sidebar from "./sidebar"
import { Canvas } from "@react-three/fiber"
import R3F from "./r3f"
import Corner from "./corner"
import Footer from "./footer"
import Advisor from "./corner/advisor"
import ViewOption from "./corner/viewOption"
import RatingReview from "./corner/ratingReview"

import useDndStore from "./zustand/dndStore"

export default function Wardrobe() {
  const setProductDragging = useDndStore.use.setProductDragging()

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  })

  const onDrop = useCallback((event) => {
    event.preventDefault()
  })

  const onDragEnd = useCallback((event) => {
    event.preventDefault()
    setProductDragging(false)
  })

  return (
    <div className="flex flex-col h-screen" onDragEnd={onDragEnd}>
      <Header />
      <div className="flex-1 flex relative">
        <Sidebar />
        <Canvas
          onDragOver={onDragOver}
          onDrop={onDrop}
          shadows={true}
          gl={{
            antialias: true,
            // toneMapping: THREE.ACESFilmicToneMapping,
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 2.5,
          }}

          // frameloop="demand"
        >
          <R3F />
        </Canvas>
        <Advisor />
        <RatingReview />
        <ViewOption />
      </div>
      <Corner />
      <Footer />
    </div>
  )
}
