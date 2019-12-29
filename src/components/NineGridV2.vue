<template>
  <div id="grid-box" ref="gridBox" 
  @touchmove.stop.prevent="onGridTouchMove($event)"
  @touchend.stop.prevent="onGridTouchEnd($event)">
	<div class="grid-item" ref="gridItems" @touchstart.stop.prevent="onGridItemTouchStart"
	 draggable="true" :key="n" v-for="n in numbersArray" :data-item="n">
	 {{n}}
	</div>
  </div>
</template>
<script>
export default {
  name: 'NineGridV2Component',
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
  created(){
	  console.log(`data init => ${this.numbersArray}`);
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
		  const gridBox = document.getElementById('grid-box');
		  const maxDistance = Number(gridBox.offsetHeight + gridBox.offsetTop); 
		  
		  const touch = e.changedTouches[0];
		  if(touch.pageY < gridBox.offsetTop || touch.pageY > maxDistance){
			  this.resetOriginGridItem();
			  return;
		  }
		  this.toIndex = this.getMinIndexForCloneItem();
		  console.log(`fromValue=>${this.fromIndex + 1}`);
		  console.log(`toValue=>${this.toIndex + 1}`);
		  if(this.toIndex == this.fromIndex){
			  this.resetOriginGridItem();
			  return;
		  }else{
			  const toGridItem = this.getRefItemByDataIndex(this.toIndex + 1);
			  const toCloneGridItem = this.cloneGridItemNode(this.toIndex);
			  const fromGridItem = this.getRefItemByDataIndex(this.fromIndex + 1);
			  
			  this.addClass(toGridItem,'moving');
			  this.resetGridItem(toGridItem,this.fromIndex,this.cloneGridItem);
			  this.resetGridItem(fromGridItem,this.toIndex,toCloneGridItem); 
		  }
		  this.changeArrayItem(this.fromIndex + 1,this.toIndex +1);
		  console.log(`data changed =>${this.numbersArray}`);
	  },
	  onGridItemTouchStart(e) {
		  const idx = Number(e.target.getAttribute('data-item')) - 1;
		  console.log(idx);
		  this.fromIndex = idx; 
		  
		  /* start position for current grid item element */
		  const touch = e.touches[0];
		  console.log(`start pageX=>${touch.pageX}`);
		  const gridItem = this.getRefItemByDataIndex(idx + 1);
		  this.startOffsetX = Number(touch.pageX - gridItem.offsetLeft);
		  this.startOffsetY = Number(touch.pageY - gridItem.offsetTop);
		  console.log(`start pageY=>${touch.pageY}`);

		  /* clone node */
		  this.cloneGridItem = this.cloneGridItemNode(idx);
		  
		  /* set origin node style */
		  const originGridItem = this.getRefItemByDataIndex(idx + 1);
		  this.addClass(originGridItem,'moving');
		  this.changeGridItemNumber(originGridItem,-1);
	  },
	  cloneGridItemNode(idx) {
		  const gridItem = this.getRefItemByDataIndex(idx + 1);
		  console.log(`clone node=>${gridItem}`);
		  const cloneGridItem = gridItem.cloneNode(true);
		  cloneGridItem.style.top = gridItem.style.top;
		  cloneGridItem.style.left = gridItem.style.left;
		  cloneGridItem.removeAttribute('data-item');
		  this.addClass(cloneGridItem,'draging');
		  this.$refs.gridBox.append(cloneGridItem);
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
			  if (smallDistance <  minValue) { 
				  minValue = smallDistance; 
				  minIndex = Number(currentItem.getAttribute('data-item')-1); 
			  }
		  }
		  return minIndex;
	  },
	  changeArrayItem(fromVal, toVal) {
		 const fromIdx = this.numbersArray.indexOf(fromVal);
		 const toIdx = this.numbersArray.indexOf(toVal);
		 //only update data,so not $set
		 this.numbersArray[fromIdx] = toVal;
		 this.numbersArray[toIdx] = fromVal;
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
		  const path = (idx > -1 && require('../assets/images/cute_shafa_0' + (idx + 1) + '.png'));
		  gridItem.style.backgroundImage = path ?'url(' + path + ')':'none';
	  },
	  changeGridItemNumber(gridItem, idx){
	  	  gridItem.innerHTML = idx > -1 ? idx + 1 + '':'';
	  },
	  getRefItemByDataIndex(index){
		  return this.$refs.gridItems.filter(item => { return item.getAttribute('data-item') == index})[0];
	  },
	  resetOriginGridItem(){
		  const fromGridItem = this.getRefItemByDataIndex(this.fromIndex + 1);
		  this.resetGridItem(fromGridItem,this.fromIndex,this.cloneGridItem);
	  },
	  resetGridItem(gridItem, index, cloneGridItem){
		  cloneGridItem.style.top = gridItem.style.top;
		  cloneGridItem.style.left = gridItem.style.left;
		  this.removeClass(gridItem,'moving');
		  //this.changeGridItemBgImage(gridItem,index);
		  this.changeGridItemNumber(gridItem,index);
		  gridItem.setAttribute('data-item',index + 1);
		  if(cloneGridItem){
		  	this.$refs.gridBox.removeChild(cloneGridItem);
		  	cloneGridItem = null; 
		  }
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
		line-height:241.82px;
        border-radius: 10px;
        float: left;
		margin:.1rem;
		background:#fff;
		background-position: center center;
		background-repeat: no-repeat;
        border: 1px solid #ccc;
        z-index: 1;
        cursor: move;
		text-align:center;
		font-size:4rem;
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
