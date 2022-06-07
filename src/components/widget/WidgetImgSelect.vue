<template>
  <div>
    <Modal v-model="showModel" :title="title" @before-upload="handleUpload" @on-ok="ok" @on-cancel="cancel"
           @max-size="10240">
      上传封面图
      <Upload>
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
    </Modal>
  </div>
</template>

<script>

import {upLoadVideoCover} from "../../../utils/api"

export default {
  name: "WidgetImgSelect",
  data(){
    return {
      title:"",
      file:null,
      showModel:false
    }
  },
  mounted() {
    this.showModel = false
  },
  methods:{
    ok(){
      let param = new FormData() //创建表单数据
      param.append('file',this.file)
      upLoadVideoCover()
    },
    cancel(){

    },
    handleUpload(file){
      this.file = file
      return false
    },
    //文件上传完成
    uploadSuccess(response,file,fileList){
      console.log(response)
    }
  }
}
</script>

<style scoped>

</style>