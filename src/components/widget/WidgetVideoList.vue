<template>
  <div>
    <Row>
      <Col span="5">章节</Col>
      <Col span="6">视频名</Col>
      <Col span="4">封面</Col>
      <Col span="4">视频地址</Col>
      <Col span="2">排序</Col>
      <Col span="3">操作</Col>
    </Row>
    <Row v-for="item in list" :key="item.name" class="row-item">
      <Col class="row-col" span="5">{{item.categoryname}}</Col>
      <Col class="row-col" span="6">{{item.name}}</Col>
      <Col class="row-col" span="4">
        <img style="width: 40px;height: 40px;vertical-align: middle" :src="item.cover">
      </Col>
      <Col class="row-col" span="3">
        <span class="video_url" style="text-overflow: ellipsis;white-space: nowrap; max-width: 100px;">{{item.url}}</span>
      </Col>
      <Col class="row-col" span="3">
        <span v-if="item.sort">序号:{{item.sort}}</span>
        <span v-if="!item.sort">序号:0</span>
        <span style="margin-left: 10px;border: 1px solid gray;padding:5px;" @click="showSortDialog(item.id)">排序</span>
      </Col>
      <Col class="row-col" sapn="3">
        <span style="text-align: center;" @click="deleteVideo(item.id)">删除</span>
      </Col>
    </Row>
    <Page :total="total" :current="page" simple onchange="changePage"></Page>

    <!--排序弹框-->
    <Modal v-model="showSort" :title="排序" @on-ok="clickSortOK" @on-cancel="clickSortCancel">

      <Form :model="formItem">
        <FormItem label="序号">
          <Input v-model="sortNo" placeholder="输入序号"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>

import {getVideoList} from "../../../utils/api";
import {Toast} from "vant"
import {updateVideoInfo} from "../../../utils/api"

export default {
name: "WidgetVideoList",
  data(){
    return {
      list:[], //视频列表
      page:0, //当前页码
      total:0,
      showSort:false,//排序弹框
      sortNo:0, //序号
      id:0, //当前视频id
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
    changePage(page){
      this.page = page
      getVideoList({page:page,size:10}).then(res => {
        console.log(res)
        this.list = res.data.data.list
        this.total = res.data.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    //删除对应的视频
    deleteVideo(vid){
      console.log(vid)
    },
    //显示排序框
    showSortDialog(id){
      this.id = id
      this.showSort = true
    },
    //确定排序
    clickSortOK(){
      if(this.id && this.sortNo > 0){
        var option = {
          id:this.id,
          sort:this.sortNo
        }
        updateVideoInfo(option).then(res => {
          this.updateListData(option.id,option.sort)
          Toast("更新成功")
        }).catch(err => {
          console.log("updatecategory err "+err)
        })
      }else{
        Toast("输入正确的内容")
      }
    },
    //弹框取消
    clickSortCancel(){

    },
    //刷新数据
    updateListData(id,sort){
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

  /*视频地址样式*/
  .video_url{
    display: inline-block;
    white-space: normal;
    width: 100px;
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /* 溢出用省略号*/
  }

</style>