<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'

import dayjs, { Dayjs } from 'dayjs'
import Calendar from '@/components/Calendar.vue'
import FundCardItem from '@/components/FundCardItem.vue'

type FundsSection = {
  date: string
  value: FundItem[]
}

const year = ref(dayjs().year())
const month = ref(dayjs().month())
const date = ref(dayjs())
const expand = ref(true)

// year picker
const showMonthPicker = ref(false)
const columnsType = ref(['year', 'month'])
const minDate = ref(new Date(2020, 0, 1))
const maxDate = ref(new Date(2025, 5, 1))
const currentDate = computed(() => {
  return [year.value, month.value + 1]
})

const fundsSectionList: Ref<FundsSection[]> = ref([])

const onExpandClick = (e: boolean) => {
  expand.value = e
}

const onChangeDate = (e: Dayjs) => {
  date.value = e
  setFixedDate(date.value)
}

const onChangeMonth = (e: { month: number; year?: number }) => {
  console.log('onChangeMonth', e)

  month.value = e.month

  if (e.year) {
    year.value = e.year
  }
}

const fetchFundList = async (): Promise<FundItem[]> => {
  const list = await Promise.resolve([
    {
      releaseDate: '2024-04-09',
      status: 1,
      statusDesc: '即将开售',
      name: '天弘安稳宝FOF19期',
      seriesName: '天弘严选之安稳宝系列',
      tag: '稳健理财',
      rateOfReturn: -1.58,
      duration: 365,
      remainingQuantity: 1000,
      minimumInvestment: 400000,
      riskLevel: 3,
      riskDesc: '中等风险'
    },
    {
      releaseDate: '2024-05-09',
      status: 1,
      statusDesc: '即将开售',
      name: '天弘安稳宝FOF19期',
      seriesName: '天弘严选之安稳宝系列',
      tag: '稳健理财',
      rateOfReturn: -1.58,
      duration: 365,
      remainingQuantity: 1000,
      minimumInvestment: 400000,
      riskLevel: 3,
      riskDesc: '中等风险'
    },
    {
      releaseDate: '2024-05-09',
      status: 1,
      statusDesc: '即将开售',
      name: '天弘安稳宝FOF19期',
      seriesName: '天弘严选之安稳宝系列2',
      tag: '稳健理财',
      rateOfReturn: -1.58,
      duration: 365,
      remainingQuantity: 1000,
      minimumInvestment: 400000,
      riskLevel: 3,
      riskDesc: '中等风险'
    },
    {
      releaseDate: '2024-05-10',
      status: 0,
      statusDesc: '已售罄',
      name: '华夏幸福成长FOF20期',
      seriesName: '华夏严选之幸福成长系列',
      tag: '高收益',
      rateOfReturn: -1.2,
      duration: 365,
      remainingQuantity: 0,
      minimumInvestment: 500000,
      riskLevel: 4,
      riskDesc: '高风险'
    },
    {
      releaseDate: '2024-05-10',
      status: 0,
      statusDesc: '已售罄',
      name: '华夏幸福成长FOF20期',
      seriesName: '华夏严选之幸福成长系列2',
      tag: '高收益',
      rateOfReturn: -1.2,
      duration: 365,
      remainingQuantity: 0,
      minimumInvestment: 500000,
      riskLevel: 4,
      riskDesc: '高风险'
    },
    {
      releaseDate: '2024-05-11',
      status: 1,
      statusDesc: '即将开售',
      name: '易方达稳健收益FOF21期',
      seriesName: '易方达严选之稳健收益系列',
      tag: '稳健理财',
      rateOfReturn: -1.3,
      duration: 365,
      remainingQuantity: 1000,
      minimumInvestment: 300000,
      riskLevel: 3,
      riskDesc: '中等风险'
    },
    {
      releaseDate: '2024-05-11',
      status: 1,
      statusDesc: '即将开售',
      name: '易方达稳健收益FOF21期',
      seriesName: '易方达严选之稳健收益系列2',
      tag: '稳健理财',
      rateOfReturn: -1.3,
      duration: 365,
      remainingQuantity: 1000,
      minimumInvestment: 300000,
      riskLevel: 3,
      riskDesc: '中等风险'
    }
  ])
  return list
}

const getAvailableFundCount = (dayObject: Dayjs) => {
  const date = dayjs(dayObject).format('YYYY-MM-DD')
  return fundsSectionList.value.find((i) => i.date === date)?.value?.length
}

