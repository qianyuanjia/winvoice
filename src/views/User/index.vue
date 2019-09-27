<template>
  <div class="userWrapper">
    <header>
      <img src="https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/images-in-html/dinosaur_small.jpg" alt="">
    </header>
    <section>
      <figure>
        <Icon type="ios-build" />
        <figcaption>开始制作</figcaption>
      </figure>
      <figure>
        <Icon type="ios-cart" />
        <figcaption>购买画框</figcaption>
      </figure>
    </section>
    <ul>
      <li><span>创作者</span><span>Y</span></li>
      <li><span>渲染时间</span><span>2019年9月12日</span></li>
      <li><span>适用画框</span><span>360mm</span></li>
      <li><span>是否公开？</span><span>否</span></li>
    </ul>
  </div>
</template>
<script>
  import {Icon} from 'iview';
  export default {
    name:'User',
    components:{
      Icon
    }
  }
</script>
<style lang="scss" scoped>
.userWrapper{
  >header{
    text-align:center;
    padding-top:15vw;
    >img{
      height:60vw;
      width:60vw;
      border-radius: 50%;
      border:1px solid #ccc;
    }
  }
  >section{
    display: flex;
    justify-content: center;
    padding-top: 6vw;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 3vw;
    figure:nth-child(1){
      margin-right: 10vw;
    }
    i{
      font-size:6vw;
    }
    figcaption{
      margin-top: 1vw;
    }
  }
  >ul{
    padding-top: 5vw;
    li{
      display: flex;
      justify-content: space-between;
      padding:3vw;
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>