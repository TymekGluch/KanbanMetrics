import { FieldsetComponent, FormComponent, InputComponent } from "./Form";

type FormAliasInterface = typeof FormComponent & {
  Fieldset: typeof FieldsetComponent;
  Input: typeof InputComponent;
};

const Form: FormAliasInterface = FormComponent as FormAliasInterface;
Form.Fieldset = FieldsetComponent;
Form.Input = InputComponent;

export default Form;
