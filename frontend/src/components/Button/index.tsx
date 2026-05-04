import { AsAnchorComponent, AsButtonComponent, AsNextLinkComponent } from "./Button";
export { BUTTON_SIZES, BUTTON_VARIANTS } from "./button.constants";

const Button = {
  AsLink: AsNextLinkComponent,
  AsButton: AsButtonComponent,
  AsAnchor: AsAnchorComponent,
};

export default Button;
