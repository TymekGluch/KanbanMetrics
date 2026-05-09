import { type ValueOf } from "@/types/valueOf";
import { type IRREGULAR_AVATAR_SIZES } from "./IrregularAvatar.constants";

export interface IrregularAvatarProps {
  name: string;
  backgroundColor: string;
  src?: string;
  size?: ValueOf<typeof IRREGULAR_AVATAR_SIZES>;
  className?: string;
  contentClassName?: string;
}
