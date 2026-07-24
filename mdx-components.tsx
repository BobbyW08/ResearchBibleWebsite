import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComparisonPanel } from "@/components/mdx/comparison-panel";
import { ConsensusMeter } from "@/components/mdx/consensus-meter";
import { ImageGallery } from "@/components/mdx/image-gallery";
import { VideoEmbed } from "@/components/mdx/video-embed";

/**
 * Shared MDX component registry for deep-dive pages. Add new reusable
 * templates here so every topic page can use them by tag name.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComparisonPanel,
    ConsensusMeter,
    ImageGallery,
    VideoEmbed,
    ...components,
  };
}
