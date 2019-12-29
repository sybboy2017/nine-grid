<template>
	<div>
		<p class="title">移动九宫格（原生版）</p>
		<nine-grid-v2-component></nine-grid-v2-component>
		<hr/>
		<div class="link">
			<router-link to="/"><font>← </font>组件版</router-link>
			<router-link to="/dom">原生版<font>→</font></router-link>
		</div>
	</div>
</template>

<script>
import NineGridV2Component from '../../../components/NineGridV2.vue';	
export default {
	data(){
		return {
			
		}
	},
	components: {
	   'nine-grid-v2-component': NineGridV2Component,
	},
}	
</script>

<style scoped>
	.title{
		font-size:1rem;
		text-align:center;
		line-height:5rem;
	}	
	hr{
		width:98%;
		margin:2rem auto;
	}
	.link{
		display:flex;
		width:98%;
		margin:0 auto;
		justify-content: space-between;
	}
	.link a{
		color:#42b983;
	}
	.link font{
		color:#808080;
	}
</style>
