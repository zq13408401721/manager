<template>
  <div style="height: 100%;">
    <div class="container">
      <div class="class_list">
        <div class="top_class">
          <div class="title">班级列表</div>
          <div class="list">
            <ul id="ul_class">
              <li @click="getClassMember(item)" v-for="item in classArr" :key="item.id" :id="getId(item.id)">
                <div class="class_item">
                  <span>{{item.name}}</span>
                  <div>
                    <div style="float: left; cursor: pointer;" @click.stop="editorClass(item)">编辑</div>
                    <div style="float:left;margin-left: 5px;cursor:pointer;" @click.stop="deleteClass(item)">删除</div>
                  </div>
                </div>

              </li>
            </ul>
          </div>
        </div>
        <div class="bottom_bar_class">
          <Button @click="createClass">添加</Button>
        </div>
      </div>
      <div class="member_list">
        <div class="top_class">
          <div class="title">
            {{currentClass.name}}班成员列表
          </div>
          <div>
            <ul>
              <li v-for="item in classMembers" :key="item.id">
                <div class="member_item">
                  <span>{{item.name}}</span>
                  <Button @click="deleteMember(item)" type="error">删除</Button>
                </div>

              </li>
            </ul>
          </div>
        </div>
        <!--<div class="bottom_bar_class">
          <Button>删除</Button>
        </div>-->
      </div>
      <div class="teacher_list">
        <div class="top_class">
          <div class="title">
            学校所有老师
          </div>
          <div>
            <ul>
              <li v-for="item in teachers" :key="item.id" class="user_item">
                <Checkbox v-model="item.ischecked" :disabled="item.disabled" >{{item.name}}</Checkbox>
              </li>
            </ul>
          </div>
        </div>

        <div class="bottom_bar_class">
          <Button @click="selectAllTeacher">{{selectAllTeacherLabel}}</Button>
          <Button @click="addTeachers">添加</Button>
        </div>
      </div>
      <div class="user_list">
        <div class="top_class">
          <div class="title">
            学校所有学生
          </div>
          <div>
            <ul>
              <li v-for="item in students" :key="item.id" class="user_item">
                <Checkbox v-model="item.ischecked" :disabled="item.disabled" >{{item.name}}</Checkbox>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom_bar_class">
          <Button @click="selectAllStudent">{{this.selectAllStudentLabel}}</Button>
          <Button @click="addStudents">添加</Button>
        </div>
      </div>
    </div>

    <!--alert确定提示框架-->
    <Modal v-model="show_alert" @on-ok="this.alertok" @on-cancel="this.alertcancel">
      <p>{{alert_word}}</p>
    </Modal>
    <!--创建班级-->
    <Modal v-model="show_classcreate" :title="classtitle" @on-ok="this.classok" @on-cancel="this.classcancel">
      <Form :model="data_class" :label-width="100" style="margin-top: 20px;">
        <FormItem label="班级名">
          <Input v-model="data_class.classname" placeholder="输入班级名"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>

</template>

