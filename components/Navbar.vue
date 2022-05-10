<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <div>
          <router-link to="/" class="navbar-brand"><img src="/images/logo.png"></router-link>
        </div>
        <div class="d-flex">
          <div class="nav-user">Halo, {{username}}</div>
          <div class="nav-logout" @click="logout">Keluar</div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        username: '',
      }
    },
    mounted(){
      this.username = localStorage.getItem('user');
    },
    methods:{
      logout(){
        localStorage.clear();
        this.$router.replace({
          path:"/login"
        })
      }
    }
  }

</script>
