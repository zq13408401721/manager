<template>
  <div class="grid-demo">
    <div class="overview">
      <v-row class="demo-row row-nd">
        <v-col class="demo-col demo-col-1" span="4">选择分类</v-col>
        <v-col class="demo-col demo-col-1" span="4">
          <Button @click="showSelectTree">{{ selectCategoryName }}</Button>
        </v-col>
        <v-col class="demo-col demo-col-2" span="16">备注：只能选择到三级分类</v-col>
      </v-row>
      <v-row class="demo-row row-nd">
        <v-col class="demo-col demo-col-1" span="4">上传封面</v-col>
        <v-col class="demo-col demo-col-1" span="4">
          <Button @click="showSelectImg">上传封面图</Button>
        </v-col>
        <v-col class="demo-col demo-col-2" span="16">备注：只能选择到三级分类</v-col>
      </v-row>
      <!--视频封面图-->
      <v-row class="demo-row" style="text-align: left;">
        <img v-show="this.cover != undefined && this.cover.length > 0" :src="this.cover" style="width:50px;height: 50px;margin-left: 70px;">
      </v-row>
      <v-row class="demo-row row-nd" style="margin-top: 10px;">
        <v-col class="demo-col demo-col-1" span="4">添加视频</v-col>
        <v-col class="demo-col demo-col-1" span="4">
          <Button @click="showSelectVideo">上传视频</Button>
        </v-col>
        <v-col class="demo-col demo-col-1" span="2">
          <Button @click="showCCSelectVideo">填写cc视频id</Button>
        </v-col>
        <v-col class="demo-col demo-col-2" span="12">备注：只能选择到三级分类</v-col>
      </v-row>
    </div>

    <!--视频-->
    <v-row class="demo-row">
      <List item-layout="vertical">
        <ListItem v-for="item in videos" :key="item.name" style="text-align: left">
          <span style="width:200px;word-wrap: break-word;word-break:break-all">{{item.name}}</span>
          <img src="../../assets/cover.png" style="width:50px;height: 50px">
        </ListItem>
      </List>
    </v-row>

    <!--节点选择-->
    <Modal v-model="showTreeNode" @on-ok="treeOK">
      <div class="scrollbar">
        <Tree :render="renderTreeContent" :data="treeData" class="tree-render tree" @on-select-change="nodeClick">
        </Tree>
      </div>
    </Modal>

    <!--图片上传-->
    <Modal v-model="showDialog" :title="dialogtitle" @on-ok="dialogOK" @on-cancel="dialogCancel">
      <Upload ref="file" action="http://server.yimios.com/api/upload/uploadImageFile" :before-upload="selectImage"
        :on-success="uploadSuccess" :on-error="uploadError" :headers="header" :data="filedata">
        <Button icon="ios-cloud-upload-outline">上传封面图</Button>
      </Upload>
    </Modal>

    <!--视频上传-->
    <Modal v-model="showVideoDialog" :title="dialogvideotitle" @on-ok="dialogVideoOK" @on-cancel="dialogVideoCancel">
      <Upload ref="file" action="http://server.yimios.com/api/upload/uploadImageFile" :before-upload="selectVideo"
              :on-success="uploadVideoSuccess" :on-error="uploadVideoError" :headers="videoheader" :data="videodata">
        <Button icon="ios-cloud-upload-outline">上传视频</Button>
      </Upload>
    </Modal>

    <!--cc视频编辑-->
    <Modal v-model="showCCVideoDialog" :title="dialogvideotitle" @on-ok="dialogCCVideoOK" @on-cancel="dialogCCVideoCancel">

      <Form :model="formItem">
        <FormItem label="视频名">
          <Input v-model="ccVideoName" placeholder="输入视频名"></Input>
        </FormItem>
        <FormItem label="视频ID">
          <Input v-model="ccVideoId" placeholder="输入CC视频ID"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!--loading-->
    <Spin fix v-show="loading">
      <div class="loader">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
        </svg>
      </div>
    </Spin>
  </div>
</template>

<script>

import {getToken,getSchoolId} from "../../../utils/token"
import {updateVideoCategory} from "../../../utils/api"
import {Toast} from "vant"
import {getCategoryInfo,addVideo} from "../../../utils/api"


