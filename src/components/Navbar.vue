<template>
  <nav v-if="isLoggedIn" class="px-20 py-2 bg-mainColor flex justify-between items-center border-b-1 border-secondaryColor">
    <div class="flex px-4 justify-between sm:py-0 pb-1">
      <RouterLink to="/">
        <img src="../assets/images/logo.svg" alt="Logo" class='w-full h-12 object-contain'>
      </RouterLink>
    </div>
    <div class='flex cursor-pointer gap-4 py-2 px-1.5' >
      <el-tooltip class="box-item" effect="light" content="Logout the account." placement="bottom">
        <el-button @click="logout" color="#9899a5" plain>
          <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M16 13v-4l8 7-8 7v-4h-6v-6h6zm0-6v-6h-16v18l8-7v-9h6v4h2z"/>
          </svg>
        </el-button>
      </el-tooltip>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => {
  return store.state.authToken !== null && store.state.userInfo?.email !== null;
});

const logout = async () => {
  try {
    store.commit('clearToken');
    await router.push('/login');
  } catch (error) {
    console.error('Logout error:', error.response.data);
  }
};
</script>
