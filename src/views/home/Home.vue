<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="~assets/img/logo.png" alt="" />
          <h1>电商后台管理系统</h1>
        </div>
        <el-button type="info" @click="signOutClick">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="showAside ? '200px' : '64px'">
          <div class="collapse-btn" @click="showAside = !showAside">
            |||
          </div>
          <el-menu
            default-active="2"
            background-color="rgb(27, 44, 58)"
            text-color="#fff"
            active-text-color="rgb(19, 118, 248)"
            unique-opened
            :default-active="activeItem"
            :collapse="!showAside"
            :collapse-transition="false"
          >
            <el-submenu :index="item.path" v-for="item in asideList" :key="item.id">
              <template slot="title">
                <i :class="menuIconList[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
               :index="sitem.path" 
               v-for="sitem in item.children" 
               :key="sitem.id"
               @click="menuItemClick(sitem.path)"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ sitem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { authDynamicRouter } from "@/router"
import { reqAsideData } from 'http/api'
export default {
  data() {
    return {
      asideList: [],
      menuIconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      showAside: true
    }
  },
  methods: {
    async getAsideData() {
      const { data } = await reqAsideData();
      this.asideList = data;
      sessionStorage.setItem('menuList', JSON.stringify(data));
      authDynamicRouter();
    },
    menuItemClick(path) {
      this.$router.push('/' + path);
    },
    signOutClick() {
      sessionStorage.clear();
      this.$store.commit('changeAdminInfo', {});
      this.$router.replace('/login');
    }
  },
  computed: {
    activeItem() {
      return this.isAddPath ? 'goods' : this.$route.path.slice(1, this.$route.path.length +1);
    },
    isAddPath() {
      return this.$route.path.includes('add');
    }
  },
  created() {
    this.getAsideData();
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      background-color: rgb(51, 61, 61);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        display: flex;
        align-items: center;

        img {
          width: 55px;
          height: 55px;
        }
        h1 {
          font-size: 20px;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
    .el-aside {
      background-color: rgb(27, 44, 58);

      .el-menu {
        border-right: none;

        .iconfont {
          margin-right: 10px;
        }
      }
      .collapse-btn {
        width: 100%;
        height: 25px;
        color: #FFF;
        text-align: center;
        background-color: rgb(64, 79, 100);
        cursor: pointer;
      }
    }
    .el-main {
      background-color: rgb(224, 234, 234);
    }
  }
}
</style>