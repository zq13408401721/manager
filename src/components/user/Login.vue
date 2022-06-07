<template>
  <div>
    <v-form direction="horizontal" class="box">
      <v-form-item label="用户名" :label-col="labelCol" :wrapper-col="wrapperCol">
        <v-input type="text" placeholder="用户名" v-model="username"></v-input>
      </v-form-item>
      <v-form-item label="密码" :label-col="labelCol" :wrapper-col="wrapperCol" required>
        <v-input type="password" placeholder="密码" v-model="pw"></v-input>
      </v-form-item>
      <v-form-item style="margin-top:24px;" :wrapper-col="{span:20}">
        <v-button type="primary" v-on:click="submit">确定</v-button>
      </v-form-item>
    </v-form>
  </div>
</template>

<script>
import {login} from "../../../utils/api"
import {setToken,setSchoolId} from "../../../utils/token"
import md5 from "js-md5"
export default {
  name: "Login.vue",
  data:()=>({
    username:"",
    pw:"",
    labelCol:{
      span:10
    },
    wrapperCol:{
      span:12
    }
  }),
  methods:{
    submit:function (){
      if(this.username == undefined || this.pw == undefined){
        return;
      }
      //this.$router.push({path:'/index',props:{username:this.username,password:this.password}})
      let param = {
        username:this.username,
        password:md5(this.pw)
      }
      console.log("param:"+param);
      /**
       * 登录
       */
      login(param).then(res => {
        console.log(res)
        //登录成功以后根据返回的用户信息跳转页面 带用户信息一起跳转
        if(res.data.data.code == 200){
          setToken(res.data.data.data.userinfo.token)
          setSchoolId(res.data.data.data.userinfo.school_id)
          this.$router.push({name:'/Home',params:{user:res.data.data}})
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

}
</script>

<style scoped>
  .box {
    text-align: center;
    border-right: 20px;
    width: 400px;
    height: 250px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
