<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{horizontal, collapsable}">
      <org-tree-node
        :data="data"
        :props="props"
        :horizontal="horizontal"
        :label-width="labelWidth"
        :collapsable="collapsable"
        :render-content="renderContent"
        :label-class-name="labelClassName"
        @on-expand="$emit('on-expand', $event)"
        @on-node-click="(e, data) => {$emit('on-node-click', e, data)}"
        @on-relation-click="(e, data) => {$emit('on-relation-click', e, data)}"
        @on-del-click="(e, data) => {$emit('on-del-click', e, data)}"
        @on-del-child="(e, data) => {$emit('on-del-child', e, data)}"
        @on-dragstart="(e, data) => {$emit('on-dragstart', e, data)}"
        @on-dragover="(e, data) => {$emit('on-dragover', e, data)}"
        @on-drop="(e, data) => {$emit('on-drop', e, data)}"
      ></org-tree-node>
    </div>
  </div>
</template>

<script>
import render from './node'

export default {
  name: 'OrgTree',
  components: {
    OrgTreeNode: {
      render,
      functional: true
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        expand: 'expand',
        children: 'children',
        root: 'root',
        relation: 'relation'
      })
    },
    horizontal: Boolean,
    collapsable: Boolean,
    renderContent: Function,
    labelWidth: [String, Number],
    labelClassName: [Function, String]
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'example/styles/org-tree';
</style>
