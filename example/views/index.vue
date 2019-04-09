<template>
	<div class="index-page">
		<org-tree
			ref="orgTree"
			:data="data"
			:horizontal="true"
			:collapsable="false"
			:label-class-name="labelClassName"
			:render-content="renderContent">
		</org-tree>
	</div>
</template>

<script>
import OrgTree from '@/components/org-tree'
export default {
	name: 'index-page',
	data () {
		return {
			data: {
				label: '钆卤',
				children: [
					{
						label: 'lalal',
						children: []
					},
					{
						label: 'kakakak',
						children: []
					}
				]
			},
      labelClassName: 'bg_white'
		}
	},
	components: {
		OrgTree
	},
	methods: {
		renderContent (h, data) {
      return data.label
    }
	}
}
</script>

<style lang="scss">
.index-page {
}
</style>
