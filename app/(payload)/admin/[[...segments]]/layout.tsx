import { RootLayout } from "@payloadcms/next/layouts";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import config from "@payload-config";
import { importMap } from "@/app/(payload)/admin/importMap.js";
import type { ServerFunctionClient } from "payload";
import React from "react";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
