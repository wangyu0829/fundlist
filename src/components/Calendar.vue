<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import type { Ref } from 'vue'

import dayjs, { Dayjs } from 'dayjs'

interface ICalendarProps {
  expand: boolean
  date: Dayjs
  month: number
  year: number
}

const props = withDefaults(defineProps<ICalendarProps>(), {
  expand: false,
  date: () => dayjs(),
  month: dayjs().month(), // month starts from 0
  year: dayjs().year()
})

const emit = defineEmits(['changeMonth', 'changeYear', 'changeDate', 'expandClick'])

// 星期title
const weekdaysShort = dayjs.weekdaysShort(true)

// 日历面板数据
const calendar: Ref<{ data: CalendarItemType[][]; month: string; idx: number }[]> = ref([])

// 初始展示的数据
const initalSlide: Ref<number> = ref(1)

// 当前展示数据索引，slide 滑动变化
const currentRealIndex = ref(0)

// 当前展示数据
let currentSlideData: { data: CalendarItemType[][]; month: string; idx: number }

let panelLoopOrder = [0, 1, 2]
let slideFlag = false

const isItemSelected = (dayObject: dayjs.Dayjs) => {
  return dayObject.isSame(props.date, 'day')
}

const getDateByMonth = (year: number, month: number, line: number = 6) => {
  const totalDayCount = line * 7
  const startDate = dayjs([year, month]).startOf('month').startOf('week')
  let endDate = dayjs([year, month]).endOf('month') // add 7 days to the end date of the month
  const gapDayCount = totalDayCount - endDate.diff(startDate, 'day') - 1

  endDate = endDate.add(gapDayCount, 'day')

  let monthCalendar: CalendarItemType[][] = []
  let day = startDate.subtract(1, 'day')
  while (day.isBefore(endDate, 'day')) {
    monthCalendar.push(
      Array(7)
        .fill(0)
        .map(() => {
          day = day.add(1, 'day')
          let dayStr = day.format('D')
          let isExtraDay = isExtraDays(monthCalendar.length, parseInt(dayStr, 10))
          return {
            dayObject: day,
            dayStr,
            isExtraDay,
            isToday: day.isToday(),
            day: dayjs(day).day(),
            selected: isItemSelected(day)
          }
        })
    )
  }

  return monthCalendar
}

const isExtraDays = (week: number, date: number) => {
  if (week === 0 && date > 13) {
    return true
  } else if (week >= 4 && date <= 13) {
    return true
  } else {
    return false
  }
}

const getThreeMonthDate = (year: number, month: number, date: Dayjs, idxOrder: number[]) => {
  return [
    {
      data: getDateByMonth(year, month - 1),
      month: dayjs([year, month - 1]).format('YYYY-MM'),
      idx: idxOrder[0]
    },
    {
      data: getDateByMonth(year, month),
      month: dayjs([year, month]).format('YYYY-MM'),
      idx: idxOrder[1]
    },
    {
      data: getDateByMonth(year, month + 1),
      month: dayjs([year, month + 1]).format('YYYY-MM'),
      idx: idxOrder[2]
    }
  ].sort((a, b) => {
    return a.idx - b.idx
  })
}

const getDateByWeek = (year: number, month: number, date: Dayjs) => {
  const startDate = date
    ? date.startOf('week')
    : dayjs([year, month]).startOf('month').startOf('week')
  const endDate = startDate.endOf('week')

  let monthCalendar: CalendarItemType[][] = []
  let day = startDate.subtract(1, 'day')
  while (day.isBefore(endDate, 'day')) {
    monthCalendar.push(
      Array(7)
        .fill(0)
        .map(() => {
          day = day.add(1, 'day')
          let dayStr = day.format('D')
          let isExtraDay = false
          return {
            dayObject: day,
            dayStr,
            isExtraDay,
            isToday: day.isToday(),
            day: dayjs(day).day(),
            selected: isItemSelected(day)
          }
        })
    )
  }

  return monthCalendar
}

const getThreeWeekDate = (year: number, month: number, date: Dayjs, idxOrder: number[]) => {
  let data = [
    {
      data: getDateByWeek(year, month, date.subtract(1, 'week')),
      month: date.subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
      idx: idxOrder[0]
    },
    {
      data: getDateByWeek(year, month, date),
      month: date.startOf('week').format('YYYY-MM-DD'),
      idx: idxOrder[1]
    },
    {
      data: getDateByWeek(year, month, date.add(1, 'week')),
      month: date.add(1, 'week').startOf('week').format('YYYY-MM-DD'),
      idx: idxOrder[2]
    }
  ].sort((a, b) => {
    return a.idx - b.idx
  })
  return data
}

