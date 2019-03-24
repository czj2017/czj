<template>
  <div class="goods">
       <div class="menu-wrapper" ref="menuWrapper"><!--v-el:menu-wrapper   v-el:foods-wrapper -->
        <ul>
          <li v-for="(item, index) in goods" :key="item.name" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook" :key="item.name">
            <h1 class="title">{{item.name}}</h1>
             <ul>
              <li v-for="food in item.foods" class="food-item" :key="food.name">
                <div class="icon">
                  <img :src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">
                    {{food.description}}
                  </p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span  class="old" v-show="food.oldPrice">
                      ￥{{food.oldPrice}}
                    </span>
                  </div>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
       :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
const ERR_OK = 0
export default {
  name: 'goods',
  props: {
    seller: {
      type: Object
    }
  },
  components:{
    shopcart ,
    cartcontrol
  },
  data () {
    return{
      goods: [],
      listHeight: [],
      scrollY: 0
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    this.$http.get('api/goods').then((res) => {
			res = res.data
			if(res.errno === ERR_OK){
        this.goods = res.data
        this.$nextTick(() => {
          // alert(1)
          this._initScroll()
          this._calcuateHeight()
        })
			}
		})
  },
  computed: {
    
    currentIndex () {
      for(let i=0; i<this.listHeight.length; i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if(!height2 ||( this.scrollY > height1 && this.scrollY < height2)){
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if(food.count){
            foods.push(food)
          }
        })
      })

      return foods
    }
  },
  methods: {
    selectMenu (index, event) {
      if(!event._constructed){
        return
      }
      let foodList =  this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper,{
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
         click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calcuateHeight () {
      let foodList =  this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for(let i = 0; i < foodList.length; i++){
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';
ul,li{
  list-style none
}
.goods{
  display flex
  position absolute
  top 174px
  width 100%
  bottom 46px
  overflow hidden
  .menu-wrapper{
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item{
      padding 0 12px
      display table
      height 54px
      width 56px
      line-height 14px
      .icon{
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        margin-left: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }
      .text{
        display table-cell
        width 56px
        vertical-align middle
        font-size 12px
        border-1px(rgba(7, 17,27,0.1))
      }
    }
    .current{
      background-color #fff;
      position relative
      z-index 10
      margin-top  -1px
      font-weight 700
      .text{
        border-none()
      }
    }

  }
  .foods-wrapper{
    flex 1
    .title{
      padding-left 14px
      height 26px
      line-height 26px
      font-size 12px
      border-left 2px solid #d9dded
      color rgb(147,153,159)
      background-color #f3f5f7
    }
    .food-item{
      display flex
      padding-bottom 18px
      margin 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-children{
        border-none()
        margin-bottom 0
      }
      .icon{
        flex 0 0 57px
        margin-right  7px
      }
      .cartcontrol-wrapper{
          position absolute 
          right 0
          bottom 12px
        }
      .content{
        flex 1
        .name{
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          font-size 14px
          color:rgb(7,17,27)
        }
        .desc,.extra{
          line-height 10px
          font-size 10px
          color:rgb(147,153,159)
        }
        .desc{
          margin-bottom 8px
          line-height 12px
        }
        .extra{
          & .count{
            margin-right 12px
          }
        }
        .price{
          font-weight 700
          line-height 24px
          .now{
            margin-right 8px
            font-size 14px
            color #ff0000
          }
          .old{
            margin-right 8px
            font-size 14px
            color rgb(147,153,159)
          }
        }
        
      }
    }
  }
  
}
</style>