export default {
  name: "WidgetVideoUpload",
  components:{

  },
  props:{
    treeData:[],
  },
  data(){
    return{
      dialogtitle:"视频封面图上传",
      dialogvideotitle:"视频上传",
      selectCategoryName:"请选择分类",
      selectCategoryId:0, //当前节点id
      schoolid:getSchoolId(), //当前的学校id
      cover:"",//当前视频的封面
      videos:[], //视频
      videoUrl:"",
      showDialog:false,
      showVideoDialog:false,
      showCCVideoDialog:false, //显示cc视频弹框
      showTreeNode:false,
      file:null,
      header:{
      },
      filedata:{},
      categoryid:0, //
      video:null,
      videodata:{}, //视频相关信息
      videoheader:{},
      loading:false,
      categoryInfo:[], //当前节点相关信息
      ccVideoName:"", //cc视频名
      ccVideoId:"", //cc视频ID
    }
  },
  mounted() {
    this.filedata.type = "imgs"
    this.videodata.type = "videos"
    console.log("schoolid"+this.schoolid)
  },
  methods:{
    //显示选择tree结构
    showSelectTree(){
      this.showTreeNode = true
    },
    /**
     * 显示图片上传
     */
    showSelectImg(){
      if(this.selectCategoryId == 0){
        Toast("请选择课程节点")
      }else{
        this.showDialog = true
        this.header["art-token"] = getToken()
      }

    },

    selectImage(file){
      this.file = file
      this.loading = true
      return true
    },

    dialogOK(){
      console.log("ok")
    },
    dialogCancel(){
      console.log("cancel")
    },
    //文件上传成功
    uploadSuccess(response,file,filelist){
      console.log(response) // resonse.data.url
      this.cover = response.data.url

      var option = {
        id:this.selectCategoryId,
        cover:this.cover
      }
      updateVideoCategory(option).then(res => {
        this.loading = false
      }).catch(err => {
        console.log("updatecategory err "+err)
        this.loading = false
      })
    },
    //上传失败
    uploadError(error,file,filelist){
      console.log(error)
    },
    //显示视频选择
    showSelectVideo(){
      if(this.selectCategoryId == 0){
        Toast("请先选择课程节点或封面图片")
      }else {
        this.showVideoDialog = true
        this.videoheader["art-token"] = getToken()
      }
    },
    //显示CC视频编辑框
    showCCSelectVideo(){
      if(this.selectCategoryId == 0){
        Toast("请先选择课程节点或封面图片")
      }else {
        this.showCCVideoDialog = true
        this.videoheader["art-token"] = getToken()
      }
    },
    //打开选择视频的弹框
    selectVideo(file){
      this.video = file
      return true
    },

    //cc视频编辑ok
    dialogCCVideoOK(){
      if(this.ccVideoId && this.ccVideoName){
        this.videos.push({name:this.ccVideoName,ccid:this.ccVideoId})
        var option = {
          name:this.ccVideoName,
          ccid:this.ccVideoId,
          categoryid:this.selectCategoryId
        }
        addVideo(option).then(res => {
          this.videos[this.videos.length-1].id = res.data.id
          console.log(res)
        }).catch(err => {
          console.log("err "+err)
        })
      }else{
        Toast("")
      }
    },
    //cc视频编辑取消
    dialogCCVideoCancel(){

    },

    //视频上传弹框
    dialogVideoOK(){

    },
    //视频上传关闭弹框
    dialogVideoCancel(){

    },
    //视频上传成功
    uploadVideoSuccess(response,file,filelist){
      console.log(response)
      this.videos.push({name:file.name,url:response.data.url})
      var option = {
        name:file.name,
        url:response.data.url,
        categoryid:this.selectCategoryId
      }
      addVideo(option).then(res => {
        this.videos[this.videos.length-1].id = res.data.id
        console.log(res)
      }).catch(err => {
        console.log("err "+err)
      })
    },
    //视频上传失败
    uploadVideoError(response,file,filelist){
      console.log(response)
    },

    treeOK(){
      console.log("Data:"+this.treeData)
    },
    //点击节点
    nodeClick(childrens,node){
      console.log("nodeclick")
      if(node.children == undefined || node.children.length == 0){
        this.selectCategoryId = node.id
        this.selectCategoryName = node.name
        //获取当前节点信息
        getCategoryInfo({id:this.selectCategoryId}).then(res => {
          this.cover = res.data.data.cover
          this.categoryInfo = res.data.data.videolist
          let arr = [];
          for(var i=0; i<this.categoryInfo.length; i++){
            arr.push({name:this.categoryInfo[i].name})
          }
          this.videos = arr;
        }).catch(err => {
          console.log("categoryinfo err"+err)
        })
      }else{
        // Toast("请选择最后一个节点")
      }
    },
    renderTreeContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span',{
          style:{
            display:'inline-block',
            width:"200px"
          }
        }, [
          h('span', data.name)
        ]),

      ]);
    },
  }
}
</script>

<style scoped>
.tree{
  width: 600px;
  height: 500px;
}
.row-nd{
  height: 50px;
  text-align: center;
}
</style>