const init = async () => {
  let list = await fetchFundList()
  list.forEach((fundItem) => {
    const section = fundsSectionList.value.find((i) => i.date === fundItem.releaseDate)
    if (section) {
      section.value.push(fundItem)
    } else {
      fundsSectionList.value.push({
        date: fundItem.releaseDate,
        value: [fundItem]
      })
    }
  })

  setFixedDate()
}

const setFixedDate = (date) => {
  // 初始化滚动
  fixedDate.value =
    fundsSectionList.value.find((i) => dayjs(i.date).isSameOrAfter(date || dayjs(), 'day'))?.date ||
    ''

  setTimeout(() => {
    fundDateRefs.value
      .find((i) => {
        return i.innerText === fixedDate.value
      })
      ?.nextSibling?.scrollIntoView({
        behavior: 'smooth'
      })
  }, 0)
}

const onDatePickerConfirm = (e: {}) => {
  const selectedValues = e.selectedValues
  year.value = dayjs(selectedValues[0]).year()
  month.value = dayjs(selectedValues[1]).month()

  showMonthPicker.value = false
}

const calendarRef = ref(null)
const fundListRef = ref(null)

const fundDateRefs = ref(null)

const fixedDate = ref('')

init()

const handleScroll = (e) => {
  const mTop = calendarRef.value.getBoundingClientRect().height
  let idx = fundDateRefs.value.findIndex((i) => i.getBoundingClientRect().top - mTop - 30 > 0)
  let item = null
  if (idx === -1) {
    item = fundsSectionList.value[fundsSectionList.value.length - 1]
  } else {
    item = fundsSectionList.value[idx - 1 > 0 ? idx - 1 : idx]
  }
  fixedDate.value = item.date
}
</script>

<template>
  <main class="flex flex-col h-screen overflow-hidden">
    <div ref="calendarRef">
      <div
        class="flex items-baseline px-2 py-4 bg-white text-black"
        @click="showMonthPicker = true"
      >
        <span class="text-2xl px-2">{{ year }}</span>
        <span class="text-sm">年</span>
        <span class="text-2xl px-2">{{ month + 1 }}</span>
        <span class="text-sm">月</span>
        <svg class="icon translate-y-0.5 ml-1 text-black" aria-hidden="true">
          <use xlink:href="#icon-arrow-down-filling"></use>
        </svg>
      </div>
      <van-popup v-model:show="showMonthPicker" position="bottom" :style="{ height: '60%' }">
        <van-date-picker
          v-model="currentDate"
          title="选择年月"
          :min-date="minDate"
          :max-date="maxDate"
          :columns-type="columnsType"
          @confirm="onDatePickerConfirm"
      /></van-popup>
      <Calendar
        :date="date"
        :month="month"
        :year="year"
        :expand="expand"
        @expandClick="onExpandClick"
        @changeDate="onChangeDate"
        @changeMonth="onChangeMonth"
      >
        <template v-slot:extra="{ day }">
          <div
            :data-count="(count = getAvailableFundCount(day.dayObject))"
            v-show="!day.selected && count > 0"
            class="absolute flex items-center justify-center bottom-0 text-[10px] font-light"
          >
            <div class="circle rounded-full w-1.5 h-1.5 bg-blue"></div>
            <div class="ml-1">
              {{ count }}
            </div>
          </div>
        </template>
      </Calendar>
    </div>
    <div class="shadow-fund-date w-full bg-white text-black text-xl px-8 z-10">
      {{ fixedDate }}
    </div>
    <div ref="fundListRef" class="fund-list overflow-y-auto" @scroll="handleScroll">
      <van-steps direction="vertical" :active="0">
        <van-step v-for="{ date, value } in fundsSectionList">
          <template v-slot:active-icon>
            <i class="block w-1.5 h-1.5 rounded-full bg-[#d0c99d]"></i>
          </template>
          <template v-slot:inactive-icon>
            <i class="block w-1.5 h-1.5 rounded-full bg-[#d0c99d]"></i>
          </template>
          <div ref="fundDateRefs" class="fund-date text-black text-xl">{{ date }}</div>
          <div class="fund-list mt-2" v-if="value?.length > 0">
            <FundCardItem v-for="fund in value" v-bind="fund"></FundCardItem>
          </div>
        </van-step>
      </van-steps>
    </div>
  </main>
</template>
