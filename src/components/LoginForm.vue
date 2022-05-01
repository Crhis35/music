<template >
  <div
    class="text-white text-center font-bold pb-5 mb-4"
    :class="log_alert_variant"
    v-show="log_show_alert"
  >
    {{ log_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
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
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
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
      />
      <ErrorMessage name="password" class="text-red-600 text-sm italic" />
    </div>
    <button
      type="submit"
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
      :disabled="log_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>
<script>
export default {
  name: 'LoginForm',
  methods: {
    async login(values) {
      this.log_in_submission = true;
      this.log_show_alert = true;

      try {
        await this.$store.dispatch('login', values);
      } catch (error) {
        this.log_in_submission = false;
        this.log_show_alert = true;
        this.log_alert_msg = error.message;
        this.log_alert_variant = 'bg-red-500';
        return;
      }

      this.log_alert_msg = 'Successfully logged in';
      this.log_alert_variant = 'bg-green-500';
      // window.location.reload();
    },
  },
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:3|max:32',
      },
      log_in_submission: false,
      log_show_alert: false,
      log_alert_variant: 'bg-blue-500',
      log_alert_msg: 'Please wait! Your account is being created.',
    };
  },
};
</script>
