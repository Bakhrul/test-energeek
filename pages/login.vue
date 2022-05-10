<template>
  <div>
    <div class="container">
      <div class="row d-flex justify-content-center align-items-center" style="min-height:100vh">
        <div class="col-xl-4 col-lg-4 col-md-7 d-flex justify-content-center flex-column align-items-center">
          <img src="/images/logo.png" class="mb-5" width="180px">
          <div class="login-box mb-5">
            <div class="title pb-5">Silahkan Masuk</div>
            <div class="text-danger text-center pb-3">{{message_error}}</div>
            <div class="form-group mb-3">
              <input v-model="single.username" type="text" class="form-control" placeholder="Username"
                :class="$v.single.username.$error ? 'error' : ''">
              <div v-if="$v.single.username.$error" class="text-danger pt-1 text-xs">
                Minimal karakter username adalah 6 karakter
              </div>
            </div>
            <div class="form-group mb-3">
              <input v-model="single.password" type="password" class="form-control" placeholder="Password"
                :class="$v.single.password.$error ? 'error' : ''">
              <div v-if="$v.single.password.$error" class="text-danger pt-1 text-xs">
                Minimal karakter password adalah 6 karakter
              </div>
            </div>
            <button class="btn btn-primary w-100 p-2" type="button" @click="login">Masuk</button>
          </div>
        </div>
      </div>
      <img src="/images/hero-left.png" class="hero-left">
      <img src="/images/hero-right.png" class="hero-right">
    </div>
  </div>
</template>

<script>
  import {
    required,
    minLength
  } from 'vuelidate/lib/validators'
  export default {
    middleware: 'guest',
    data() {
      return {
        message_error: '',
        single: {
          username: '',
          password: '',
        }
      }
    },
    validations: {
      single: {
        username: {
          required,
          minLength: minLength(6)
        },
        password: {
          required,
          minLength: minLength(6)
        },
      }

    },
    methods: {
      login() {
        this.$v.$touch();
        if (this.$v.$error) {
          return false;
        }
        this.message_error = '';

        if (this.single.username === 'energeek' && this.single.password === 'En3rg33k') {
          localStorage.setItem('user', 'Administrator')
          this.$router.replace({
            path: '/'
          })
        } else if (this.single.username === 'user_reg' && this.single.password === 'qwerty123456') {
          localStorage.setItem('user', 'User Reguler');
          this.$router.replace({
            path: '/'
          })
        } else {
          this.message_error = 'Username atau password salah!';
        }
      }
    }
  }

</script>
