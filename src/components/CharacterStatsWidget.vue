<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '../stores/equipment.store'

const store = useEquipmentStore()
const { bonuses, currentWeight, isOverloaded, totalStats } = storeToRefs(store)
const { baseStats, maxWeight, resetBuild } = store

const formatBonus = (val: number) => {
  return val >= 0 ? `+${val}` : `${val}`
}
</script>

<template>
  <div class="stats-panel" :class="{ overloaded: isOverloaded }">
    <div class="header">
      <h2>Характеристики героя</h2>
      <span class="status-badge" :class="isOverloaded ? 'danger' : 'normal'">
        {{ isOverloaded ? 'Перевантажений' : 'Боєздатний' }}
      </span>
    </div>

    <div class="stat-list">
      <div class="stat-row">
        <span>Атака (Attack):</span>
        <strong>
          {{ baseStats.attack }} ({{ formatBonus(bonuses.attack) }}) = {{ totalStats.attack }}
        </strong>
      </div>

      <div class="stat-row">
        <span>Захист (Defense):</span>
        <strong>
          {{ baseStats.defense }} ({{ formatBonus(bonuses.defense) }}) = {{ totalStats.defense }}
        </strong>
      </div>

      <div class="stat-row">
        <span>Швидкість (Speed):</span>
        <strong :class="{ 'zero-speed': isOverloaded }">
          {{ baseStats.speed }} ({{ formatBonus(bonuses.speed) }}) = {{ totalStats.speed }}
        </strong>
      </div>
    </div>

    <div class="weight-section">
      <div class="weight-header">
        <span>Вага спорядження:</span>
        <strong :class="{ 'text-danger': isOverloaded }">
          {{ currentWeight }} / {{ maxWeight }} кг
        </strong>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :class="{ 'fill-danger': isOverloaded }"
          :style="{ width: Math.min(100, (currentWeight / maxWeight) * 100) + '%' }"
        ></div>
      </div>
    </div>

    <button class="reset-btn" @click="resetBuild">Скинути білд</button>
  </div>
</template>

<style scoped>
.stats-panel {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 20px;
  color: #0f172a;
}

.stats-panel.overloaded {
  border-color: #ef4444;
  background: #fef2f2;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  margin: 0;
  font-size: 18px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.normal {
  background: #dcfce7;
  color: #166534;
}

.status-badge.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e2e8f0;
}

.zero-speed,
.text-danger {
  color: #dc2626;
}

.weight-section {
  margin-bottom: 18px;
}

.weight-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 6px;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.2s ease;
}

.progress-fill.fill-danger {
  background: #dc2626;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: #475569;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.reset-btn:hover {
  background: #334155;
}
</style>