<template>
  <div class="voting-panel">
    <p class="instruction">마음에 드는 식단에 투표해주세요!</p>

    <div class="card-grid">
      <div
        v-for="(menu, index) in validMenus"
        :key="menu.menu_id + '-' + dateStore.menusDate"
        class="menu-card-wrapper"
      >
        <MenuCard :menu="menu" :menuIndex="index" :isVote="true" />

        <div class="vote-footer">
          <v-btn
            icon
            color="primary"
            size="large"
            class="vote-button"
            @click="voteForMenu(index)"
          >
            <v-icon size="32">mdi-thumb-up</v-icon>
          </v-btn>
          <span class="vote-count">{{ menu.menu_vote_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { useUserStore } from '../store/userStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import dayjs from 'dayjs'
import axios from 'axios'
import MenuCard from './MenuCard.vue'

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()
const userStore = useUserStore()

const validMenus = computed(() =>
  menuStore.menus.filter(menu => menu.menu_id !== null)
)

const uuid = getOrCreateUUID()

const logVoteMenu = () => {
  logStore.addLog({
    user_id: uuid,
    event_name: 'vote_menu',
    event_value: { menu_id: userStore.votedMenuId },
    page_name: 'menus_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

const voteForMenu = async (index) => {
  await userStore.getVotedMenuId()
  const menu = validMenus.value[index]

  // 처음 투표할 때
  if (userStore.votedMenuId === null) {
    try {
      const request = {
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        menu_id: menu.menu_id
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/votes/`, request, {
        headers: { 'user-id': uuid }
      })

      await menuStore.getVoteCountsByDate()
      userStore.setVotedMenuId(menu.menu_id)
      logVoteMenu()
    } catch (err) {
      console.error('메뉴 투표 실패:', err)
    }
  }

  // 이미 같은 메뉴에 투표한 적이 있을 때
  else if (userStore.votedMenuId === menu.menu_id) {
    alert('이미 이 메뉴에 투표하셨습니다!')
    return
  }

  // 이미 다른 메뉴에 투표한 적이 있고, 이번에는 이 메뉴에 투표할 때
  else {
    const confirmChange = confirm('이미 다른 메뉴에 투표하셨습니다. 정말 이 메뉴로 변경하시겠습니까?')
    if (!confirmChange) return

    try {
      const voteInfoRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/votes/${userStore.votedMenuId}`, {
        headers: { 'user-id': uuid },
        params: {
          menu_id: menu.menu_id
        }
      })

      const request = {
        id: voteInfoRes.data.id,
        created_at: voteInfoRes.data.created_at,
        menu_id: menu.menu_id
      }

      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/votes/`, request, {
        headers: { 'user-id': voteInfoRes.data.user_id }
      })
      
      await menuStore.getVoteCountsByDate()
      userStore.setVotedMenuId(menu.menu_id)
      logVoteMenu()
    } catch (err) {
      console.error('투표 정보 가져오기 및 수정하기 실패:', err)
    }
  }
}
</script>

<style scoped>
.voting-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.instruction {
  font-size: 0.9rem;
  color: #444;
  text-align: center;
  margin-bottom: 8px;
}

.card-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  padding: 0 16px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .card-grid {
    flex-direction: row;
    justify-content: center;
    gap: 24px;
  }
}

.menu-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vote-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.vote-count {
  font-weight: 500;
  font-size: 1rem;
  color: #333;
}
</style>
