<template>
  <div>
    <van-tabs @click="clickTabs">
      <van-tab title="创建学校">
        <Row>
          <Col span="8">
            <van-cell-group>
              <van-field v-model="schoolname" label="学校名" placeholder="请输入学校名"/>
            </van-cell-group>
          </Col>
          <Col span="6">
            <Button type="primary" @click="createSchool()">创建学校</Button>
          </Col>
        </Row>
        <Row>
          <Col span="5">学校名</Col>
          <Col span="6">创建时间</Col>
          <Col span="6">操作</Col><!--删除  排序-->
        </Row>
        <Row v-for="item in schoolList" :key="item.name" class="row-item">
          <Col class="row-col" span="5">{{item.name}}</Col>
          <Col class="row-col" span="6">{{item.time}}</Col>
          <Col class="row-col" sapn="6">
            <Row>
              <span style="text-align: center;" @click="delSchool(item)">删除</span>
              <span style="text-align: center;margin-left: 30px;">排序</span>
            </Row>
          </Col>
        </Row>
        <Page :total="total" :current="page" simple onchange="changePage"></Page>
      </van-tab>
      <van-tab title="创建学校管理员">
        <Row>
          <span span="6">{{selectSchool}}</span>
          <DropdownMenu>
            <DropdownItem>school1</DropdownItem>
            <DropdownItem>school1</DropdownItem>
            <DropdownItem>school1</DropdownItem>
            <DropdownItem>school1</DropdownItem>
            <DropdownItem>school1</DropdownItem>
            <DropdownItem>school1</DropdownItem>
          </DropdownMenu>
        </Row>
        <Row>
          <Form :model="formItem">
              <FormItem label="选择学校">
                <Select v-for="school in formItem.schoolList" v-bind:key="school.name">
                  <Option value="school.id">{{school.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="管理员账号">
                <Input v-model="formItem.input" placeholder="学校管理员账号"></Input>
              </FormItem>
              <FormItem label="管理员密码">
                <Input v-model="formItem.input" placeholder="管理员密码"></Input>
              </FormItem>
          </Form>
        </Row>
      </van-tab>
    </van-tabs>
    <Modal v-model="modal_del"
           title=""
           @on-ok="del_ok">
      <p>{{tipsMsg}}</p>
    </Modal>
  </div>

</template>

<script>

  import {createSchool,schoolList,schoolAdmin,deleteAdmin,deleteSchool} from "../../../utils/api";

  export default {
  name:"school",
    data(){
        return{
            modal_del:false,
            schoolname:"",
            page:1,
            total:0,
            schoolList:[],
            selectSchool:"",
            selectSid:0, //当前选择的学校id
            tipsTitle:"", //弹窗标题
            tipsMsg:"", //弹窗提示信息
            tabIndex:0, //tab对应的index
            formItem:{
              input:"",
              schoolList:[], //学校列表
            }
        }
    },
    mounted(){
      this.getSchoolList();
    },
    methods:{
      //tabs 导航切换
      clickTabs(index){
        this.tabIndex = index
      },
      //创建学校
      createSchool(){
        createSchool({name:this.schoolname}).then(res => {
          if(res.data.errno == 0){
            this.getSchoolList()
          }
        })
      },
      //获取学校列表
      getSchoolList(){
        schoolList({page:this.page,size:20}).then(res => {
          this.schoolList = res.data.data.data
          this.total = res.data.data.count
        })
      },
      //分页显示学校信息
      changePage(page){
        this.page = page;
      },
      //删除学校信息
      delSchool(info){
        this.modal_del = true;
        this.selectSid = info.id;
        this.tipsTitle = "删除学校";
        this.tipsMsg = "是否确定删除"+info.name+"学校信息";
      },
      //删除对应的学校信息
      del_ok(){

        var option = {
          schoolid:this.selectSid
        }
        deleteSchool(option).then(res => {
          this.getSchoolList()
        })

      },
      del_cancel(){

      },
      //删除管理员账号
      delAdmin(){

      }

    }
}
</script>