<template>
  <div id="components-layout-demo-side">
    Test
    <button v-on:click="openTest">打开嵌套布局</button>
    <v-layout>
      <v-sider>
        <v-menu theme="dark" :mode="collapsed?'vertical':'inline'" :data="menu">
          <template slot-scope="{data}">
            <span style="font-size: 16px" @click="menuClick(data.path,data.name)">{{data.name}}</span>
          </template>
        </v-menu>
      </v-sider>
      <v-layout>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-layout>

    </v-layout>

  </div>
</template>

<script>

import PopWin from './widget/WidgetPopWin'

export default {
name: "Test",
  components:{

  },
  data(){
    return{
      collapsed:false,
      menu:[]
    }
  },
  mounted() {
    this.menu = this.$route.params.user.data.menu
  },
  methods:{
    openTest(){
      this.$router.push("Test/school/createschool")
    },
    menuClick(path,name){
      this.selectMenu = name
      console.log(path)
      this.$router.push("/Test/school/manager")
    }
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
