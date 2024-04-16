import React from "react";
import SubLayout from "../../../Layouts/FurnitureConfigurator/SubLayout";
import Layout from "../../../Layouts/FurnitureConfigurator/Layout";

const tabs = [
  {
    to: "/dashboard/furniture-configurator/settings",
    label: "Settings",
  },
];

export default function Settings() {
  return (
    <Layout>
      <SubLayout tabs={tabs}>
        <div className="w-full flex flex-row justify-end mb-[20px]"></div>
      </SubLayout>
    </Layout>
  );
}
