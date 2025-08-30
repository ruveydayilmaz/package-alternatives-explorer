import React from "react";
import { formatMarkdown } from "html-from-md";

export default function MDViewer({ readme }: { readme: string }) {
  const { html } = React.useMemo(
    () =>
      formatMarkdown(readme, {
        keepSections: ["features"],
        // excludeSections: ["license"],
        removeImages: false,
        useImgAltText: false,
        gfm: true,
      }),
    [readme]
  );

  return (
    <div
      className="markdown-body prose max-w-none prose-headings:mt-4 prose-p:my-3 prose-code:px-1 prose-code:py-0.5 prose-code:bg-gray-100 prose-pre:bg-gray-50 prose-pre:p-3 prose-pre:rounded-xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
