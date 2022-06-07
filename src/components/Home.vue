<template>
  <div id="components-layout-demo-side">
    <v-layout class="layout">
      <v-sider class="left-menu" collapsible v-model="collapsed">
        <v-menu theme="dark" :mode="collapsed?'vertical':'inline'" :data="menu">
          <template slot-scope="{data}">
            <span style="font-size: 16px" @click="menuClick(data.path,data.name)">{{data.name}}</span>
          </template>
        </v-menu>
      </v-sider>
      <v-layout>
        <v-header :style="{background:'gray',padding:0}">
          <span style="float: left;margin-left: 20px;font-size: 16px;">{{selectMenu}}</span>
          <span style="float: right;font-size: 16px;">退出登录</span>
        </v-header>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-layout>

    </v-layout>

  </div>
</template>

<script>

export default {
  name: "Home",
  data(){
    return{
      collapsed:false,
      menu:[],
      selectMenu:""
    }
  },
  mounted() {
    if(this.$route.params != undefined && this.$route.params.user != undefined && this.$route.params.user.data != undefined && this.$route.params.user.data.menu != undefined){
      this.menu = this.$route.params.user.data.menu
    }
  },
  methods:{
    openTest(){
      this.$router.push("/Home/school/manager")
    },
    menuClick(path,name){
      this.selectMenu = name
      console.log(path)
      this.$router.push("/Home/"+path)
    }
  }
}
</script>

<style scoped>
.layout{
  height: 100%;
  background-color: white;
}
.left-menu{
  padding-top: 100px;
}
#components-layout-demo-side{
  height: 100%;
}
#components-layout-demo-side .logo {
  height: 32px;
  background: #333;
  border-radius: 6px;
  margin: 16px;
}
#components-layout-demo-side .ant-layout-sider-collapsed .anticon {
  font-size: 16px;
  margin-left: 8px;
}
#components-layout-demo-side .ant-layout-sider-collapsed .nav-text {
  display: none;
}
#components-layout-demo-side .ant-layout-sider-collapsed .ant-menu-submenu-vertical > .ant-menu-submenu-title:after {
  display: none;
}
</style>
