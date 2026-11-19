<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Backpack, Weight } from 'lucide-vue-next'
import { useEquipmentStore } from '../stores/equipment.store'
import { useStatComparison } from '../composables/useStatComparison'
import type { EquipmentItem, SlotType } from '../types'

const store = useEquipmentStore()
const { backpackItems } = storeToRefs(store)
const { getItemDiff, formatDelta } = useStatComparison()

const slotLabels: Record<SlotType, string> = {
  helmet: 'Шолом',
  armor: 'Броня',
  weapon: 'Зброя',
  boots: 'Чоботи'
}

const rarityBadge: Record<EquipmentItem['rarity'], string> = {
  common: 'badge-ghost',
  rare: 'badge-info',
  epic: 'badge-secondary',
  legendary: 'badge-warning'
}

const deltaTextClass = (val: number) => {
  if (val > 0) return 'text-success font-bold'
  if (val < 0) return 'text-error font-bold'
  return 'opacity-60'
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-lg gap-2">
          <Backpack class="w-5 h-5 text-primary" />
          Рюкзак спорядження ({{ backpackItems.length }})
        </h2>
        <span class="text-xs opacity-60">Клік по предмету — одягнути / замінити</span>
      </div>

      <div v-if="backpackItems.length === 0" class="alert text-sm">
        <span>Усі доступні предмети вже одягнені на персонажа.</span>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="item in backpackItems"
          :key="item.id"
          class="group relative p-4 rounded-xl bg-base-200 border border-base-300 hover:border-primary cursor-pointer transition-all"
          @click="store.equipItem(item)"
        >
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold text-sm">{{ item.name }}</span>
            <span class="badge badge-xs shrink-0" :class="rarityBadge[item.rarity]">
              {{ slotLabels[item.slot] }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs font-mono mt-2">
            <span>АТК: {{ formatDelta(item.stats.attack) }}</span>
            <span>ЗАХ: {{ formatDelta(item.stats.defense) }}</span>
            <span>ШВД: {{ formatDelta(item.stats.speed) }}</span>
            <span class="ml-auto flex items-center gap-1 opacity-75">
              <Weight class="w-3 h-3" />
              {{ item.weight }} кг
            </span>
          </div>

          <div class="hidden group-hover:block mt-3 pt-2 border-t border-base-300 text-xs">
            <div class="font-semibold opacity-70 mb-1">Порівняння з поточним слотом:</div>
            <div class="flex flex-wrap gap-3 font-mono">
              <span :class="deltaTextClass(getItemDiff(item).attack)">
                Атака: {{ formatDelta(getItemDiff(item).attack) }}
              </span>
              <span :class="deltaTextClass(getItemDiff(item).defense)">
                Захист: {{ formatDelta(getItemDiff(item).defense) }}
              </span>
              <span :class="deltaTextClass(getItemDiff(item).speed)">
                Швидкість: {{ formatDelta(getItemDiff(item).speed) }}
              </span>
              <span :class="deltaTextClass(-getItemDiff(item).weight)">
                Вага: {{ formatDelta(getItemDiff(item).weight) }} кг
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>