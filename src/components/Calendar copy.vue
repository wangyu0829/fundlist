<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import type { Ref } from 'vue'

import dayjs, { Dayjs } from 'dayjs'
import { cloneDeep, uniqBy } from 'lodash'

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

const calendar: Ref<{ data: CalendarItemType[][]; month: string; idx: number }[]> = ref([])

const initalSlide: Ref<number> = ref(1)

const weekdaysShort = dayjs.weekdaysShort(true)

const currentRealIndex = ref(0)

const displayCalendar = computed(() => {
  if (props.expand) {
    return calendar.value
  } else {
    const mergedCalendar: { data: CalendarItemType[][]; month: string; idx: number }[] = []

    const calendarClone = cloneDeep(calendar.value)

    const flatedCalendar: CalendarItemType[] = []

    calendarClone.reduce((acc, cur, idx) => {
      cur.data.forEach((w) => {
        let dayArr: CalendarItemType[] = []

        w.forEach((d) => {
          if (!flatedCalendar.some((t) => t.dayObject.isSame(d.dayObject, 'day'))) {
            d.isExtraDay = false
            flatedCalendar.push(d)
            dayArr.push(d)
          }
        })
        if (dayArr.length > 0) {
          acc.push({
            data: [dayArr],
            month: cur.month,
            idx
          })
        }
      })
      return acc
    }, mergedCalendar)

    return mergedCalendar
  }
})

watch(
  () => props.expand,
  (val) => {
    // 展开 -> 收起， 选中日期在展示的slide上，则定位到选中日期的那一周；不在slide上，则定位到slide的第一周
    // 收起 -> 展开，定位到包含展示slide的month
    // slideSwiperTo(slideIdx)

    console.log('watch expand', currentRealIndex.value)
    let slideIdx
    if (val) {
      // 收起 -> 展开
      // slideIdx =
    } else {
      // 展开 -> 收起
    }
    // let slideIdx = val.findIndex((m) => {
    //   if (m.data.some((w) => {})) {
    //   }
    // })
  }
)

const slideSwiperTo = (slideIdx: number) => {
  setTimeout(() => {
    const swiperEl = document.querySelector('swiper-container')
    swiperEl?.swiper.slideTo(slideIdx, 0, false)
  }, 200)
}

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

const getThreeMonthDate = (year: number, month: number, idxOrder: number[]) => {
  calendar.value = [
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
  console.log('calendar', calendar.value)
}

let monthLoopIndex = [0, 1, 2]

const onRealIndexChange = (e: { detail: { realIndex: any }[] }) => {
  const { realIndex } = e.detail[0]

  let len = displayCalendar.value.length
  currentRealIndex.value = realIndex
  const prevRealLoopIndex = (realIndex + len - 1) % len
  const nextRealLoopIndex = (realIndex + len + 1) % len

  console.log('onRealIndexChange', prevRealLoopIndex, realIndex, nextRealLoopIndex)

  if (props.expand) {
    const currentSlideMonth = dayjs(displayCalendar.value[realIndex].month)
    const nextSlideMonth = dayjs(displayCalendar.value[nextRealLoopIndex].month)
    const prevSlideMonth = dayjs(displayCalendar.value[prevRealLoopIndex].month)

    if (currentSlideMonth.isAfter(nextSlideMonth) || currentSlideMonth.isBefore(prevSlideMonth)) {
      monthLoopIndex = [prevRealLoopIndex, realIndex, nextRealLoopIndex]

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

watchEffect(() => {
  getThreeMonthDate(props.year, props.month, monthLoopIndex)
})

watch(
  () => props.date,
  () => {
    calendar.value.forEach(({ data: monthData, month, ...rest }) => {
      monthData.forEach((week) => {
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
  <div class="weekday-container flex items-center justify-around p-4 pb-0 bg-white-light">
    <div v-for="weekday in weekdaysShort" class="weekday basis-1/7 shrink-0">
      <span
        :class="[
          'text-gray-light',
          'flex w-[12vw]  items-center justify-center select-none cursor-none'
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
      v-for="({ month, data: monthData }, index) in displayCalendar"
      class="month p-4 basis-3/3 shrink-0"
    >
      <div v-for="week in monthData" class="week flex justify-center items-center">
        <div v-for="item in week" :key="item.dayStr" class="day basis-1/7 shrink-0">
          <slot :day="item">
            <span
              :class="[
                'flex w-[12vw] h-[12vw]  items-center justify-center select-none cursor-pointer rounded-full',
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
              {{ item.dayStr }}
            </span>
          </slot>
        </div>
      </div>
    </swiper-slide>
  </swiper-container>
  <div
    class="expand-container flex items-center justify-center pb-2 bg-white-light"
    @click="onExpandBtnClick"
  >
    <svg :class="['icon transition-all', expand ? '-rotate-180' : '']" aria-hidden="true">
      <use xlink:href="#icon-zhankai"></use>
    </svg>
  </div>
</template>
