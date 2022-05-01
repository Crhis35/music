<template >
  <div
    class="text-white text-center font-bold pb-5 mb-4"
    :class="reg_alert_variant"
    v-show="reg_show_alert"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="
          block
          w-full
          py-1.5
          px-3
          text-gray-800
          border border-gray-300
          transition
          duration-500
          focus:outline-none focus:border-black
          rounded
        "
        placeholder="Enter Name"
      />
      <ErrorMessage name="name" class="text-red-600 text-sm italic" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="
          block
          w-full
          py-1.5
          px-3
          text-gray-800
          border border-gray-300
          transition
          duration-500
          focus:outline-none focus:border-black
          rounded
        "
        placeholder="Enter Email"
      />
      <ErrorMessage name="email" class="text-red-600 text-sm italic" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        placeholder="Enter an age"
        class="
          block
          w-full
          py-1.5
          px-3
          text-gray-800
          border border-gray-300
          transition
          duration-500
          focus:outline-none focus:border-black
          rounded
        "
      />
      <ErrorMessage name="age" class="text-red-600 text-sm italic" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600 text-sm italic" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="
          block
          w-full
          py-1.5
          px-3
          text-gray-800
          border border-gray-300
          transition
          duration-500
          focus:outline-none focus:border-black
          rounded
        "
        placeholder="Confirm Password"
      />
      <ErrorMessage name="confirm_password" class="text-red-600 text-sm italic" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="
          block
          w-full
          py-1.5
          px-3
          text-gray-800
          border border-gray-300
          transition
          duration-500
          focus:outline-none focus:border-black
          rounded
        "
      >
        <option value="USA">USA</option>
        <option value="Colombia">Colombia</option>
        <option value="Germany">Germany</option>
      </vee-field>
      <ErrorMessage name="country" class="text-red-600 text-sm italic" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t class="inline-block" keypath="register.accept" tag="label">
        <a href="#"> {{ $t('register.TOS') }}</a>
      </i18n-t>
      <ErrorMessage name="tos" class="text-red-600 text-sm italic block" />
    </div>
    <button
      type="submit"
      :disabled="reg_in_submission"
      class="
        block
        w-full
        bg-purple-600
        text-white
        py-1.5
        px-3
        rounded
        transition
        hover:bg-purple-700
      "
    >
      Submit
    </button>
  </vee-form>
</template>
<script>
export default {
  name: 'RegisterForm',
  methods: {
    async register(values) {
      this.reg_in_submission = true;

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_show_alert = true;
        this.reg_alert_msg = error.message;
        this.reg_alert_variant = 'bg-red-500';
        return;
      }

      this.reg_show_alert = true;
      this.reg_alert_msg = 'Successfully registered';
      this.reg_alert_variant = 'bg-green-500';
      // window.location.reload();
    },
  },
  data() {
    return {
      schema: {
        name: 'required|alpha_spaces|min:3|max:100',
        email: 'required|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:6|max:100',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|excluded',
        tos: 'tos',
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.',
    };
  },
};
</script>
