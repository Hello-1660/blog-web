<script setup lang="ts">
import EditorBox from './EditorBox.vue'
</script>

<template>
  <div class="comment-container">
    <div class="comment-box">
      评论区
    </div>

    <div class="comment-input">
      <div class="comment-input-box">
        <EditorBox placeholder="请输入评论内容..." /> 
      </div>
      <button>发送</button>
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  position: fixed;
  top: 100px;
  right: -380px;
  z-index: 0;
  width: 380px;
  height: calc(100vh - 140px);
  background-color: yellow;
  transition: transform 0.3s ease;
}

.comment-box {
  width: 100%;
  height: calc(100% - 60px);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.comment-input {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}

.comment-input-box {
  width: calc(100% - 50px);
  margin-right: 10px;
  background-color: var(--show-bgc);
}
</style>