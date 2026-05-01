import React  from "react";
import { BASE_AS } from "./Base.constants";
import { BaseAs, BaseProps } from "./Base.types";
import { createStyleSheet } from "@/responsive/styles/createStylesHash";
import clsx from "clsx";
import { resolveProps } from "@/responsive/utils/resolveProps";

const getEmittedStyleHashes = React.cache(() => new Set<string>());

export function Base<T extends BaseAs = 'div'>(props: BaseProps<T>) {
  const { stylesProps, rest } = resolveProps(props)
  const { children, as: Component = BASE_AS.DIV as T, className, ...restProps } = rest;

  const ComponentToRender = Component as unknown as React.ElementType;
  const { hash: stylesHash, cssText } = createStyleSheet(stylesProps)
  const hasStyles = Boolean(cssText.length);
  const emittedStyleHashes = getEmittedStyleHashes();
  const shouldEmitStyleTag = hasStyles && !emittedStyleHashes.has(stylesHash);

  if (shouldEmitStyleTag) {
    emittedStyleHashes.add(stylesHash);
  }

  return (
    <React.Fragment>
      {shouldEmitStyleTag ? <style precedence={stylesHash}>{cssText}</style> : null}
      
      <ComponentToRender {...restProps} className={clsx(hasStyles ? stylesHash : undefined, className)}>
        {children}
      </ComponentToRender>  
    </React.Fragment>
  )
}