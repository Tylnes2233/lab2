<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Sword, Shield, Wind, Weight, AlertTriangle, RotateCcw } from 'lucide-vue-next'
import { useEquipmentStore } from '../stores/equipment.store'
import { useStatComparison } from '../composables/useStatComparison'

const store = useEquipmentStore()
const { baseStats, bonuses, totalStats, currentWeight, maxWeight, isOverloaded } = storeToRefs(store)
const { formatDelta } = useStatComparison()
</script>

<template>
  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-lg">Характеристики героя</h2>
        <span
          class="badge font-bold"
          :class="isOverloaded ? 'badge-error' : 'badge-success'"
        >
          {{ isOverloaded ? 'Перевантажений' : 'Боєздатний' }}
        </span>
      </div>

      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-base-200 flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold text-sm">
            <Sword class="w-4 h-4 text-error" />
            <span>Атака</span>
          </div>
          <div class="text-sm font-mono">
            <span>{{ baseStats.attack }}</span>
            <span
              class="mx-1 font-bold"
              :class="bonuses.attack >= 0 ? 'text-success' : 'text-error'"
            >
              ({{ formatDelta(bonuses.attack) }})
            </span>
            <span>=</span>
            <span class="ml-1 text-base font-extrabold text-primary">{{ totalStats.attack }}</span>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-base-200 flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold text-sm">
            <Shield class="w-4 h-4 text-info" />
            <span>Захист</span>
          </div>
          <div class="text-sm font-mono">
            <span>{{ baseStats.defense }}</span>
            <span
              class="mx-1 font-bold"
              :class="bonuses.defense >= 0 ? 'text-success' : 'text-error'"
            >
              ({{ formatDelta(bonuses.defense) }})
            </span>
            <span>=</span>
            <span class="ml-1 text-base font-extrabold text-primary">{{ totalStats.defense }}</span>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-base-200 flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold text-sm">
            <Wind class="w-4 h-4 text-success" />
            <span>Швидкість</span>
          </div>
          <div class="text-sm font-mono">
            <span>{{ baseStats.speed }}</span>
            <span
              class="mx-1 font-bold"
              :class="bonuses.speed >= 0 ? 'text-success' : 'text-error'"
            >
              ({{ formatDelta(bonuses.speed) }})
            </span>
            <span>=</span>
            <span
              class="ml-1 text-base font-extrabold"
              :class="isOverloaded ? 'text-error' : 'text-primary'"
            >
              {{ totalStats.speed }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-1.5 pt-2 border-t border-base-200">
        <div class="flex justify-between text-xs font-semibold">
          <span class="flex items-center gap-1">
            <Weight class="w-4 h-4" />
            Вага спорядження
          </span>
          <span :class="{ 'text-error font-bold': isOverloaded }">
            {{ currentWeight }} / {{ maxWeight }} кг
          </span>
        </div>

        <progress
          class="progress w-full"
          :class="isOverloaded ? 'progress-error' : 'progress-primary'"
          :value="currentWeight"
          :max="maxWeight"
        ></progress>

        <div v-if="isOverloaded" class="alert alert-error py-2 text-xs mt-2 flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 shrink-0" />
          <span>Ліміт ваги перевищено! Швидкість персонажа знижена до 0.</span>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-outline btn-error btn-sm w-full gap-2"
        @click="store.resetBuild()"
      >
        <RotateCcw class="w-4 h-4" />
        Скинути білд
      </button>
    </div>
  </div>
</template>