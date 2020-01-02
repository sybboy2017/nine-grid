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
import { _throttle } from '../lib/util'
export default {
  name: 'NineGridV2Component',
  data () {
    return {
      numbersArray:[1,2,3,4,5,6,7,8,9],
	  // startOffsetX:0,
	  // startOffsetY:0,
	  startX:0,
	  startY:0,
	  fromValue:'',
	  toValue:'',
	  cloneGridItem: null,
	  toCloneGridItem: null,
	  maxBoxDistance:0,
	  minBoxDistance:0,
    }
  },
  created(){
	  console.log(`data init => ${this.numbersArray}`);
  },
  mounted(){
	  const gridBox = document.getElementById('grid-box');
	  this.minBoxDistance = gridBox.offsetTop;
	  this.maxBoxDistance = gridBox.offsetHeight + gridBox.offsetTop; 
  },
  methods: {
	  onGridItemTouchStart(e) {
	  		  const value = Number(e.target.getAttribute('data-item'));
	  		  this.fromValue = value; 
	  		  
	  		  /* start position for current grid item element */
	  		  const touch = e.touches[0];
	  		  const gridItem = this.getRefItemByDataItem(value);
	  		  // this.startOffsetX = Number(touch.pageX - gridItem.offsetLeft);
	  		  // this.startOffsetY = Number(touch.pageY - gridItem.offsetTop);
			  this.startX = touch.pageX;
			  this.startY = touch.pageY;
	  
	  		  /* clone node */
	  		  this.cloneGridItem = this.cloneGridItemNode(value);
	  		  
	  		  /* set origin node style */
	  		  const originGridItem = this.getRefItemByDataItem(value);
	  		  this.addClass(originGridItem,'moving');
	  		  this.changeGridItemNumber(originGridItem,'');
	  },
	  onGridTouchMove: _throttle('touchMoveHander',350),
	  // onGridTouchMove: function(e){
		 //  this.touchMoveHander(e)
	  // },
	  touchMoveHander(e) {
		  if(!this.fromValue) return;
		  const touch = e.changedTouches[0];
		  const moveDisX = Number(touch.pageX - this.startX);
		  const moveDisY = Number(touch.pageY - this.startY);
		  if(this.cloneGridItem){
		  		// this.cloneGridItem.style.top = Number(touch.pageY - this.startOffsetY) + 'px';
		  		// this.cloneGridItem.style.left = Number(touch.pageX - this.startOffsetX) + 'px';
				this.transformGridItem(this.cloneGridItem,moveDisX,moveDisY);
		  }
		  this.toValue = this.getMinItemForCloneItem(moveDisX, moveDisY);
		  // console.log(`fromValue=>${this.fromValue}`);
		  // console.log(`toValue=>${this.toValue}`);
		  if(this.toValue != this.fromValue && touch.pageY > this.minBoxDistance 
		      && touch.pageY < this.maxBoxDistance){
			  const toGridItem = this.getRefItemByDataItem(this.toValue);
			  if(!this.toCloneGridItem){
				  this.toCloneGridItem = this.cloneGridItemNode(this.toValue);
			  }
			  const fromGridItem = this.getRefItemByDataItem(this.fromValue);
			  
			  //remove class moving
			  this.$refs.gridItems.forEach(item => {
				  const itemValue = Number(item.getAttribute('data-item'));
				  this.removeClass(item,'moving');
				  if(this.toValue == itemValue && !item.classList.contains('draging')){
					  this.addClass(toGridItem,'moving');
					  this.changeGridItemNumber(toGridItem, '');
				  } 
			  });
			  if(this.cloneGridItem){
				  this.resetGridItem(toGridItem,this.fromValue,this.cloneGridItem);
			  }
			  this.resetGridItem(fromGridItem,this.toValue,this.toCloneGridItem);
			  this.clearCloneNode(this.toCloneGridItem);
		  } 
	  },
	  onGridTouchEnd(e){
		  this.clearCloneNode(this.cloneGridItem);
		  
		  const fromGridItem = this.getRefItemByDataItem(this.fromValue);
		  this.removeClass(fromGridItem,'moving');
		  this.changeGridItemNumber(fromGridItem,this.fromValue);
		  if(this.toValue){
			  const toGridItem = this.getRefItemByDataItem(this.toValue);
			  this.removeClass(toGridItem, 'moving');
			  //this.changeGridItemNumber(toGridItem,this.fromValue);
		  }
		 
		  const touch = e.changedTouches[0];
		  if(!this.toValue || this.toValue == this.fromValue || touch.pageY < this.minBoxDistance 
		      || touch.pageY > this.maxBoxDistance){
			  this.resetOriginGridItem();
			  this.fromValue = '';
			  this.toValue = '';
			  return;
		  }
		  this.changeArrayItem(this.fromValue,this.toValue);
		  console.log(`data changed =>${this.numbersArray}`);
	  },
	  cloneGridItemNode(value) {
		  const gridItem = this.getRefItemByDataItem(value);
		  const cloneGridItem = gridItem.cloneNode(true);
		  cloneGridItem.style.top = gridItem.offsetTop + 'px';
		  cloneGridItem.style.left = gridItem.offsetLeft + 'px';
		  cloneGridItem.removeAttribute('data-item');
		  this.addClass(cloneGridItem,'draging');
		  this.$refs.gridBox.append(cloneGridItem);
		  return cloneGridItem;
	  },
	  getMinItemForCloneItem(moveDisX, moveDisY){
		  let minValue = this.fromValue;
		  let minDistance = 1000;//min value for sort
		  for(let i = 0; i < this.$refs.gridItems.length; i++){
			  const currentItem = this.$refs.gridItems[i];
			  //get min disance item for moving item
			  const leftVal = Number(this.cloneGridItem.offsetLeft + moveDisX - currentItem.offsetLeft);
			  const topVal = Number(this.cloneGridItem.offsetTop + moveDisY - currentItem.offsetTop);
			  let smallDistance = Math.sqrt(Math.pow(leftVal, 2) + Math.pow(topVal, 2));
			  if (smallDistance <  minDistance) { 
				  minDistance = smallDistance; 
				  minValue =  Number(currentItem.getAttribute('data-item'));
			  }
		  }
		  return minValue;
	  },
	  changeArrayItem(fromVal, toVal) {
		 const fromIdx = this.numbersArray.indexOf(fromVal);
		 const toIdx = this.numbersArray.indexOf(toVal);
		 //only update data,so not $set
		 this.numbersArray[fromIdx] = toVal;
		 this.numbersArray[toIdx] = fromVal;
		 
		 this.fromValue = '';
		 this.toValue = '';
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
	  changeGridItemNumber(gridItem, value = ''){
	  	  gridItem.innerHTML = value;
	  },
	  getRefItemByDataItem(value){
		  return this.$refs.gridItems.filter(item => { return item.getAttribute('data-item') == value})[0];
	  },
	  resetOriginGridItem(){
		  const fromGridItem = this.getRefItemByDataItem(this.fromValue);
		  this.resetGridItem(fromGridItem,this.fromValue,this.cloneGridItem);
		  this.removeClass(fromGridItem,'moving');
	  },
	  resetGridItem(gridItem, value, cloneGridItem){
		  // cloneGridItem.style.top = gridItem.style.top;
		  // cloneGridItem.style.left = gridItem.style.left;
		  const moveDisX = Number(gridItem.offsetLeft - cloneGridItem.offsetLeft);
		  const moveDisY = Number(gridItem.offsetTop - cloneGridItem.offsetTop);
		  this.transformGridItem(cloneGridItem,moveDisX,moveDisY);
		  cloneGridItem.style.zIndex = 2;
		  if(!gridItem.classList.contains('moving')){
			  this.changeGridItemNumber(gridItem,value);
		  }
		  gridItem.setAttribute('data-item',value);
	  },
	  clearCloneNode(cloneGridItem){
		  if(cloneGridItem && this.$refs.gridBox.contains(cloneGridItem)){
		  	this.$refs.gridBox.removeChild(cloneGridItem);
		  	cloneGridItem = null; 
		  }
	  },
	  transformGridItem(gridItem,x,y){
		  gridItem.style.webkitTransform = 'translate(' + x + 'px,' + y + 'px)';
		  gridItem.style.transition = 'transform .3s ease-in-out';
	  },
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
	    z-index: 3;
	}
</style>
