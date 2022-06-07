<template>
  <div>
    <v-layout>
      <v-sider collapsible v-model="collapsed">
        <div class="logo"></div>
        <!--<v-menu theme="dark" :mode="collapsed?'vertical':'inline'" :data="menuData3">
          <template slot-scope="{data}">
            <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
            <span :class="{'nav-text':data.icon}">{{data.name}}</span>
          </template>
          <template slot-scope="{data}" slot="sub">
            <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
            <span class="nav-text">{{data.name}}</span>
          </template>
        </v-menu>-->
        <v-menu theme="dark" :mode="collapsed?'vertical':'inline'" :data="menu">
          <template slot-scope="{data}">
            <span style="font-size: 16px" @click="menuClick(data.path,data.name)">{{data.name}}</span>
          </template>
        </v-menu>
      </v-sider>
      <v-layout>
        <!--<v-header :style="{background:'#ff0',padding:0}">
          <span style="float: left;margin-left: 20px;font-size: 16px;">{{selectMenu}}</span>
          <span style="float: right;font-size: 16px;">退出登录</span>
        </v-header>-->
        <v-content>
          <v-breadcrumb-item>Home</v-breadcrumb-item>
          <router-view></router-view>
        </v-content>

        <!--<v-header :style="{ background: '#fff', padding: 0 }"></v-header>
        <v-content :style="{ padding: '0 50px' }">
          <v-breadcrumb :style="{ margin: '12px 0' }">
            <v-breadcrumb-item>Home</v-breadcrumb-item>
            <v-breadcrumb-item href="">List</v-breadcrumb-item>
            <v-breadcrumb-item href="">App</v-breadcrumb-item>
          </v-breadcrumb>
          <div style="padding: 24px; background: #fff; min-height: 360px;">Content</div>
        </v-content>
        <v-footer :style="{ textAlign: 'center' }">
          Ant Design ©2021 Created by Ant UED
        </v-footer>-->
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      collapsed: false,
      menu:[],
      selectMenu:"",

    }
  },
  mounted() {
    this.word = this.$route.params
    this.menu = this.$route.params.user.data.menu
    console.log(this.word)
  },
  methods:{
    menuClick(path,name){
      this.selectMenu = name
      console.log(path)
      this.$router.push("/index/school/manager")
    }
  },
  beforeRouteUpdate(to,from,next){
    console.log("suaxin"+to+" "+from + next);
  }
}
</script>

<style scoped>
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
