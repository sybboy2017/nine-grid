<template>
  <div id="grid-box">
	<draggable v-model="numbersArray" @start="drag=true" @end="drag=false" v-bind="dragOptions">
		<transition-group type="transition">
			<div class="grid-item" :style="{ backgroundImage : 'url(' + require(`../assets/images/cute_shafa_0${n}.png`) + ')'}" draggable="true" :key="n" v-for="n in numbersArray">
			</div>
		</transition-group>
	</draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: 'NineGridComponent',
  components:{
	draggable,
  },
  data () {
    return {
      numbersArray:[1,2,3,4,5,6,7,8,9],
    }
  },
  computed: {
	  dragOptions() {
		return {
		  animation: 0,
		  disabled: false,
		  ghostClass: "curr-background"
		}
	  }
  },
  method () {
	  
  },
  created () { 
    
  }
}
</script>

<style scoped>
    
    #grid-box {
        margin: 0 auto;
        width: 98%;
        height: 730px;
        position: relative;
    }
	
    div.grid-item {
        width: 32%;
        height: 241.82px;
        border-radius: 10px;
        float: left;
		margin:.1rem;
		background:#fff;
		background-position: center center;
		background-repeat: no-repeat;
        border: 1px solid #ccc;
        z-index: 1;
        cursor: move;
    }
	.curr-background {
	  opacity: 0.5;
	  background: #c8ebfb;
	}
</style>
