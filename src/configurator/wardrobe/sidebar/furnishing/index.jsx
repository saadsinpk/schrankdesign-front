import { useState } from "react"
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react"
import Floors from "./floors"
import Drawers from "./drawers"
import Brackets from "./brackets"
import Extras from "./extras"
import Doors from "./doors"

import { ReactComponent as InfoIconS } from "../../../../assets/icons/info_icon_s.svg"
import { ReactComponent as TriangleLeft } from "../../../../assets/icons/triangle_left.svg"
import { ReactComponent as TriangleDown } from "../../../../assets/icons/triangle_down.svg"
import Griffes from "./griffes"

function Icon({ id, open }) {
  return (
    <div className="flex flex-row gap-3">
      {id === open && (
        <>
          <div className="flex flex-row items-center justify-center gap-2 bg-[#36695C] w-[118px] h-[30px] border border-black border-opacity-30 rounded-[5px] pt-[-3px] box-shadow-custom">
            <InfoIconS />
            <span className="font-semibold text-sm text-white">
              Ratgeber
            </span>
          </div>
          <TriangleLeft className="pt-1" />
        </>
      )}
      {id !== open && <TriangleDown className="pt-1" />}
    </div>
  )
}

export default function Furnishing() {
  const [open, setOpen] = useState("floors")

  const handleOpen = (value) => setOpen(open === value ? "none" : value)

  return (
    <>
      <Accordion
        open={open === "floors"}
        icon={<Icon id="floors" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("floors")}
          className={`${
            open === "floors"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Fächer & Böden
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Floors />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "drawers"}
        icon={<Icon id="drawers" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("drawers")}
          className={`${
            open === "drawers"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Schubladen
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Drawers />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "brackets"}
        icon={<Icon id="brackets" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("brackets")}
          className={`${
            open === "brackets"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Kleiderstangen
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Brackets />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === "doors"} icon={<Icon id="doors" open={open} />}>
        <AccordionHeader
          onClick={() => handleOpen("doors")}
          className={`${
            open === "doors"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Türen
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Doors />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "extras"}
        icon={<Icon id="extras" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("extras")}
          className={`${
            open === "extras"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Extras
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Extras />
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === "handle"}
        icon={<Icon id="handle" open={open} />}
      >
        <AccordionHeader
          onClick={() => handleOpen("handle")}
          className={`${
            open === "handle"
              ? "bg-[#577E60] text-[#FFF]"
              : "bg-[#E5E5E5] text-[#456779]"
          } py-2 pl-6 pr-4 border-b-0 border-t-[1px] border-t-[#000000]`}
        >
          Griffe
        </AccordionHeader>
        <AccordionBody className="px-[28px] custom-scrollbar overflow-y-auto max-h-[calc(100vh-540px)]">
          <Griffes />
        </AccordionBody>
      </Accordion>
    </>
  )
}
