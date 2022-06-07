<template>
  <div>
    <Row>
      <Col span="5">章节</Col>
      <Col span="6">图片名</Col>
      <Col span="4">封面</Col>
      <Col span="4">图片地址</Col>
      <Col span="2">排序</Col>
      <Col span="3">操作</Col>
    </Row>
    <Row v-for="item in list" :key="item.id" class="row-item">
      <Col class="row-col" span="5">{{item.categoryname}}</Col>
      <Col class="row-col" span="6">{{item.name}}</Col>
      <Col class="row-col" span="4">
        <img style="width: 40px;height: 40px;vertical-align: middle" :src="item.url">
      </Col>
      <Col class="row-col" span="4">
        <div style="text-overflow: ellipsis;white-space: nowrap; width: 100px;overflow: hidden;">
          {{item.url}}
        </div>
      </Col>
      <Col class="row-col" span="2">{{item.sort}}</Col>
      <Col class="row-col" sapn="3">
        <span style="text-align: center;" @click="deleteGalleryClick(item.id)">删除</span>
        <span style="margin-left: 20px;" @click="gallerySort(item.id)">排序</span>
      </Col>
    </Row>
    <Page :total="total" :current="page" @on-change="changePage"></Page>

    <Modal v-model="isShowPop"
      @on-ok="submitSort">
      <Form>
        <FormItem label="图库排序">
          <Input v-model="formItem.sortNum"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>

import {getGalleryList, deleteGallery,updateGallerySort} from "../../../utils/api";

export default {
  name: "WidgetGalleryList",
  data(){
    return {
      list:[], //视频列表
      page:0, //当前页码
      total:0,
      isShowPop:false, //是否显示弹框
      currentId:0, //当前选择的图库id
      //表单数据
      formItem:{
        sortNum:0, //排序数值sortNum:0, //排序数值
      }
    }
  },
  mounted() {
    this.page = 1
    this.changePage(1)
  },
  updated() {
    console.log("update");
  },
  methods:{

    loadList(){
      this.changePage(this.page)
    },

    changePage(page){
      this.page = page
      getGalleryList({page:page,size:10}).then(res => {
        console.log(res)
        this.list = res.data.data.list
        this.total = res.data.data.total
        /*for(var i=0; i<this.list.length; i++){
          if(this.list[i].url.indexOf("res.yimios.com") >= 0){
            this.list[i].url = this.list[i].url+"!200x200"
          }
        }*/
      }).catch(err => {
        console.log(err)
      })
    },
    //删除对应的图片
    deleteGalleryClick(cid){
      console.log(cid)
      var option = {
        id:cid
      }
      deleteGallery(option).then(res => {
        console.log("删除图片数据返回："+res+" list:"+this.list)
        if(res.data.data){
          for(var i=0; i<this.list.length; i++){
            if(this.list[i].id == res.data.data.id){
              this.list.splice(i,1)
              break;
            }
          }
        }
      }).catch(err => {
        console.log("删除图片数据错误")
      })

    },
    //修改图库图片的排序
    gallerySort(id){
      this.isShowPop = true;
      this.currentId = id;
    },
    //提交排序
    submitSort(){
      console.log("排序："+this.formItem.sortNum);
      updateGallerySort({id:this.currentId,sort:this.formItem.sortNum}).then(res => {
        console.log(res);
        this.updatelistSort(res.data.data.id,res.data.data.sort);
      })
    },
    //跟新列表排序
    updatelistSort(id,sort){
      for(var i=0; i<this.list.length; i++){
        if(this.list[i].id == id){
          this.list[i].sort = sort;
          break;
        }
      }
    }
  }
}
</script>

<style scoped>
.row-item{
  line-height: 50px;
  height: 50px;
  background-color: #3ebae0;
  margin: 2px 2px 2px 2px;
}
.row-item .row-col{
  line-height: 50px;
  margin: 0px 2px;
  vertical-align: middle;
}
</style>