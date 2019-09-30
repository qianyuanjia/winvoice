<template>
  <div class="userWrapper">
    <header>
      <img :src="baseUrl+'/qsfx'+userInfo.img_url" alt v-if="userInfo.img_url"/>
    </header>
    <section>
      <figure @click="startMake">
        <Icon type="ios-build" />
        <figcaption>开始制作</figcaption>
      </figure>
      <figure>
        <Icon type="ios-cart" />
        <figcaption>购买画框</figcaption>
      </figure>
    </section>
    <ul>
      <li>
        <span>创作者</span>
        <span>{{userInfo.creators}}</span>
      </li>
      <li>
        <span>渲染时间</span>
        <span>{{userInfo.time}}</span>
      </li>
      <li>
        <span>适用画框</span>
        <span>{{userInfo.picture_frame}}mm</span>
      </li>
      <li>
        <span>是否公开？</span>
        <span>{{userInfo.is_public==1?'是':'否'}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { Icon} from "iview";
import storage from 'good-storage';
import moment from "moment";
moment.locale("zh-cn");
export default {
  name: "User",
  components: {
    Icon
  },
  data() {
    return {
      userInfo: {},
      orderCode:'',
      id:'',
      baseUrl:window.baseUrl
    };
  },
  created() {
    this.id=this.$route.query.id;
    if(!this.id){
      this.$router.push('/noid');
    }else{
      this.init();
    }
  },
  methods: {
    init() {
      this.getUserInfo();
    },
    getUserInfo() {
      this.$http.get("/getorder.php?id="+this.id).then(res => {
        if (res.data.code == 200) {
          const data = res.data.data;
          data.time = moment(data.time).format("YYYY年MM月DD日");
          this.userInfo = data;
        }
      });
    },
    startMake() {
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            props: {
              value: this.orderCode,
              autofocus: true,
              placeholder: "请输入订单号"
            },
            on: {
              input: val => {
                this.orderCode = val;
              }
            }
          });
        },
        onOk:()=>{
           this.$http.get('getnumber.php?id='+this.id+'&orderCode='+this.orderCode).then(res=>{
            if(res.data.code==200){
              const data=res.data.data;
              storage.set('numbers',data.number);
              storage.set('isLog',true);
              this.$router.push('/read');
            }else{
              this.$Message.error('订单号错误！')
              this.orderCode='';
            }
          })
        },
        onCancel:()=>{
          this.orderCode='';
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.userWrapper {
  padding-top: 15vw;
  > header {
    text-align: center;
    height: 60vw;
    > img {
      height:100%;
      width: 60vw;
      border-radius: 50%;
      border: 1px solid #ccc;
    }
  }
  > section {
    display: flex;
    justify-content: center;
    padding-top: 6vw;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 3vw;
    figure:nth-child(1) {
      margin-right: 10vw;
    }
    i {
      font-size: 6vw;
    }
    figcaption {
      margin-top: 1vw;
    }
  }
  > ul {
    padding-top: 5vw;
    li {
      display: flex;
      justify-content: space-between;
      padding: 3vw;
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>