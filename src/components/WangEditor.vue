<template>
  <div>
    <div
      ref="editorToolbar"
      style="text-align:left;background-color:#eee;border-top:1px solid #ccc;border-bottom:1px solid #ccc"
    />
    <div
      ref="editorArea"
      :style="`text-align:left;height:${height}px`"
    />
  </div>
</template>

<script>
import E from 'wangeditor';

export default {
  name: 'WangEditor',
  props: {
    height: {
      type: Number,
      default: 500,
    },
    content: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 挂载富文本编辑框
    const editor = new E(this.$refs.editorToolbar, this.$refs.editorArea);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.showLinkImg = false;
    editor.customConfig.debug = process.env.NODE_ENV === 'development';
    editor.customConfig.zIndex = 1;
    editor.customConfig.uploadImgServer = `${process.env.VUE_APP_API}sy/upload_multiple_image.html`;
    editor.customConfig.uploadImgMaxSize = 4 * 1024 * 1024;
    editor.customConfig.withCredentials = true;
    editor.customConfig.uploadImgParams = {
      dir: 'detailProduct',
    };
    editor.customConfig.uploadImgHooks = {
      customInsert(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        const pics = result.picPath;
        for (let i = 0; i < pics.length; i += 1) {
          const pic = pics[i];
          insertImg(pic);
        }

        // result 必须是一个 JSON 格式字符串！！！否则报错
      },
    };
    editor.customConfig.onchange = (html) => {
      this.$emit('update:html', html);
      this.$forceUpdate();
    };
    editor.create();
    editor.txt.html(this.content);
    if (this.disabled) {
      editor.$textElem.attr('contenteditable', false);
    }
  },
};
</script>
