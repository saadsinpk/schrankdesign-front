import {
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
} from "@material-tailwind/react"
import { useState } from "react"

export default function Griffes() {
  const tab_data = [
    { label: "Push to open", value: "push_to_open" },
    { label: "Mit Griff", value: "griff" },
  ]

  const griff_tab_data = [
    { label: "Edelstahl", value: "stainless_steel" },
    { label: "Weiß", value: "white" },
    { label: "Schwarz", value: "black" },
  ]

  const [activeTab, setActiveTab] = useState(tab_data[0].value)
  const [griffActiveTab, setGriffActiveTab] = useState(griff_tab_data[0].value)

  return (
    <Tabs value={activeTab} className="py-4">
      <TabsHeader
        className="bg-[#BDBCBC] h-[35px] p-0 mx-10 bg-opacity-100 rounded-[10px] border-[1px] border-black"
        indicatorProps={{
          className: "bg-[#36695C] h-[33px] rounded-[10px]",
        }}
      >
        {tab_data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            className="text-[#FFF] text-[16px]"
            onClick={() => setActiveTab(value)}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody className="mt-5">
        <TabPanel key="push_to_open" value="push_to_open" className="py-1 px-0">
          <p className="text-[16px] text-black mt-5">
            Unsere Möbel sind standardmäßig mit einem Push-to-Open-System
            ausgestattet. Ein kurzes Antippen öffnet die Tür leicht, sodass sie
            greif- und öffnbar wird.
            <br />
            <br />
            Optional ist auch die Wahl eines Griffs möglich.
          </p>
        </TabPanel>
      </TabsBody>
    </Tabs>
  )
}
