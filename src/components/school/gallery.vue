<template>
  <div>
    <van-tabs @click="clickTabs">
      <van-tab title="图库分类">
        <Row v-show="isShowRoot" style="margin-top: 10px;line-height: 40px;">
          <Col span="8">
            <van-field v-model="rootName" placeholder="请输入根节点"/>
          </Col>
          <Col span="4" style="height:40px;line-height: 40px">
            <Button style="vertical-align: middle" type="primary" @click="createRoot">创建根节点</Button>
          </Col>
          <Col span="12" style="text-align:left;vertical-align: middle">
            <v-dropdown :data="rootNodes" @item-click="rootNodeClick">
              <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                <span class="tag_font">选择根节点</span> <v-icon type="down"></v-icon>
              </a>
            </v-dropdown>
            <span style="font-size: 16px;">{{currentRootNode.content}}</span>
            <Button type="primary" style="margin-left: 10px;" @click="editRoot">编辑</Button>
            <Button type="primary" style="margin-left: 10px;" @click="deleteRoot">删除</Button>
          </Col>
        </Row>
        <Row class="modify-row">
          <Col span="16" class="item">节点</Col>
          <Col span="4" class="item">排序</Col>
          <Col span="4" class="item">操作</Col>
        </Row>
        <div class="scrollbar">
          <Tree :render="renderContent" v-if="isRouterAlive" :data="ClassifyData" class="tree-render">
          </Tree>
        </div>
      </van-tab>
      <van-tab title="上传图片">
        <GalleryUpload :treeData="ClassifyData"/>
      </van-tab>
      <van-tab title="图片列表">
        <GalleryList ref="galleryList" />
      </van-tab>
    </van-tabs>

    <NodePopWin ref="popwin" @select="popWinCB" :nodeName="currentNode"/>
  </div>
</template>

<script>
import {addGalleryCategory, deleteGalleryCategory, getGalleryCategoryList, updateGalleryCategory} from "../../../utils/api";

import {Toast} from 'vant'

import NodePopWin from '../widget/WidgetPopWin'
import GalleryUpload from '../widget/WidgetGalleryUpLoad'
import GalleryList from '../widget/WidgetGalleryList'

