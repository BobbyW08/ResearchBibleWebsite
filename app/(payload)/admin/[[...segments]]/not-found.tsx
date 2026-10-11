import { NotFoundPage } from "@payloadcms/next/views";
import config from "@payload-config";
import { importMap } from "@/app/(payload)/admin/importMap.js";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default function NotFound({ params, searchParams }: Partial<Args> = {}) {
  return NotFoundPage({
    config,
    importMap,
    params: params ?? Promise.resolve({ segments: [] }),
    searchParams: searchParams ?? Promise.resolve({}),
  });
}
