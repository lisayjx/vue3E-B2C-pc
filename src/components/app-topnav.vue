<template>
    <nav class="app-topNav">
        <div class="container">
            <ul>

                <!-- 登录后 -->
                <template v-if="profile.token">
                    <li>
                        <a href="javascript:;"><i class="iconfont icon-user"></i>{{ profile.account  }}</a>
                    </li>
                    <li><a href="javascript:;">退出登录</a></li>
                </template>
                <!-- 未登录 -->
                <template v-else>
                    <li><RouterLink to="/login">请先登录</RouterLink></li>
                    <li><a href="javascript:;">免费注册</a></li>
                </template>
                <li><a href="javascript:;">我的订单</a></li>
                <li><a href="javascript:;">会员中心</a></li>
                <li><a href="javascript:;">帮助中心</a></li>
                <li><a href="javascript:;">关于我们</a></li>
                <li>
                    <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    const store = useStore()
    // 使用vuex中的state需要设置计算属性
    const profile = computed(() => {
      return store.state.user.profile
    })
    return { profile }
  }
}
</script>

<style scoped lang="less">

.app-topNav {
    background: #333;
    ul {
        display: flex;
        height: 53px;
        justify-content: flex-end;
        align-items: center;

        li {
            a {
                padding: 0 15px;
                color: #fff;
                line-height: 1;
                display: inline-block;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }

                &:hover {
                    color: @b2cColor;
                }
            }

            // 表示 li 元素后的所有同级 a 元素（即 li 的“弟弟” a 们）。
            ~li {
                a {
                    border-left: 2px solid #666;
                }
            }
        }
    }
}
</style>
