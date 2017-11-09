import EmailWidget from './EmailWidget';
import HiddenWidget from './HiddenWidget';
import PasswordWidget from './PasswordWidget';
import TextareaWidget from './TextareaWidget';
import TextWidget from './TextWidget';
import UpDownWidget from './UpDownWidget';
import URLWidget from './URLWidget';
import RadioWidget from './RadioWidget';
import CheckboxWidget from './CheckboxWidget';
import CheckboxesWidget from './CheckboxesWidget';
import SelectWidget from './SelectWidget';

export default {
  PasswordWidget,
  UpDownWidget,
  integer: UpDownWidget,
  uri: URLWidget,
  TextWidget,
  RadioWidget,
  CheckboxWidget,
  CheckboxesWidget,
  EmailWidget,
  TextareaWidget,
  HiddenWidget,
  SelectWidget,
};
