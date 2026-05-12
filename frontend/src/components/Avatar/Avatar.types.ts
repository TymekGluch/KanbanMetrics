import { type ValueOf } from "@/types/valueOf";
import {
  type AVATAR_COLORS,
  type AVATAR_SHAPES,
  type AVATAR_SIZES,
  type AVATAR_STATUS_COLORS,
} from "./Avatar.constants";
import { type ReactNode } from "react";

type ResponsiveDimensionValue = number | string;

export interface ResponsiveDimension {
  base: ResponsiveDimensionValue;
  sm?: ResponsiveDimensionValue;
  md?: ResponsiveDimensionValue;
  lg?: ResponsiveDimensionValue;
}

export interface AvatarProps {
  name: string;
  icon?: ReactNode;
  src?: string;
  alt?: string;
  shape?: ValueOf<typeof AVATAR_SHAPES>;
  size?: ValueOf<typeof AVATAR_SIZES>;
  avatarColor?: ValueOf<typeof AVATAR_COLORS>;
  width?: ResponsiveDimensionValue | ResponsiveDimension;
  height?: ResponsiveDimensionValue | ResponsiveDimension;
  showContrastingBackground?: boolean;
  statusColor?: ValueOf<typeof AVATAR_STATUS_COLORS>;
  withStatus?: boolean;
  className?: string;
  contentClassName?: string;
}