export default {
name: "gallery",
  components:{
    GalleryList,
    NodePopWin,
    GalleryUpload
  },
  provide(){
    return {
      reload:this.reload
    }
  },
  data(){
    return {
      isRouterAlive:true,
      rootName:"",
      parseNodeId:0,
      currentSelect:1,
      currentNode:"",
      currentNodeKey:0,
      currentNodeId:0,
      isEditor:false,
      rootNodes:[],
      currentRootNode:{},
      renderFun:(h, { root, node, data }) => {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.name)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: 'primary'
              }),
              style: {
                marginLeft:'30px',
                width: '64px'
              },
              on: {
                click: () =>this.showNodeDialog(false,data)
              }
            }),
          ])
        ]);
      },
      categoryArr:[],
      ClassifyData:[],
      isShowRoot:true, //是否显示创建根节点按钮
    }
  },
  mounted() {
    this.categoryList()
  },
  methods:{

    clickTabs(obj){
      console.log(obj)
      if(obj == 2){
        this.$refs.galleryList.loadList()
      }
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function (){
        this.isRouterAlive = true
      })
    },
    //根节点点击
    rootNodeClick(data){
      console.log("root click id"+data.id)
      this.currentRootNode = data
    },
    editRoot(){  //编辑根节点
      this.showNodeDialog(true,this.currentRootNode)
    },
    deleteRoot(){  //删除根节点
      if(this.currentRootNode.id != undefined){
        this.deleteNode(this.currentRootNode)
      }
    },
    //创建根节点
    createRoot(){
      console.log("创建根节点");
      if(!this.rootName){
        Toast("请输入正确的节点名")
        return
      }
      var category_create = {
        name:this.rootName,
        pid:0,
        sort:0
      }
      addGalleryCategory(category_create).then(res => {
        console.log("创建节点成功："+res);
        this.categoryArr = this.ClassifyData
        //this.rootNodes.push({id:res.data.data.id,content:res.data.data.name,name:res.data.data.name})
        this.parseCategory([res.data.data])
        this.ClassifyData = this.categoryArr
        this.reload()
      }).catch(err => {
        console.log("创建节点失败");
      })
    },
    categoryList(){
      //异步获取结果
      getGalleryCategoryList().then(res =>{
        console.log("getGalleryCategoryList:"+res.data)
        if(res.data.data.length == 0){
          this.isShowRoot = true
        }else{
          this.categoryArr = []
          this.rootNodes = []
          this.parseCategory(res.data.data)
          this.ClassifyData = this.categoryArr
        }
      }).catch(err => {
        console.log("getGalleryCategoryList error:"+err)
      })
    },

    parseCategory(arr){
      let lg = arr.length;
      for(var i=0; i<lg; i++){
        if(arr[i].pid == 0){
          var item = {
            name:arr[i].name,
            expand:true,
            id:arr[i].id,
            sort:arr[i].sort,
            pid:0,
            render:this.renderFun
          }
          if(this.currentRootNode.id == undefined){
            this.currentRootNode = {id:item.id,content:item.name,name:item.name}
          }
          this.rootNodes.push({id:item.id,content:item.name,name:item.name})
          this.categoryArr.push(item)
          arr.splice(i,1)
          i--;
          lg--;
        }else{
          const category = this.getCategoryArrItem(this.categoryArr,arr[i].pid)
          if(category){ //找到了对应的父节点
            var node = {
              name:arr[i].name,
              expand:true,
              id:arr[i].id,
              sort:arr[i].sort,
              pid:arr[i].pid
            }
            if(category.children == undefined){
              category.children = []
            }
            category.children.push(node)
            arr.splice(i,1)
            i--;
            lg--;
          }
        }
      }
      if(arr.length > 0){
        console.log("arr length:"+arr.length)
        this.parseCategory(arr)
      }
    },

    //获取章节的数据
    getCategoryArrItem(arr,id){
      for(var i=0; i<arr.length; i++){
        if(arr[i].id == id){
          return arr[i]
        }else{
          if(arr[i].children && arr[i].children.length > 0){
            var result = this.getCategoryArrItem(arr[i].children,id)
            if(result){
              return result
            }
          }
        }
      }
    },
    selectClassify(index){
      this.currentSelect = index
    },

    //节点修改名字返回
    popWinCB(nodename){
      console.log(nodename)
      //网络请求
      if(this.isEditor){
        //编辑
        var category_editor = {
          name:nodename,
          id:this.currentNodeId
        }
        updateGalleryCategory(category_editor).then(res => {
          console.log("更新节点成功")
          var node = this.getCategoryArrItem(this.ClassifyData,res.data.data.id)
          if(node){
            if(res.data.data.sort){
              node.sort = res.data.data.sort
            }else if(res.data.data.name){
              node.name = res.data.data.name
            }
            //如果修改的是根节点，把当前对根节点的引用一起修改
            if(this.currentRootNode && this.currentRootNode.id == res.data.data.id){
              this.currentRootNode.name = res.data.data.name
            }
            this.reload()
          }
        }).catch(err => {
          console.log("更新节点失败")
        })
      }else{
        //创建
        var category_create = {
          name:nodename,
          pid:this.currentNodeId,
          sort:0
        }
        addGalleryCategory(category_create).then(res => {
          console.log("创建节点成功："+res);
          this.categoryArr = this.ClassifyData
          this.parseCategory([res.data.data])
          this.ClassifyData = this.categoryArr
          this.reload()
        }).catch(err => {
          console.log("创建节点失败");
        })
      }
      //刷新对应的节点
      //this.updateNodeName(this.ClassifyData,nodename,this.currentNodeId)
    },
    //更新节点名
    updateNodeName(arr,name,nodeKey){
      if(arr.length == 0) return
      for(var i=0; i<arr.length; i++){
        if(arr[i].nodeKey == nodeKey){
          return
        }else{
          if(arr[i].children && arr[i].children.length){
            this.updateNodeName(arr[i].children,name,nodeKey)
          }
        }
      }
    },

    //删除节点
    deleteNode(data){

      var deleteIds = []
      var node = this.getCategoryArrItem(this.ClassifyData,data.id)
      if(node){
        deleteIds.push(node.id)
        var result = this.getAllChildrenNode(node)
        for(var i=0; i<result.length; i++){
          deleteIds.push(result[i])
        }
        console.log("delete:"+JSON.stringify(deleteIds))
        const option = {
          ids:JSON.stringify(deleteIds)
        }
        deleteGalleryCategory(option).then(res => {
          if(res.data.data.number > 0){
            this.deleteTreeNodeById(node.id)
            console.log("delete succes:"+res)
            if(this.currentRootNode && this.currentRootNode.id == node.id){
              for(var i=0; i<this.rootNodes.length; i++){
                if(this.rootNodes[i].id == node.id){
                  this.rootNodes.splice(i,1)
                  break
                }
              }
              if(this.rootNodes.length > 0){
                this.currentRootNode = this.rootNodes[0]
              }
            }
            this.reload()
          }
        }).catch(err => {
          console.log("delete category:"+err)
        })
      }
    },

    //计算能删除的节点数据
    getAllChildrenNode(node){
      var nds = []
      if(node.children){
        for(var i=0; i<node.children.length; i++){
          nds.push(node.children[i].id)
          if(node.children[i].children && node.children[i].children.length > 0){
            var result = this.getAllChildrenNode(node.children[i])
            for(var j=0; j<result.length; j++){
              nds.push(result[j])
            }
          }
        }
      }
      return nds
    },

    //删除tree节点
    deleteTreeNodeById(id){
      this.findTreeNodeById(this.ClassifyData,id)
    },

    //删除tree中的节点 arr当前tree对应的数据 id删除的id
    findTreeNodeById(arr,id){
      for(var i=0; i<arr.length; i++){
        if(arr[i].id == id){
          arr.splice(i,1)
          return
        }else{
          if(arr[i].children && arr[i].children.length > 0){
            this.findTreeNodeById(arr[i].children,id)
          }
        }
      }
    },

    //显示节点操作的弹框 bool true编辑 false创建
    showNodeDialog(bool,nd){
      console.log("node click:"+nd.name)
      this.isEditor = bool
      this.currentNodeId = nd.id
      this.$refs.popwin.showCustomTextConfirm(nd.name)
    },

    // 封面图上传成功
    uploadCoverImgComplete(imgData){
      console.log(imgData)
    },

    /**
     * 树形结构编辑
     * @param h
     * @param root
     * @param node
     * @param data
     * @returns {*}
     */
    renderContent (h, { root, node, data }) {
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
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.name)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px',
          }
        }, [
          h('Button', {
            domProps:{
              value:"编辑",
              innerHTML:'编辑'
            },
            style: {
              marginRight: '20px'
            },
            on: {
              click:()=>this.showNodeDialog(true,data)
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => this.showNodeDialog(false,data)
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => this.deleteNode(data)
            }
          })
        ])
      ]);
    },
    append (data) {
      const children = data.children || [];
      children.push({
        title: 'appended node',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.tag_font{
  font-size: 14px;
  color: #2c3e50;
  margin: 0px 5px;
}
.scrollbar{
  height: 500px;
  overflow-y: auto;
  text-align: left;
}
.scrollbar Tree{
  height: 500px;
}
.tree-render{
  width: 100%;
}
</style>