const onRealIndexChange = (e: { detail: { realIndex: any }[] }) => {
  const { realIndex } = e.detail[0]

  let len = calendar.value.length
  currentRealIndex.value = realIndex
  const prevRealLoopIndex = (realIndex + len - 1) % len
  const nextRealLoopIndex = (realIndex + len + 1) % len

  currentSlideData = calendar.value[realIndex]

  const currentSlideMonth = dayjs(calendar.value[realIndex].month)
  const nextSlideMonth = dayjs(calendar.value[nextRealLoopIndex].month)
  const prevSlideMonth = dayjs(calendar.value[prevRealLoopIndex].month)

  if (props.expand) {
    if (currentSlideMonth.isAfter(nextSlideMonth) || currentSlideMonth.isBefore(prevSlideMonth)) {
      panelLoopOrder = [prevRealLoopIndex, realIndex, nextRealLoopIndex]

      const monthStr = dayjs(currentSlideMonth).month()
      const yearStr = dayjs(currentSlideMonth).year()

      if (!dayjs([props.year]).isSame(currentSlideMonth, 'year')) {
        emit('changeMonth', {
          month: monthStr,
          year: yearStr
        })
      } else {
        emit('changeMonth', {
          month: monthStr
        })
      }
    }
  } else {
    if (currentSlideMonth.isAfter(nextSlideMonth) || currentSlideMonth.isBefore(prevSlideMonth)) {
      slideFlag = true
      // 需要获取新的周数据
      panelLoopOrder = [prevRealLoopIndex, realIndex, nextRealLoopIndex]

      const propsYearMonth = dayjs([props.year, props.month])
      let slideStartDate = propsYearMonth.startOf('month').startOf('week')
      let slideEndDate = propsYearMonth.endOf('month').endOf('week')

      if (currentSlideMonth.isBetween(slideStartDate, slideEndDate, 'day', '[]')) {
        calendar.value = getThreeWeekDate(
          props.year,
          props.month,
          currentSlideMonth,
          panelLoopOrder
        )
      } else {
        const monthStr = dayjs(currentSlideMonth).month()
        const yearStr = dayjs(currentSlideMonth).year()
        if (!dayjs([props.year]).isSame(currentSlideMonth, 'year')) {
          emit('changeMonth', {
            month: monthStr,
            year: yearStr
          })
        } else {
          emit('changeMonth', {
            month: monthStr
          })
        }
      }
    }
  }
}

watchEffect(() => {
  if (props.expand) {
    calendar.value = getThreeMonthDate(props.year, props.month, props.date, panelLoopOrder)
  } else {
    // 处理展开收起的逻辑 和 互动逻辑
    let date =
      slideFlag && !!currentSlideData
        ? dayjs(currentSlideData.month)
        : props.date.isBetween(
              dayjs([props.year, props.month]).startOf('month'),
              dayjs([props.year, props.month]).endOf('month'),
              'day',
              '[]'
            )
          ? props.date
          : dayjs([props.year, props.month]).startOf('month')
    calendar.value = getThreeWeekDate(props.year, props.month, date, panelLoopOrder)
  }
  slideFlag = false
})

// 单向数据驱动，日期点选更改 props.date, 设置选择态
watch(
  () => props.date,
  () => {
    calendar.value.forEach(({ data: panelData, month, ...rest }) => {
      panelData.forEach((week) => {
        week.forEach((day) => {
          day.selected = isItemSelected(day.dayObject)
        })
      })
    })
  }
)

const onDateClick = (dayObject: dayjs.Dayjs) => {
  emit('changeDate', dayObject)
}

const onExpandBtnClick = () => {
  emit('expandClick', !props.expand)
}
</script>
<template>
  <div>
    <div class="weekday-container flex items-center justify-around p-4 pb-0 bg-white-light">
      <div v-for="weekday in weekdaysShort" class="weekday basis-1/7 shrink-0">
        <span
          :class="[
            'text-gray-light',
            'flex w-[12vw] sm:w-[8vw] md:w-[4vw] lg:w-[2vw] items-center justify-center select-none cursor-none'
          ]"
        >
          {{ weekday }}
        </span>
      </div>
    </div>
    <swiper-container
      :slides-per-view="1"
      :space-between="100"
      :loop="true"
      :initial-slide="initalSlide"
      class="calendar flex bg-white-light justify-around overflow-x-hidden transition-all duration-500 ease"
      :class="expand ? 'max-h-96' : 'max-h-36'"
      @swiperrealindexchange="onRealIndexChange"
    >
      <swiper-slide
        v-for="({ month, data: monthData }, index) in calendar"
        class="month p-4 basis-3/3 shrink-0"
      >
        <div v-for="week in monthData" class="week flex justify-center items-center">
          <div v-for="item in week" :key="item.dayStr" class="day basis-1/7 shrink-0">
            <div
              :class="[
                'relative flex flex-col w-[12vw] h-[12vw] sm:w-[8vw] sm:h-[8vw] md:w-[4vw] md:h-[4vw] lg:w-[2vw] lg:h-[2vw] items-center justify-center select-none cursor-pointer rounded-full',
                item.selected
                  ? 'bg-blue-dark text-white'
                  : item.isToday
                    ? 'text-blue-dark'
                    : item.isExtraDay
                      ? 'text-gray-light'
                      : 'text-black-light'
              ]"
              @click="() => onDateClick(item.dayObject)"
            >
              <slot v-if="item.isToday" name="today"
                ><span class="absolute top-0 text-[10px] text-blue-dark">今</span></slot
              >
              <span> {{ item.dayStr }} </span>
              <slot name="extra" :day="item"> </slot>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
    <div
      class="expand-container flex items-center justify-center pb-2 bg-white-light"
      @click="onExpandBtnClick"
    >
      <svg
        :class="['icon transition-all text-black', expand ? '-rotate-180' : '']"
        aria-hidden="true"
      >
        <use xlink:href="#icon-zhankai"></use>
      </svg>
    </div>
  </div>
</template>
