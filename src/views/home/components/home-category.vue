<template>
    <div class="home-category" @mouseleave="currentCategoryId = null">
        <!-- 左侧分类 -->
        <ul class="menu">
            <li v-for="item in menuList" :key="item.id" @mouseenter="currentCategoryId = item.id"
                :class="{ active: currentCategoryId === item.id }">
                <!-- 一级分类 -->
                <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
                <!-- 两个二级分类 -->
                <template v-if="item.children">
                    <RouterLink v-for="sub in item.children" :key="sub.id" :to="`/category/sub/${sub.id}`">{{ sub.name }}
                    </RouterLink>
                </template>
                <!-- 骨架屏全局组件 -->
                <template v-else>
                    <b2c-skeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)" />
                     <b2c-skeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
                </template>
            </li>
        </ul>
        <!-- 鼠标滑过显示的弹窗 -->
        <!-- 弹层 -->
        <div class="layer">
            <h4>{{ currentCategory && currentCategory.id === 'brand' ? '品牌' : '分类' }}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
            <ul v-if="currentCategory && currentCategory.goods && currentCategory.goods.length">
                <li v-for="item in currentCategory.goods" :key="item.id">
                    <RouterLink to="/">
                        <img :src="item.picture">
                        <div class="info">
                            <p class="name ellipsis-2">{{ item.name }}</p>
                            <p class="desc ellipsis">{{ item.desc }}</p>
                            <p class="price"><i>¥</i>{{ item.price }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
            <!-- 品牌推荐 单独获取数据-->
            <ul v-if="currentCategory && currentCategory.brands && currentCategory.brands.length">
                <li class="brand" v-for="item in currentCategory.brands" :key="item.id">
                    <RouterLink to="/">
                        <img :src="item.picture" alt="">
                        <div class="info">
                            <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="desc ellipsis-2">{{ item.desc }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { getBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  //  尽量别用async在setup前
  setup () {
    const store = useStore()
    // ---------------------------渲染左侧分类导航
    // 1. 获取vuex的一级分类，并且只需要两个二级分类
    // 2. 需要在组件内部，定义一个品牌数据
    // 3. 根据vuex的分类数据和组件中定义品牌数据，得到左侧分类完整数据(9分类+1品牌)数组
    // 4. 进行渲染即可
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      brands: []// 品牌列表
    })
    const menuList = computed(() => {
      const list = store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2), //   防止初始化没有children的时候调用slice函数报错
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })
    // console.log(menuList.value)
    // ---------------------------得到右侧出现弹窗的数据
    const currentCategoryId = ref(null) // 定义一个当前鼠标滑过的左侧导航一级分类那项的id
    const currentCategory = computed(() => {
      return menuList.value.find(item => item.id === currentCategoryId.value)
    })

    // 品牌需要单独获取数据
    getBrand(6).then(res => {
      brand.brands = res.result
    })

    return { menuList, currentCategoryId, currentCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
    width: 250px;
    height: 500px;
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 99;

    //   左侧
    .menu {
        li {
            padding-left: 40px;
            height: 50px;
            line-height: 50px;

            &:hover,
            &.active {
                background: @b2cColor;
            }

            a {
                margin-right: 4px;
                color: #fff;

                &:first-child {
                    font-size: 16px;
                }
            }
        }
    }

    //   右侧弹窗
    .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;

        h4 {
            font-size: 20px;
            font-weight: normal;
            line-height: 80px;

            small {
                font-size: 16px;
                color: #666;
            }
        }

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                width: 310px;
                height: 120px;
                margin-right: 15px;
                margin-bottom: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fff;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                a {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    padding: 10px;

                    &:hover {
                        background: #efefef;
                    }

                    img {
                        width: 95px;
                        height: 95px;
                    }

                    .info {
                        padding-left: 10px;
                        line-height: 24px;
                        width: 190px;

                        .name {
                            font-size: 16px;
                            color: #666;
                        }

                        .desc {
                            color: #999;
                        }

                        .price {
                            font-size: 22px;
                            color: @priceColor;

                            i {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }

            li.brand {
                height: 180px;

                a {
                    align-items: flex-start;

                    img {
                        width: 120px;
                        height: 160px;
                    }

                    .info {
                        p {
                            margin-top: 8px;
                        }

                        .place {
                            color: #999;
                        }
                    }
                }
            }
        }

    }

    &:hover {
        .layer {
            display: block;
        }
    }
}
// 骨架屏组件的类名
.b2c-skeleton{
    animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
