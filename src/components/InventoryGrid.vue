<script setup lang="ts">
import { ref } from 'vue'
import type { EquipmentItem, EquippedGear, SlotType } from '../types'

const props = defineProps<{
  inventory: EquipmentItem[]
  equipped: EquippedGear
}>()

const emit = defineEmits<{
  (e: 'equip', item: EquipmentItem): void
}>()

const hoveredItem = ref<EquipmentItem | null>(null)

const slotLabels: Record<SlotType, string> = {
  helmet: 'Шолом',
  armor: 'Броня',
  weapon: 'Зброя',
  boots: 'Чоботи'
}

const getDiff = (item: EquipmentItem) => {
  const current = props.equipped[item.slot]
  return {
    attack: item.attack - (current ? current.attack : 0),
    defense: item.defense - (current ? current.defense : 0),
    speed: item.speed - (current ? current.speed : 0),
    weight: item.weight - (current ? current.weight : 0),
    replacingName: current ? current.name : null
  }
}

const formatDiff = (val: number) => {
  return val > 0 ? `+${val}` : `${val}`
}
</script>

<template>
  <div class="inventory-panel">
    <h2>Рюкзак ({{ inventory.length }})</h2>
    <p class="hint">Наведіть курсор для порівняння зі спорядженням, клікніть щоб одягнути</p>

    <div v-if="inventory.length === 0" class="empty-bag">
      Усі речі зараз одягнені на персонажа.
    </div>

    <div v-else class="items-grid">
      <div
        v-for="item in inventory"
        :key="item.id"
        class="item-card"
        @mouseenter="hoveredItem = item"
        @mouseleave="hoveredItem = null"
        @click="emit('equip', item)"
      >
        <div class="card-top">
          <strong>{{ item.name }}</strong>
          <span class="slot-tag">{{ slotLabels[item.slot] }}</span>
        </div>

        <div class="card-stats">
          <span>Атака: {{ item.attack }}</span>
          <span>Захист: {{ item.defense }}</span>
          <span>Швидкість: {{ item.speed }}</span>
          <span>Вага: {{ item.weight }} кг</span>
        </div>

        <div v-if="hoveredItem?.id === item.id" class="diff-tooltip">
          <div class="tooltip-title">
            {{
              getDiff(item).replacingName
                ? `Заміна: ${getDiff(item).replacingName}`
                : 'У порожній слот'
            }}
          </div>

          <div class="diff-row">
            <span>Атака:</span>
            <span
              :class="{
                pos: getDiff(item).attack > 0,
                neg: getDiff(item).attack < 0
              }"
            >
              {{ formatDiff(getDiff(item).attack) }}
            </span>
          </div>

          <div class="diff-row">
            <span>Захист:</span>
            <span
              :class="{
                pos: getDiff(item).defense > 0,
                neg: getDiff(item).defense < 0
              }"
            >
              {{ formatDiff(getDiff(item).defense) }}
            </span>
          </div>

          <div class="diff-row">
            <span>Швидкість:</span>
            <span
              :class="{
                pos: getDiff(item).speed > 0,
                neg: getDiff(item).speed < 0
              }"
            >
              {{ formatDiff(getDiff(item).speed) }}
            </span>
          </div>

          <div class="diff-row">
            <span>Вага:</span>
            <span
              :class="{
                pos: getDiff(item).weight < 0,
                neg: getDiff(item).weight > 0
              }"
            >
              {{ formatDiff(getDiff(item).weight) }} кг
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory-panel {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 20px;
  color: #0f172a;
}

.inventory-panel h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.hint {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
}

.empty-bag {
  padding: 24px;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.item-card {
  position: relative;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease;
}

.item-card:hover {
  border-color: #2563eb;
  background: #ffffff;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
}

.card-top strong {
  font-size: 14px;
}

.slot-tag {
  font-size: 11px;
  background: #e2e8f0;
  color: #334155;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 12px;
  color: #475569;
}

.diff-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1e293b;
  color: #f8fafc;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 20;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.tooltip-title {
  font-weight: 700;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #334155;
  color: #cbd5e1;
}

.diff-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.pos {
  color: #4ade80;
  font-weight: 700;
}

.neg {
  color: #f87171;
  font-weight: 700;
}
</style>