<script>

  import {
    getClassesBySchoolId,
    getClassMember,
    getSchoolMembers,
    addClassMember,
    createClass,
    deleteClassMember,
    deleteClassById,
    updateClassInfo,
  } from '../../../utils/api';

  import $ from 'jquery';

  import {getSchoolId} from "../../../utils/token";

  export default {
  name: "ClassManager",

  data(){
    return {
      alert_word:"",
      show_alert:false,
      deleteclassid:0,
      alert_type:1, //1删除班级，2删除老师，3删除学生
      show_classcreate:false, //创建班级的弹框
      show_classeditor:false, //编辑班级
      classtitle:"", //创建班级   编辑班级
      //创建班级相关数据
      data_class:{
        classname:'',
      },
      classArr:[],
      currentClass:{},
      //班级成员
      classMembers:[],
      //学校所有老师
      teachers:[],
      //全选文本
      selectAllTeacherLabel:"全选",
      isSelectAllTeacher:false,

      //学校学生
      students:[],
      selectAllStudentLabel:"全选",
      isSelectAllStudent:false,


    }
  },
  watch:{
    /*currentClass(val,oldVal){

    }*/ //普通数据监听
    //深度监听，可以监听对象，数组的变化
    classArr:{
      handler(newValue,oldValue){
        this.init();
      },
      deep:true
    }
  },
  mounted() {
    this.getClassesBySid();
    this.getSchoolTeachersList();
    this.getSchoolStudentsList();

  },
  methods:{
    init(){
      this.$nextTick(function () {
        //班级条目选中监听
        $(function () {
          $("#ul_class li").click(function(){
            //删除其他兄弟元素样式
            $(this).siblings('li').removeClass('list_item_select')
            $(this).siblings('li').addClass('list_item_normal')
            $(this).removeClass('list_item_normal')
            $(this).addClass('list_item_select')
          })
        })
      })
    },
    getId(id){
      return "li"+id
    },
    //获取学校所有班级
    getClassesBySid(){
      var data = {}
      getClassesBySchoolId(data).then(res => {
        if(res.data.data){
          //循环把请求回来的数据添加到列表
          res.data.data.forEach((item,index)=>{
            item.disabled = false
            item.ischecked = false
            this.classArr.push(item)
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //获取班级的成员
    getClassMember(item){
      this.currentClass = item
      if(this.currentClass == undefined){
        this.$Message.info("还未选择班级")
        return;
      }
      var data = {
        classid:this.currentClass.id
      }
      getClassMember(data).then(res => {
        if(res.data.errno == 0){
          //清理上次的班级信息
          this.classMembers = []
          //重置学校老师和学生的状态
          this.resetUserState()
          res.data.data.forEach((item,index) => {
            item.name = item.nickname ? item.nickname : item.username
            this.classMembers.push(item)
            if(item.role == 1){
              this.updateTeacherState(item.uid,true)
            }else{
              this.updateStudentState(item.uid,true)
            }
          })
        }else{
          this.$Message.info(res.data.errmsg)
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //获取学校所有老师
    getSchoolTeachersList(){
      var data = {
        role:1,
      }
      getSchoolMembers(data).then(res => {
        //console.log(res.data.data)
        if(res.data.data){
          //循环把请求回来的数据添加到列表
          res.data.data.forEach((item,index)=>{
            item.disabled = false
            item.ischecked = false
            if(item.nickname){
              item.name = item.nickname
            }else{
              item.name = item.username
            }
            this.teachers.push(item)
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //检查老师是否在当前班级
    checkClassTeacher(){

    },
    //获取学校所有学生
    getSchoolStudentsList(){
      var data = {
        role:2
      }
      getSchoolMembers(data).then(res => {
        if(res.data.data){
          //循环把请求回来的数据添加到列表
          res.data.data.forEach((item,index)=>{
            item.disabled = false
            item.ischecked = false
            if(item.nickname){
              item.name = item.nickname
            }else{
              item.name = item.username
            }
            this.students.push(item)
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //编辑班级
    editorClass(data){
      this.currentClass = data
      this.data_class.classname = data.name
      this.classtitle = "编辑班级"
      this.show_classeditor = true
      this.show_classcreate = true
      //修改样式
      $("#li"+data.id).siblings("li").removeClass("list_item_select")
      $("#li"+data.id).siblings("li").addClass("list_item_normal")
      $("#li"+data.id).removeClass("list_item_normal")
      $("#li"+data.id).addClass("list_item_select")
    },
    //创建班级
    createClass(){
      this.data_class.classname = ''
      this.classtitle = "创建班级"
      this.show_classcreate = true
      this.show_classeditor = false
    },
    //删除班级
    deleteClass(item){
      this.show_alert = true
      this.alert_word = "是否确定删除"+item.name
      this.deleteclassid = item.id
    },
    //添加老师
    addTeachers(){
      if(this.currentClass == undefined){
        this.$Message.info("未选择班级")
        return;
      }
      var data = {
        role:1,
        classid:this.currentClass.id,
        users:[]
      }
      //获取当前选中的用户
      this.teachers.forEach(function (item) {
        if(!item.disabled && item.ischecked){
          data.users.push({uid:item.uid})
        }
      })
      this.addClassUser(data)

    },
    //添加学生
    addStudents(){
      if(this.currentClass == undefined){
        this.$Message.info("未选择班级")
        return;
      }
      var data = {
        role:2,
        classid:this.currentClass.id,
        users:[]
      }
      //获取当前选中的用户
      this.students.forEach(function (item) {
        if(!item.disabled && item.ischecked){
          data.users.push({uid:item.uid})
        }
      })
      this.addClassUser(data)
    },
    //添加班级成员
    addClassUser(data){

      if(data.users.length == 0){
        this.$Message.info("未选择需要添加的老师")
        return;
      }
      addClassMember(data).then(res => {
        //添加成员成功
        if(res.data.errno == 0){
          res.data.data.forEach((item,index)=>{
            var info = this.getMemberInfo(data.role,item.uid)
            if(info){
              item.username = info.username
              item.nickname = info.nickname
              item.name = info.nickname ? info.nickname : info.username
            }
            if(item.role == 1){
              this.updateTeacherState(item.uid,true)
            }else{
              this.updateStudentState(item.uid,true)
            }
            this.classMembers.push(item)
          })
        }else{
          this.$Message.info(res.data.errmsg)
        }

      }).catch(err => {
        console.log(err)
      });
    },
    //删除班级成员
    deleteMember(item){
      if(this.currentClass == undefined){
        this.$Message.info("没有选择班级")
        return;
      }
      //保留一次删多个成员的接口
      var data = {
        classid:this.currentClass.id,
        uids:[item.uid]
      }
      deleteClassMember(data).then(res => {
        if(res.data.errno == 0){
          //从当前班级列表中删除
          for(var i=0; i<this.classMembers.length; i++){
            if(this.classMembers[i].uid === item.uid){
              //更新学校成员列表
              if(item.role == 1){
                this.updateTeacherState(item.uid,false)
              }else{
                this.updateStudentState(item.uid,false)
              }
              this.classMembers.splice(i,1)
              break;
            }
          }
        }else{
          this.$Message.info(res.data.errmsg)
        }
      }).catch(err => {
        console.log(err)
      })

    },
    //选中所有老师
    selectAllTeacher(){
      var bool = false
      if(this.selectAllTeacherLabel === "全选"){
        this.selectAllTeacherLabel = "取消全选"
        bool = true
      }else{
        this.selectAllTeacherLabel = "全选"
      }
      this.teachers.forEach((item,index)=>{
        if(!item.disabled){
          item.ischecked = bool
        }
      })
    },
    //选中所有学生
    selectAllStudent(){
      var bool = false
      if(this.selectAllStudentLabel === "全选"){
        this.selectAllStudentLabel = "取消全选"
        bool = true
      }else{
        this.selectAllStudentLabel = "全选"
      }
      this.students.forEach((item,index)=>{
        if(!item.disabled){
          item.ischecked = bool
        }
      })
    },
    //获取成员信息
    getMemberInfo(role,uid){
      var i;
      if(role == 1){
        for(i=0; i<this.teachers.length; i++){
          if(this.teachers[i].uid === uid){
            return this.teachers[i];
          }
        }
      }else{
        for(i=0; i<this.students.length; i++){
          if(this.students[i].uid === uid){
            return this.students[i];
          }
        }
      }
    },
    resetUserState(){
      var i;
      for(i=0; i<this.teachers.length; i++){
        this.teachers[i].disabled = false
        this.teachers[i].ischecked = false
      }
      for(i=0; i<this.students.length; i++){
        this.students[i].disabled = false
        this.students[i].ischecked = false
      }
    },
    //更新老师状态
    updateTeacherState(uid,select){
      for(var i=0; i<this.teachers.length; i++){
        if(this.teachers[i].uid === uid){
          this.teachers[i].disabled = select
          this.teachers[i].ischecked = select
          break;
        }
      }
    },
    //更新学生状态
    updateStudentState(uid,select){
      for(var i=0; i<this.students.length; i++){
        if(this.students[i].uid === uid){
          this.students[i].disabled = select
          this.students[i].ischecked = select
          break;
        }
      }
    },
    //alertok
    alertok(){
      if(this.deleteclassid > 0){
        deleteClassById({classid:this.deleteclassid}).then(res => {
          if(res.data.errno == 0){
            for(var i=0; i<this.classArr.length; i++){
              if(this.classArr[i].id == this.deleteclassid){
                this.classArr.splice(i,1)
                break;
              }
            }
            this.classMembers = []
            this.resetUserState()
          }else{
            this.$Message.info(res.data.errmsg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    //alertcancel
    alertcancel(){
      this.show_alert = false;
    },
    //创建班级ok
    classok(){
      if(this.data_class.classname == undefined){
        this.$Message.info("请输入班级名")
        return;
      }
      var data = {
        name:this.data_class.classname,
      }
      //创建班级与编辑班级
      if(this.show_classeditor){
        data.classid = this.currentClass.id
        updateClassInfo(data).then(res => {
          this.updateClassName(data.classid,data.name)
        }).catch(err => {
          console.log(err)
        })
      }else{
        data.max = 500
        createClass(data).then(res => {
          if(res.data.errno == 0){
            this.classArr.push(res.data.data)
          }else{
            this.$Message.info(res.data.errmsg)
          }
        }).catch(err => {
          console.log(err)
        })
      }

    },
    updateClassName(id,classname){
      for(var i=0; i<this.classArr.length; i++){
        if(this.classArr[i].id == id){
          this.classArr[i].name = classname
        }
      }
    },
    //创建班级cancel
    classcancel(){
      this.show_classcreate = false;
    }
  }

}
</script>

<style scoped>

  Button{
    margin: 10px 2px;
  }

  ul{
    width: 100%;
    height: 600px;
    overflow-y: scroll;
    overflow-x: hidden;
    text-align: left;
  }

  ul::-webkit-scrollbar {
    /* 隐藏默认的滚动条 */
    -webkit-appearance: none;
  }
  ul::-webkit-scrollbar:vertical {
    /* 设置垂直滚动条宽度 */
    width: 10px;
  }

  /* 这里不需要用到这个 */
  ul::-webkit-scrollbar:horizontal{
    /* 设置水平滚动条厚度 */
    height: 2px;
  }

  ul::-webkit-scrollbar-thumb {
    /* 滚动条的其他样式定制，注意，这个一定也要定制，否则就是一个透明的滚动条 */
    border-radius: 8px;
    border: 10px solid rgba(255,255,255,.4);
    background-color: rgba(0, 0, 0, .5);
  }

  .list_item_select{
    background-color: lemonchiffon;
  }
  .list_item_normal{
    background-color: white;
  }

  .list{
    width: 100%;
  }
  .title{
    height: 40px;
    font-size:1.2rem;
    color: #333333;
  }

  .container{
    width: 100%;
    height: 80%;
    display: flex;
  }

  .class_list{
    flex:1;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    border: #cccccc solid 1px;
  }

  .class_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 10px;
    border: #cccccc solid 1px;
  }

  .top_class{
    align-self: flex-start;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }
  .bottom_bar_class{
    align-self: flex-end;
  }

  .member_list{
    flex:2;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    border: #cccccc solid 1px;
  }
  .teacher_list{
    flex:2;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    border: #cccccc solid 1px;
  }
  .user_list{
    flex:2;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    border: #cccccc solid 1px;
  }
  .member_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    text-align: center;
    background: white;
    border-bottom: #999999 solid 1px;
    line-height: 40px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .user_item{
    line-height: 30px;
    background: white;
    border-bottom: #999999 solid 1px;
    padding-left: 10px;
    padding-right: 10px;
  }




</style>
