<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref, PropType } from 'vue'
interface IFundCardItemProps {
  // 发布日期
  releaseDate: string
  // 状态
  status: number
  // 状态描述
  statusDesc: string
  // 名称
  name: string
  // 系列名
  seriesName: string
  // 标签
  tag: string
  // 收益率
  rateOfReturn: number
  // 投资周期
  duration: number
  // 剩余数量
  remainingQuantity: number
  // 起投金额
  minimumInvestment: number
  // 风险系数
  riskLevel: number
  // 风险描述
  riskDesc: string
}

const props = withDefaults(defineProps<IFundCardItemProps>(), {})

const moneyFormatter: (value: number) => string = (value: number) => {
  return (value / 10000).toFixed(0) + '万元'
}
</script>
<template>
  <section class="fund-card-item bg-[#fefefe] shadow-[0_2px_6px_rgba(0,0,0,0.1)] px-4 py-2">
    <div class="fund-card-item-header flex justify-start items-center">
      <span class="text-[#c0c0c0] text-sm">{{ props.seriesName }}</span>
      <span class="ml-2 text-[#633816] text-[10px] font-medium rounded-sm bg-[#e3b792] px-1">{{
        props.tag
      }}</span>
    </div>
    <van-divider class="!leading-4 !m-2" />
    <div class="fund-card-item-content flex flex-col">
      <h1 class="fund-card-item-name text-black font-medium text-base">{{ props.name }}</h1>
      <div class="flex items-center justify-around mt-4 w-full text-sm text-[#c0c0c0]">
        <div class="flex flex-col basis-1/2 shrink-0">
          <div class="text-[#9c936d]">
            <span class="text-xl">{{ props.rateOfReturn }}</span
            >%
          </div>
          <span class="mt-0.5">近一年收益</span>
        </div>
        <div class="flex flex-col basis-1/2 shrink-0">
          <div class="text-black">
            <span class="text-xl">{{ props.duration }}</span>
            天
          </div>

          <div class="mt-0.5">
            <span>{{ moneyFormatter(props.minimumInvestment) }}起</span>
            <van-divider class="" vertical />
            <span>{{ props.riskDesc }}</span>
          </div>
        </div>
      </div>
      <div
        :class="
          props.status !== 0 ? ' bg-[#e3b792] text-[#633816] ' : 'bg-gray-light text-black-light'
        "
        class="self-end text-sm font-medium rounded px-2 py-1 mt-4"
      >
        {{ props.statusDesc }}
      </div>
    </div>
  </section>
</template>
