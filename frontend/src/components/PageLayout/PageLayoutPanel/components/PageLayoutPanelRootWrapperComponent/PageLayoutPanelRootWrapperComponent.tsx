"use client";

import { Base } from "@/components/Base/Base";
import React from "react";
import { PageLayoutPanelContext } from "../../context";
import { type PageLayoutPanelRootWrapperComponentProps } from "./PageLayoutPanelRootWrapperComponent.types";
import styles from "./PageLayoutPanelRootWrapperComponent.module.scss";
import clsx from "clsx";

export function PageLayoutPanelRootWrapperComponent(
  props: PageLayoutPanelRootWrapperComponentProps
) {
  const { children, as = "div", className } = props;

  const { value, isRestored } = React.useContext(PageLayoutPanelContext);

  return (
    <Base
      as={as}
      display={{
        default: "flex",
        md: "grid",
      }}
      gridTemplateColumns={`${value.navigationSpace} ${value.contentSpace}`}
      position={{
        default: "static",
        md: "fixed",
      }}
      inset={0}
      flex={1}
      className={clsx(styles.pageLayoutPanelRootWrapperComponent, className, {
        [styles.pageLayoutPanelRootWrapperComponent__withTransition]: isRestored,
      })}
    >
      {children}
    </Base>
  );
}
