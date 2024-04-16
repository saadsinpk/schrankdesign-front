import { useState } from "react"
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react"
import BodyColors from "./bodyColors"

import { ReactComponent as InfoIconS } from "../../../../assets/icons/info_icon_s.svg"
import { ReactComponent as TriangleLeft } from "../../../../assets/icons/triangle_left.svg"
import { ReactComponent as TriangleDown } from "../../../../assets/icons/triangle_down.svg"
import FrontColors from "./frontColors"

function Icon({ id, open }) {
  return (
    <div className="flex flex-row gap-3">
      {id === open && (
        <>
          <div className="flex flex-row items-center justify-center gap-2 bg-[#36695C] w-[118px] h-[30px] border border-black border-opacity-30 rounded-[5px] pt-[-3px] box-shadow-custom">
            <InfoIconS />
            <span className="font-semibold text-sm text-white">Ratgeber</span>
          </div>
          <TriangleLeft className="pt-1" />
        </>
      )}
      {id !== open && <TriangleDown className="pt-1" />}
    </div>
  )
}

export default function Extra() {
  const [open, setOpen] = useState("body_color")

  const handleOpen = (value) => setOpen(open === value ? "none" : value)

  return (
    <>
      <Accordion
        open={open === "body_color"}
        icon={<Icon id="body_color" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("body_color")}
          className={`${
            open === "body_color"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Korpus Farbe
        </AccordionHeader>
        <AccordionBody className="px-[21px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-405px)]">
          <BodyColors />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "front_color"}
        icon={<Icon id="front_color" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("front_color")}
          className={`${
            open === "front_color"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Front Farbe
        </AccordionHeader>
        <AccordionBody className="px-[21px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-405px)]">
          <FrontColors />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "individual_color"}
        icon={<Icon id="individual_color" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("individual_color")}
          className={`${
            open === "individual_color"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Individuelle Farbe
        </AccordionHeader>
        <AccordionBody className="px-[21px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-405px)]">
          We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams.
        </AccordionBody>
      </Accordion>
    </>
  )
}
