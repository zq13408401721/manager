<template>
  <div>
    <v-modal title="修改节点"
             :visible="customTextVisible"
             @ok="customTextOk"
             @cancel="customTextCancel"
             ok-text="ok"
             cancel-text="Cancel">
      <v-input placeholder="节点名" v-model="name"></v-input>
    </v-modal>
    <br/>
  </div>
</template>

<script>
export default {
  name: "WidgetPopWin",
  props:['nodeName'],
  data () {
    return {
      customTextVisible: false,
      name:this.nodeName
    }
  },
  mounted() {
    this.$nextTick(function (){
      this.$on("showPopWindow",function (data){
        console.log("Data:"+data)
      })
    })
  },
  methods: {
    showCustomTextModal () {

    },

    customTextOk () {
      this.customTextVisible = false;
      if(this.name){
        this.$emit('select',this.name)
      }
    },

    customTextCancel () {
      this.customTextVisible = false;
    },

    showCustomTextConfirm(data) {
      this.$modal.confirm({
        title: '修改节点',
        content: data,
        okText: 'OK',
        cancelText: 'Cancel'
      })
      this.customTextVisible = true;
    },

  }
}
</script>

<style scoped>

</style>
