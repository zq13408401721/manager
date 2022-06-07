<template>
  <!--tree章节选择-->
  <div>
    <Modal v-model="showTree" :title="title" @on-ok="treeOK">
      <div class="scrollbar">
        <Tree :render="renderTreeContent" v-if="isTree" :data="treeNodes" class="tree-render tree">
        </Tree>
      </div>
    </Modal>
  </div>
</template>

<script>

//import {Toast} from "vant"

export default {
  name: "WidgetTreeNode",
  props:{

  },
  data(){
    return{
      title:"",
      isTree:true,
      showTree:true,
      treeNodes:[],
      cId:0, //当前的节点id
      cName:"", //当前节点名
    }
  },
  methods:{


  }
}
</script>

<style scoped>



</style>