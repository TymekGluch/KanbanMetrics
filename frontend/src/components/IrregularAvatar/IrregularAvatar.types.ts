import { type ValueOf } from "@/types/valueOf";
import { type IRREGULAR_AVATAR_SIZES } from "./IrregularAvatar.constants";

export interface IrregularAvatarProps {
  /** Full name used to generate initials and as accessible label. */
  name: string;
  /** Hex color string (#RGB or #RRGGBB) used as the avatar background. */
  backgroundColor: string;
  /** Optional image source — overrides initials when provided. */
  src?: string;
  size?: ValueOf<typeof IRREGULAR_AVATAR_SIZES>;
  className?: string;
  contentClassName?: string;
}
