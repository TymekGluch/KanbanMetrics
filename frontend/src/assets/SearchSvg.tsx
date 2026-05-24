import * as React from "react";

export function SearchSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={7.5} cy={7.5} r={5.25} stroke="currentColor" strokeWidth={1.5} />
      <path d="M13 13L11 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
