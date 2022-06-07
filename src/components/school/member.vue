<template>
  <div>
    学员管理
    <div>
      <span>创建成员账号</span>
      <van-cell-group>
        <van-field v-model="username" label="账号" placeholder="请输入账号"/>
        <van-field v-model="password" label="密码" placeholder="请输入密码"/>
      </van-cell-group>
      <Button type="primary" @click="registerUser(1)">创建老师账号</Button>
      <Button type="primary" @click="registerUser(2)">创建学生账号</Button>
    </div>
    <div>
      <Row>
        <Col span="5">用户名</Col>
        <Col span="6">密码</Col>
        <Col span="4">操作</Col>
      </Row>
      <Row v-for="item in userlist" :key="item.name" class="row-item">
        <Col class="row-col" span="5">{{item.username}}</Col>
        <Col class="row-col" span="6">{{item.passwordtxt}}</Col>
        <Col class="row-col" sapn="3">
          <span style="text-align: center;">删除</span>
        </Col>
      </Row>
      <Page :total="total" :current="page" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>

//创建用户和获取用户的列表
import {createUser,getUserList} from "../../../utils/api";
import md5 from "js-md5"

export default {
name: "member",
  data(){
    return{
      username:"",
      password:"",
      page:1,
      total:0,
      userlist:[],
    }
  },
  mounted() {
    this.getUsers();
  },
  methods:{
    //创建账号
    registerUser(role){
      if(this.username && this.password){
        var option = {
          username:this.username,
          password:md5(this.password),
          passwordtxt:this.password,
          role:role
        }
        createUser(option).then(res => {
          console.log(res);
          this.userlist.push(res.data.data)
          this.total = this.userlist.length
        }).catch(err => {
          console.log(err);
        });
      }
    },
    getUsers(){
      getUserList({page:this.page,size:10}).then(res => {
        this.userlist = res.data.data.data
        this.total = res.data.data.count
        console.log("total:"+this.total);
      }).catch(err => {
        console.log(err)
      })
    },
    //分页查询数据
    changePage(page){
      this.page = page;
      getUserList({page:page,size:10}).then(res => {
        this.userlist = res.data.data.data
        this.total = res.data.data.count
        console.log("total:"+this.total);
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
