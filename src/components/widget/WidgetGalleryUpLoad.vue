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
          <Button @click="showSelectVideo">上传图库</Button>
        </v-col>
        <v-col class="demo-col demo-col-2" span="16">备注：只能选择到三级分类</v-col>
      </v-row>
    </div>

    <!--图库-->
    <v-row class="demo-row">
      <List item-layout="vertical" class="list">
        <ListItem v-for="item in videos" :key="item.name" style="text-align: left">
          <span style="width:200px;word-wrap: break-word;word-break:break-all">{{item.name}}</span>
          <img :src="item.url" style="width:50px;height: 50px">
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
      <Upload ref="file" action="http://res.yimios.com:9080/api/upload/uploadImageFile" :before-upload="selectImage"
              :on-success="uploadCoverSuccess" :on-error="uploadError" :headers="header" :data="filedata">
        <Button icon="ios-cloud-upload-outline">上传封面图</Button>
      </Upload>
    </Modal>

    <!--图库上传-->
    <!--<Modal v-model="showVideoDialog" :title="dialogvideotitle" @on-ok="dialogVideoOK" @on-cancel="dialogVideoCancel">
      <Upload ref="file" action="http://server.yimios.com/api/upload/uploadImageFile" :before-upload="selectVideo"
              :on-success="uploadGallerySuccess" :on-error="uploadVideoError" :headers="videoheader" :data="videodata">
        <Button icon="ios-cloud-upload-outline">上传图库</Button>
      </Upload>
    </Modal>-->

    <!--多张图上传-->
    <Modal v-model="showVideoDialog" :title="dialogvideotitle" @on-ok="dialogVideoOK" @on-cancel="dialogVideoCancel">
      <div class="box">
        <div class="upload">
          <div class="upload_warp">
            <div class="upload_warp_left" @click="fileClick">
              <img style="height: 80px" src="../../assets/upload.png">
            </div>
            <Button type="primary" @click="uploadMoreImage">上传</Button>
            <!--<div class="upload_warp_right" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
              或者将文件拖到此处
            </div>-->
          </div>
          <div class="upload_warp_text">
            选中{{imgList.length}}张文件，共{{bytesToSize(this.size)}}
          </div>
          <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
          <div class="upload_warp_img" v-show="imgList.length!=0">
            <div class="upload_warp_img_div" v-for="item in imgList" :key="item.name">
              <div class="upload_warp_img_div_top">
                <!--<Upload ref="filemore" action="http://server.yimios.com/api/upload/uploadImageFile" :before-upload="selectImage"
                        :on-success="uploadCoverSuccess" :on-progress="uploadProgress" :on-error="uploadError" :headers="header" :data="item">
                </Upload>-->
                上传进度{{item.persent}}%
                <div class="upload_warp_img_div_text">
                  {{item.file.name}}
                </div>
                <!--<img src="../../assets/del.png" class="upload_warp_img_div_del" @click="fileDel(pos)">-->
              </div>
              <img :src="item.file.src">
            </div>
          </div>
        </div>
      </div>
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

<script src="http://www.jq22.com/jquery/vue.min.js"></script>
<script>

import {getToken,getSchoolId} from "../../../utils/token"
import {updateGalleryCategory,upLoadGalleryMore,uploadFile} from "../../../utils/api"
import {Toast} from "vant"
import {getGalleryCategoryInfo,addGallery} from "../../../utils/api"

