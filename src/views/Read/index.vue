<template>
  <div class="readWrapper">
    <header class="head">
      <span class="large-btn"
      @click="showTotal=true"
      >已阅读教程</span>
      <p v-if="showTotal">初载入的序列，一共{{dataList.length}}根线</p>
    </header>
    <section class="from-hear">
      <h2>这次从哪里开始呢？</h2>
      <div>
        从:
        <input type="number" v-model="hearVal" />开始(第一次就是从0开始)
      </div>
      <span class="large-btn hearbtn" @click="startHear">从这个位置开始</span>
      <p v-if="restHear!==''">本次剩余{{restHear}}根线</p>
    </section>
    <section class="from-line">
      <p>你也可以查看最后一根线是从几号钩子到几号钩子</p>
      <p>
        从:
        <input type="text" v-model="v1" />到
        <input type="text" v-model="v2" />
      </p>
      <span class="large-btn fromline" @click="startLine">从这个位置开始</span>
      <p v-if="restLine!==''">本次剩余{{restLine}}根线</p>
    </section>
    <section class="work-area">
      <h2>工作区</h2>
      <div>
        <span>
          时间间隔(秒):
          <input type="number" v-model="interval" />
        </span>
        <span>
          剩下：
          <strong id="rest">{{rest}}</strong>次
        </span>
      </div>
      <footer class="block-wrapper">
        <template v-if="isInit">
          <div :class="{block:true,gray:true}" v-for="(block,idx) in initval" :key="idx">
            <span>{{block.idx}}</span>
            <em>{{block.num+block.flag}}</em>
          </div>
        </template>
        <template v-else>
          <div
            :class="{block:true,gray:block.idx<pointer}"
            v-for="(block,idx) in blockData"
            :key="idx"
          >
            <span>{{block.idx}}</span>
            <em>{{block.num+block.flag}}</em>
          </div>
        </template>
      </footer>
    </section>
    <span :class="{'large-btn':true,red:isRead}" 
    @click="startRead">{{isRead?'暂停':'开始'}}</span>
    <footer class="foot">
      <h3>注意事项</h3>
      <p>电脑和手机浏览器使用请关闭设备的休眠，微信里面则不需要关闭</p>
      <p>刚开始把时间间隔调久一些，不然会手忙脚乱的：）</p>
    </footer>
  </div>
</template>
<script>
import {getDataList,isIos} from "@/util";
import storage from 'good-storage';

