<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Crown, ShieldAlert, Sword, Footprints, XCircle } from 'lucide-vue-next'
import { useEquipmentStore } from '../stores/equipment.store'
import { useStatComparison } from '../composables/useStatComparison'
import type { SlotType } from '../types'

const store = useEquipmentStore()
const { equipped } = storeToRefs(store)
const { formatDelta } = useStatComparison()

const slotsMeta: Array<{ key: SlotType; label: string }> = [
  { key: 'helmet', label: 'Шолом' },
  { key: 'armor', label: 'Нагрудник' },
  { key: 'weapon', label: 'Зброя' },
  { key: 'boots', label: 'Чоботи' }
]
</script>

<template>
  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-lg">Слоти активного екіпірування</h2>
        <span class="text-xs opacity-60">Клік по слоту знімає предмет</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="meta in slotsMeta"
          :key="meta.key"
          class="p-4 rounded-xl border-2 transition-all min-h-32 flex flex-col justify-between"
          :class="
            equipped[meta.key]
              ? 'border-primary bg-primary/10 cursor-pointer hover:border-error'
              : 'border-dashed border-base-300 bg-base-200/50 opacity-70'
          "
          @click="equipped[meta.key] && store.unequipSlot(meta.key)"
        >
          <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-75">
            <span class="flex items-center gap-1.5">
              <Crown v-if="meta.key === 'helmet'" class="w-4 h-4 text-warning" />
              <ShieldAlert v-else-if="meta.key === 'armor'" class="w-4 h-4 text-info" />
              <Sword v-else-if="meta.key === 'weapon'" class="w-4 h-4 text-error" />
              <Footprints v-else class="w-4 h-4 text-success" />
              {{ meta.label }}
            </span>
            <XCircle v-if="equipped[meta.key]" class="w-4 h-4 text-error" />
          </div>

          <div v-if="equipped[meta.key]" class="mt-2 space-y-1.5">
            <div class="font-bold text-sm leading-tight">{{ equipped[meta.key]!.name }}</div>
            <div class="flex flex-wrap gap-1.5 text-xs font-mono">
              <span v-if="equipped[meta.key]!.stats.attack !== 0" class="badge badge-xs badge-ghost">
                АТК {{ formatDelta(equipped[meta.key]!.stats.attack) }}
              </span>
              <span v-if="equipped[meta.key]!.stats.defense !== 0" class="badge badge-xs badge-ghost">
                ЗАХ {{ formatDelta(equipped[meta.key]!.stats.defense) }}
              </span>
              <span v-if="equipped[meta.key]!.stats.speed !== 0" class="badge badge-xs badge-ghost">
                ШВД {{ formatDelta(equipped[meta.key]!.stats.speed) }}
              </span>
              <span class="badge badge-xs badge-outline">{{ equipped[meta.key]!.weight }} кг</span>
            </div>
          </div>

          <div v-else class="my-auto text-center text-xs opacity-50 py-3">
            Порожній слот
          </div>
        </div>
      </div>
    </div>
  </div>
</template>