export default {
name: "WidgetGalleryUpLoad",
  props:{
    treeData:[],
  },
  data(){
    return{
      dialogtitle:"图库封面图上传",
      dialogvideotitle:"图库上传",
      selectCategoryName:"请选择分类",
      selectCategoryId:0, //当前节点id
      cover:"",//当前视频的封面
      videos:[], //视频
      videoUrl:"",
      showDialog:false,
      showVideoDialog:false,
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

      imgList: [],
      imgFiles:[], //图片文件
      size: 0,
    }
  },
  mounted() {
    this.filedata.type = "gallery"
    this.videodata.type = "gallery"
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
    //上传多张图
    uploadMoreImage(){
      console.log(this.imgList.length)
      /*var uploadCommon = this.$refs.filemore
      if(uploadCommon){
        for(var i=0; i<uploadCommon.length; i++){
          //uploadCommon[i].onStart(this.imgList[i])
          uploadCommon[i].upload(this.imgList[i])
        }
      }*/
      var that = this
      var files = []
      var form = new FormData()
      for(var i=0; i<this.imgList.length; i++){
        files.push({
          name:this.imgList[i].file.name,
          type:this.imgList[i].file.type,
          size:this.imgList[i].file.size,
          file:this.imgList[i].file
        })
        form.append("cid",this.selectCategoryId)
        form.append("file",this.imgList[i].file)
        form.append("type",1)
        form.append("schoolid",getSchoolId())
        uploadFile(form,this.imgList[i].file.name,function (name,persent) {
          console.log("上传进度："+persent);
          that.uploadPersent(name,persent)
        }).then(res => {
          console.log('res:'+res)
          this.deleteUploadSuccess(res)
        }).catch(err => {
          console.log("上传失败："+err)
        })
      }
    },
    uploadPersent(name,persent){
      for(var i=0; i<this.imgList.length; i++){
        if(this.imgList[i].file.name == name){
          this.imgList[i].persent = persent
          break
        }
      }
    },
    //删除上传成功文件
    deleteUploadSuccess(name){
      for(var i=0; i<this.imgList.length; i++){
        if(this.imgList[i].file.name == name){
          this.imgList.splice(i,1)
          break
        }
      }
    },
    //文件封面上传成功
    uploadCoverSuccess(response,file,filelist){
      console.log(response) // resonse.data.url
      this.cover = response.data.url

      var option = {
        id:this.selectCategoryId,
        cover:this.cover
      }
      updateGalleryCategory(option).then(res => {
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

    //打开选择视频的弹框
    selectVideo(file){
      this.video = file
      return true
    },

    //视频上传弹框
    dialogVideoOK(){

    },
    //视频上传关闭弹框
    dialogVideoCancel(){

    },
    //文件上传进度
    uploadProgress(e,file){
      console.log("e:"+e)
    },
    //图库上传成功
    uploadGallerySuccess(response,file,filelist){
      console.log(response)
      this.videos.push({name:file.name,url:response.data.url})
      var option = {
        name:file.name,
        url:response.data.url,
        categoryid:this.selectCategoryId
      }
      addGallery(option).then(res => {
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
        getGalleryCategoryInfo({id:this.selectCategoryId}).then(res => {
          this.cover = res.data.data.cover
          this.categoryInfo = res.data.data.gallerys
          let arr = [];
          for(var i=0; i<this.categoryInfo.length; i++){
            arr.push({name:this.categoryInfo[i].name,url:this.categoryInfo[i].url})
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
    //多文件上传
    fileClick() {
      document.getElementById('upload_file').click()
    },
    //上传多张图片
    uploadMore(){

    },
    fileChange(el) {
      if (!el.target.files[0].size) return;
      this.fileList(el.target);
      el.target.value = ''
    },
    fileList(fileList) {
      let files = fileList.files;
      for (let i = 0; i < files.length; i++) {
        //判断是否为文件夹
        if (files[i].type != '') {
          this.fileAdd(files[i]);
        } else {
          //文件夹处理
          this.folders(fileList.items[i]);
        }
      }
    },
    //文件夹处理
    folders(files) {
      let _this = this;
      //判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i]);
          } else {
            _this.folders(file[i]);
          }
        }
      })
    },
    foldersAdd(entry) {
      let _this = this;
      entry.file(function (file) {
        _this.fileAdd(file)
      })
    },
    fileAdd(file) {
      //总大小
      this.size = this.size + file.size;
      //判断是否为图片文件
      if (file.type.indexOf('image') == -1) {
        //file.src = 'wenjian.png';
        this.imgList.push({
          file,
          persent:0
        });
      } else {
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file);
        reader.onload = function () {
          file.src = this.result;
          this.vue.imgList.push({
            file,
            persent:0
          });
        }
      }
    },
    fileDel(index) {
      this.size = this.size - this.imgList[index].file.size;//总大小
      this.imgList.splice(index, 1);
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0 B';
      let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    dragenter(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    dragover(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    drop(el) {
      el.stopPropagation();
      el.preventDefault();
      this.fileList(el.dataTransfer);
    }

  }
}
</script>

<style scoped>
.tree{
  width: 504px;
  height: 550px;
  overflow-y: scroll;
}
.row-nd{
  height: 50px;
  text-align: center;
}
.box {
  width: 500px;
  margin-left: 0;
  text-align: center;
}
.upload_warp_img_div_del {
  position: absolute;
  top: 6px;
  width: 16px;
  right: 4px;
}

.list{
  height: 400px;
  overflow-y: auto;
}

.upload_warp_img_div_top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.4);
  line-height: 30px;
  text-align: left;
  color:#fff;
  font-size: 12px;
  text-indent: 4px;
}

.upload_warp_img_div_text {
  white-space: nowrap;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload_warp_img_div img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.upload_warp_img_div {
  position: relative;
  height: 100px;
  width: 120px;
  border: 1px solid #ccc;
  margin: 0px 30px 10px 0px;
  float: left;
  line-height: 100px;
  display: table-cell;
  text-align: center;
  background-color: #eee;
  cursor: pointer;
}

.upload_warp_img {
  height: 100px;
  border-top: 1px solid #D2D2D2;
  padding: 14px 0 0 14px;
  overflow-y: auto;
}

.upload_warp_text {
  text-align: left;
  margin-bottom: 10px;
  padding-top: 10px;
  text-indent: 14px;
  border-top: 1px solid #ccc;
  font-size: 14px;
}

.upload_warp_right {
  float: left;
  width: 57%;
  margin-left: 2%;
  height: 100%;
  border: 1px dashed #999;
  border-radius: 4px;
  line-height: 130px;
  color: #999;
}

.upload_warp_left img {
  margin-top: 32px;
}

.upload_warp_left {
  float: left;
  width: 40%;
  height: 100%;
  border: 1px dashed #999;
  border-radius: 4px;
  cursor: pointer;
}

.upload_warp {
  margin: 14px;
  height: 130px;
}

.upload {
  border: 1px solid #ccc;
  background-color: #fff;
  width: 500px;
  box-shadow: 0px 1px 0px #ccc;
  border-radius: 4px;
}

</style>