export default {
  name: "Read",
  data() {
    return {
      v1: "",
      v2: "",
      showTotal:false,
      interval: 3,
      hearVal: 0,
      pointer: 1,
      isInit: true,
      isfree: true,
      lastTime: +new Date(),
      rid:null,
      isRead:false,
      restLine:'',
      restHear:'',
      dataList:[],
      audio:null,
      initval: [
        { num: 0, flag: "", idx: 0 },
        { num: 0, flag: "", idx: 0 },
        { num: 0, flag: "", idx: 0 },
        { num: 0, flag: "", idx: 0 },
        { num: 0, flag: "", idx: 0 }
      ]
    };
  },
  created(){
    const isLog=storage.get('isLog');
    if(!isLog){
      this.$router.push('/');
    }else{
      const data=storage.get('numbers') || '';
      this.dataList=getDataList(data);
    }
  },
  mounted(){
      this.initAudio();
  },
  destroyed(){
    storage.remove('isLog');
    storage.remove('numbers');
  },
  computed: {
    blockData() {
      let arr=[];
      let len=0;
      const padList= [
        { num: 0, flag: "", idx: this.dataList.length+1 },
        { num: 0, flag: "", idx: this.dataList.length+2 },
        { num: 0, flag: "", idx: this.dataList.length+3 },
        { num: 0, flag: "", idx: this.dataList.length+4 },
        { num: 0, flag: "", idx: this.dataList.length+5},
      ]
      if (this.pointer === 1) {
        arr=this.initval.slice(0, 2).concat(this.dataList.slice(0, 3));
        len=arr.length;
      } else if (this.pointer === 2) {
        arr=this.initval.slice(0, 1).concat(this.dataList.slice(0, 4));
        len=arr.length;
      } else {
        arr=this.dataList.slice(this.pointer - 3, this.pointer + 2);
        len=arr.length;
      }
      return len<5?arr.concat(padList.slice(0, 5-len)):arr;
    },
    rest() {
      return this.dataList.length - this.pointer + 1;
    }
  },
  methods: {
    initAudio(){
      this.audio=new Audio();
      this.audio.onended = () => {
        this.isfree = true;
        this.lastTime = +new Date();
        this.pointer++;
        this.initAudio();
      };
    },
    startHear() {
      this.pointer = parseInt(this.hearVal) || 1;
      this.isInit = false;
      this.restHear = this.dataList.length-this.pointer+1;
      this.restLine='';
    },
    startLine() {
      let index = this.dataList.findIndex((item, idx) => {
        return (
          item.num + item.flag === this.v1 &&
          this.dataList[idx + 1].num + this.dataList[idx + 1].flag === this.v2
        );
      });
      this.pointer = index >= 0 ? index + 1 : this.pointer;
      this.restLine = index >= 0 ? this.dataList.length-this.pointer+1 : '';
      this.isInit = false;
      this.restHear='';
    },
    startRead() {
      if(this.isInit){
        this.pointer=1;
        this.isInit=false;
      }
      if(!this.isRead){
        this.readOne();
        this.readText();
        this.isRead=true;
      }else{
        this.isfree = true;
        this.isRead=false;
        cancelAnimationFrame(this.rid);
      }
    },
    readText() {
      let inter=(parseInt(this.interval) || 3)*1000;
      if (this.isfree) {
        var now = +new Date();
        if (now - this.lastTime >= inter) {
          this.lastTime = now;
          this.readOne();
        }
      }
      if (this.pointer<=this.dataList.length) {
        this.rid = requestAnimationFrame(this.readText);
      } else {
        this.isRead=false;
        this.isfree = false;
      }
    },
    readOne() {
      let item = this.dataList[this.pointer - 1];
      if (item && this.isfree) {
        this.isfree = false;
        let text = item.num + (item.flag === "+" ? "加" : (item.flag === "-"?"减":''));
        if(!isIos()){
          this.audio.innerHTML=this.getSource(text);
          this.audio.play();
        }else{
          if(window.speechSynthesis){
            var msg = new SpeechSynthesisUtterance(text);
            msg.onend = () => {
              this.isfree = true;
              this.lastTime = +new Date();
              this.pointer++;
            };
            window.speechSynthesis.speak(msg);
          }else{
            this.audio.innerHTML=this.getSource(text);
            this.audio.play();
          }
        }
      }
    },
    getSource(text){
      let src='https://ss0.baidu.com/6KAZsjip0QIZ8tyhnq/text2audio?tex='+text+'&cuid=dict&lan=zh&ctp=1&pdt=30&vol=100&spd=3';
      return `<source src=${src} type="audio/mp3">`
    }
  }
};
</script>

<style lang="scss" scoped>
$color:#4992DC;
.readWrapper{
  -webkit-overflow-scrolling: touch;
  padding: 2vw;
}
.large-btn {
  display: inline-block;
  border-radius: 4px;
  background-color: $color;
  color: #fff;
  font-size: 4vw;
  padding: 3vw 0;
  text-align: center;
  width: 100%;
}
.large-btn:active {
  background-color: $color;
}
.head {
  margin-bottom: 15vw;
}
.head >p{
  color:$color;
  text-align: center;
  margin-top:5px;
}
.from-hear,
.from-line,
.work-area {
  text-align: center;
}
.from-line >p:last-child{
  color:$color;
  margin-top:5px;
}
.from-hear >p:last-child{
  color:$color;
  margin-top:5px;
}
.from-hear h2,
.work-area h2 {
  color: #333;
  font-size: 5vw;
  margin-bottom: 2vw;
}
.from-hear > div,
.work-area > div {
  color: #666;
  font-size: 4vw;
}
.from-hear input,
.from-line input,
.work-area input {
  width: 12vw;
  border: 1px solid #e0dadc;
  margin: 0 0.5em;
  margin-bottom: 1.5vw;
  height: 6vw;
}
.from-line {
  margin-top: 15vw;
  margin-bottom: 15vw;
}
.from-line p {
  color: #666;
  font-size: 4vw;
}
.from-line p:nth-child(2) {
  margin-top: 2vw;
}
.work-area {
  margin-bottom: 5vw;
}
.work-area strong {
  color: red;
}
.work-area footer {
  display: flex;
}
.work-area .block {
  width: 20%;
  height: 20vw;
  background: $color;
  border-radius: 6px;
  text-align: center;
  position: relative;
  color: #000;
}
.block > em {
  font-size: 5vw;
  line-height: 20vw;
}
.block > span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 2vw;
}
.block.gray {
  background: #c7c7c7;
}
.foot {
  color: #666;
  font-size: 4vw;
  text-align: center;
  margin-top: 15vw;
  padding-bottom: 15vw;
}
.foot h3 {
  font-size: 5vw;
  color: #333;
  margin-bottom: 2vw;
}
.large-btn.red {
  background-color: #be2c1b;
}
</style>
