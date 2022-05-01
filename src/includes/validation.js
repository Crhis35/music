import {
  max,
  min,
  required,
  alpha_spaces as alphaSpaces,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
  email,
} from '@vee-validate/rules';
import {
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
  configure,
} from 'vee-validate';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_exclude', excluded);
    defineRule('email', email);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field  ${ctx.field}is required`,
          min: `This field ${ctx.field} must be at least ${ctx.rule.params[0]} characters`,
          max: `This field ${ctx.field} must be at most ${ctx.rule.params[1]} characters`,
          alpha_spaces: `This field  ${ctx.field}must contain only letters and spaces`,
          min_value: `This field  ${ctx.field}must be at least {{ min }} characters`,
          max_value: `This field  ${ctx.field}must be at most {{ max }} characters`,
          passwords_mismatch: `This field  ${ctx.field}must match the {{ field }} field`,
          excluded: `This field  ${ctx.field}must not match the {{ field }} field`,
          email: `This field  ${ctx.field}must be a valid email`,
          country_exclude:
            'Due to the high number of users in this country, we are unable to process your request at this time. Please try again later.',
          tos: 'You must agree to the terms of service',
        };
        const message = messages[ctx.rule.name] || `This field ${ctx.field} is invalid`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
