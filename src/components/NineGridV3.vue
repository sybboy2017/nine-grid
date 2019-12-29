<template>
  <div id="grid-box" ref="gridBox" 
  @touchmove.stop.prevent="onGridTouchMove($event)"
  @touchend.stop.prevent="onGridTouchEnd2($event)">
	<div class="grid-item" ref="gridItems" @touchstart.stop.prevent="onGridItemTouchStart2($event,n)"
	:style="{ backgroundImage : 'url(' + require(`../assets/images/cute_shafa_0${n}.png`) + ')'}" draggable="true" :key="n" v-for="n in numbersArray" :data-index="n">
	</div>
  </div>
</template>
<script>
export default {
  name: 'NineGridV3Component',
  data () {
    return {
      numbersArray:[1,2,3,4,5,6,7,8,9],
	  startOffsetX:0,
	  startOffsetY:0,
	  fromIndex:0,
	  toIndex:0,
	  cloneGridItem: null
    }
  },
  computed: {
	  
  },
  methods: {
	  onGridTouchMove(e){
		  if(this.cloneGridItem){
			  const touch = e.changedTouches[0];
			  this.cloneGridItem.style.top = Number(touch.pageY - this.startOffsetY) + 'px';
			  this.cloneGridItem.style.left = Number(touch.pageX - this.startOffsetX) + 'px';
		  }
	  },
	  onGridTouchEnd(e){
		  console.log('end before')
		  this.logRef();
		  this.toIndex = this.getMinIndexForCloneItem();
		   console.log(`fromIndex=>${this.fromIndex}`);
		  console.log(`toIndex=>${this.toIndex}`);
		  if(this.toIndex == this.fromIndex){
			  const fromGridItem = this.getRefItemByDataIndex(this.fromIndex + 1);
			  this.removeClass(fromGridItem,'moving');
			  this.changeGridItemBgImage(fromGridItem,this.fromIndex);
			  fromGridItem.setAttribute('data-index',this.fromIndex+1);
              if(this.cloneGridItem){
				 this.$refs.gridBox.removeChild(this.cloneGridItem);
				 this.cloneGridItem = null; 
			  }
		  }else{
			  const toGridItem = this.getRefItemByDataIndex(this.toIndex + 1);
			  const toCloneGridItem = this.cloneGridItemNode(this.toIndex);
			  const fromGridItem = this.getRefItemByDataIndex(this.fromIndex + 1);
			  
			  this.addClass(toGridItem,'moving');
			  this.cloneGridItem.style.top = toGridItem.style.top;
			  this.cloneGridItem.style.left = toGridItem.style.left;
			  
			  this.removeClass(toGridItem,'moving');
			  this.changeGridItemBgImage(toGridItem,this.fromIndex);
			  toGridItem.setAttribute('data-index',this.fromIndex+1);
			  if(this.cloneGridItem){
				 this.$refs.gridBox.removeChild(this.cloneGridItem);
				 this.cloneGridItem = null; 
			  }
			  
			 
			  toCloneGridItem.style.top = fromGridItem.style.top;
			  toCloneGridItem.style.left = fromGridItem.style.left;
			  
			  this.removeClass(fromGridItem,'moving');
			  this.changeGridItemBgImage(fromGridItem,this.toIndex);
			  fromGridItem.setAttribute('data-index',this.toIndex+1);
			  if(toCloneGridItem){
				 this.$refs.gridBox.removeChild(toCloneGridItem);
			  }
		  }
		  console.log('end after')
		  this.logRef();
	  },
	  onGridTouchEnd2(e){
	  		  console.log('end before')
	  		  this.logRef();
	  		  this.toIndex = this.getMinIndexForCloneItem2();
	  		  console.log(`fromIndex=>${this.fromIndex}`);
	  		  console.log(`toIndex=>${this.toIndex}`);
			  if(this.cloneGridItem){
			  	  				 this.$refs.gridBox.removeChild(this.cloneGridItem);
			  	  				 this.cloneGridItem = null; 
			  	  			  }
					const fromGridItem = this.$refs.gridItems[this.fromIndex];
			  this.removeClass(fromGridItem,'moving');
			  //this.changeGridItemBgImage(fromGridItem,this.fromIndex);

			  this.changeArrayItem(this.fromIndex,this.toIndex);
			  
	  		  console.log('end after')
	  		  this.logRef();
	  },
	  onGridItemTouchStart(e) {
		  const idx = Number(e.target.getAttribute('data-index')) - 1;
		  console.log(idx);
		  this.fromIndex = idx; 
		  
		  /* start position for current grid item element */
		  const touch = e.touches[0];
		  console.log(`start pageX=>${touch.pageX}`);
		  
		  console.log('start before')
		  this.logRef();
		  const gridItem = this.getRefItemByDataIndex(idx + 1);
		  console.log(`idx=>${idx}`);
		  this.startOffsetX = Number(touch.pageX - gridItem.offsetLeft);
		  this.startOffsetY = Number(touch.pageY - gridItem.offsetTop);
		  console.log(`start pageY=>${touch.pageY}`);

		  /* clone node */
		  this.cloneGridItem = this.cloneGridItemNode(idx);
		  
		  /* set origin node style */
		  const originGridItem = this.getRefItemByDataIndex(idx + 1);
		  console.log(`originitem=>${originGridItem}`);

		  this.addClass(originGridItem,'moving');
		  this.changeGridItemBgImage(originGridItem,-1);
		  console.log('start after')
		  this.logRef();
	  },
	  onGridItemTouchStart2(e, index) {
	  		  const idx = index - 1;
	  		  console.log(idx);
	  		  this.fromIndex = idx; 
	  		  
	  		  /* start position for current grid item element */
	  		  const touch = e.touches[0];
	  		  console.log(`start pageX=>${touch.pageX}`);
	  		  
	  		  console.log('start before')
	  		  this.logRef();
	  		  const gridItem = this.$refs.gridItems[idx];
	  		  console.log(`idx=>${idx}`);
	  		  this.startOffsetX = Number(touch.pageX - gridItem.offsetLeft);
	  		  this.startOffsetY = Number(touch.pageY - gridItem.offsetTop);
	  		  console.log(`start pageY=>${touch.pageY}`);
	  
	  		  /* clone node */
	  		  this.cloneGridItem = this.cloneGridItemNode2(idx);
	  		  
	  		  /* set origin node style */
	  		  const originGridItem = this.$refs.gridItems[idx];
	  		  console.log(`originitem=>${originGridItem}`);
	          this.addClass(originGridItem,'moving');
	          //this.changeGridItemBgImage(originGridItem,-1);
			  
	  		  console.log('start after')
	  		  this.logRef();
	  },
	  cloneGridItemNode(idx) {
		  console.log('clone before')
		  this.logRef();
		  const gridItem = this.getRefItemByDataIndex(idx + 1);
		  console.log(`clone node=>${gridItem}`);
		  const cloneGridItem = gridItem.cloneNode(true);
		  cloneGridItem.style.top = gridItem.style.top;
		  cloneGridItem.style.left = gridItem.style.left;
		  cloneGridItem.removeAttribute('data-index');
		  this.addClass(cloneGridItem,'draging');
		  this.$refs.gridBox.append(cloneGridItem);
		  console.log('clone after')
		  this.logRef();
		  return cloneGridItem;
	  },
	  cloneGridItemNode2(idx) {
	  		  console.log('clone before')
	  		  this.logRef();
	  		  const gridItem = this.$refs.gridItems[idx];
	  		  console.log(`clone node=>${gridItem}`);
	  		  const cloneGridItem = gridItem.cloneNode(true);
	  		  cloneGridItem.style.top = gridItem.style.top;
	  		  cloneGridItem.style.left = gridItem.style.left;
	  		  this.addClass(cloneGridItem,'draging');
	  		  this.$refs.gridBox.append(cloneGridItem);
	  		  console.log('clone after')
	  		  this.logRef();
	  		  return cloneGridItem;
	  },
	  getMinIndexForCloneItem(){
		  let minIndex = this.fromIndex;
		  let minValue = 1000;//min value for sort
		  for(let i = 0; i < this.$refs.gridItems.length; i++){
			  const currentItem = this.$refs.gridItems[i];
			  //get min disance item for moving item
			  const leftVal = Number(this.cloneGridItem.offsetLeft - currentItem.offsetLeft);
			  const topVal = Number(this.cloneGridItem.offsetTop - currentItem.offsetTop);
			  let smallDistance = Math.sqrt(Math.pow(leftVal, 2) + Math.pow(topVal, 2));
			  if (smallDistance < minValue) { 
				  minValue = smallDistance; 
				  minIndex = Number(currentItem.getAttribute('data-index')-1); 
			  }
		  }
		  return minIndex;
	  },
	  getMinIndexForCloneItem2(){
	  		  let minIndex = this.fromIndex;
	  		  let minValue = 1000;//min value for sort
	  		  for(let i = 0; i < this.$refs.gridItems.length; i++){
	  			  const currentItem = this.$refs.gridItems[i];
	  			  //get min disance item for moving item
	  			  const leftVal = Number(this.cloneGridItem.offsetLeft - currentItem.offsetLeft);
	  			  const topVal = Number(this.cloneGridItem.offsetTop - currentItem.offsetTop);
	  			  let smallDistance = Math.sqrt(Math.pow(leftVal, 2) + Math.pow(topVal, 2));
	  			  if (smallDistance < minValue) { 
	  				  minValue = smallDistance; 
	  				  minIndex = i; 
	  			  }
	  		  }
	  		  return minIndex;
	  },
	  changeArrayItem(fromIdx, toIdx) {
		 const fromVal = this.numbersArray[fromIdx - 1];
		 const toVal = this.numbersArray[toIdx - 1];
		 this.$set(this.numbersArray,fromIdx - 1,toVal);
		 this.$set(this.numbersArray,toIdx - 1,fromVal);
	  },
	  addClass(gridItem, className) {
		  if(!gridItem.classList.contains(className)){
		  	gridItem.classList.add(className)
		  }
	  },
	  removeClass(gridItem, className) {
		  if(gridItem.classList.contains(className)){
		  	gridItem.classList.remove(className)
		  }
	  },
	  changeGridItemBgImage(gridItem, idx){
		  debugger
		  console.log(`changeimg=>${idx}`);
		  const path = (idx > -1 && require('../assets/images/cute_shafa_0' + (idx + 1) + '.png'));
		  gridItem.style.backgroundImage = path ?'url(' + path + ')':'none';
	  },
	  getRefItemByDataIndex(index){
		  console.log(index);
		  console.log(this.$refs.gridItems);
		  return this.$refs.gridItems.filter(item => { return item.getAttribute('data-index') == index})[0];
	  },
	  logRef(){
		  this.$refs.gridItems.forEach(item => console.log(item.outerHTML))
	  }
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
	div.moving {
	    border: 1px dashed gray;
	    background: white;
		background-position: center center;
		background-repeat: no-repeat;
		opacity: .5;
	}
	
	div.draging {
	    position: absolute;
	    z-index: 2;
	}
</style>
