<script setup lang="ts">
const prop = defineProps<{
  type: {
    del: Boolean, 
    update: Boolean
  },
  id: number
}>()

const emit = defineEmits(['delClick', 'updateClick'])
const handleDelClick = (e: Event) => {
  e.stopPropagation()
  emit('delClick', prop.id)
}

const handleUpdateClick = (e: Event) => {
  e.stopPropagation()
  emit('updateClick', prop.id)
}
</script>

<template>
  <div class="function-list-container">
    <div @click="handleDelClick" v-if="prop.type.del">
      <svg t="1781249770705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4977" width="200" height="200"><path d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56z m-421.6-725.92a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72v-34.56a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4H956.8a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0V768.8a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a35.36 35.36 0 0 0 35.36 35.36" p-id="4978"></path></svg>
    </div>

    <div @click="handleUpdateClick" v-if="prop.type.update">
      <svg t="1781250224086" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6148" width="200" height="200"><path d="M469.333333 128a42.666667 42.666667 0 0 1 0 85.333333H213.333333v597.333334h597.333334v-256l0.298666-4.992A42.666667 42.666667 0 0 1 896 554.666667v256a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z m414.72 12.501333a42.666667 42.666667 0 0 1 0 60.330667L491.861333 593.066667a42.666667 42.666667 0 0 1-60.330666-60.330667l392.192-392.192a42.666667 42.666667 0 0 1 60.330666 0z" p-id="6149"></path></svg>
    </div>
  </div>
</template>

<style scoped>
.function-list-container {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: rgba(139, 139, 139, 0.194);
}

.function-list-container>div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin: 0 10px 0 0;
  background-color: #a6a6a64c;
  border-radius: 50%;
}

.function-list-container .icon {
  width: 60%;
  height: 60%;
  fill: var(--show-bgc);
  cursor: pointer;
}
</style>