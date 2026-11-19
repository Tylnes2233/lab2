<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '../stores/equipment.store'
import type { SlotType } from '../types'

const store = useEquipmentStore()
const { equipped } = storeToRefs(store)
const { unequipSlot } = store

const slotConfig: { key: SlotType; label: string; placeholder: string }[] = [
  { key: 'helmet', label: 'Шолом (Helmet)', placeholder: 'Слот шолома порожній' },
  { key: 'armor', label: 'Броня (Armor)', placeholder: 'Слот броні порожній' },
  { key: 'weapon', label: 'Зброя (Weapon)', placeholder: 'Слот зброї порожній' },
  { key: 'boots', label: 'Чоботи (Boots)', placeholder: 'Слот чобіт порожній' }
]
</script>

<template>
  <div class="matrix-panel">
    <h2>Активне екіпірування</h2>
    <p class="hint">Натисніть на одягнений предмет, щоб зняти його у рюкзак</p>

    <div class="slots-grid">
      <div
        v-for="slot in slotConfig"
        :key="slot.key"
        class="slot-box"
        :class="{ filled: equipped[slot.key] !== null }"
        @click="equipped[slot.key] && unequipSlot(slot.key)"
      >
        <div class="slot-title">{{ slot.label }}</div>

        <div v-if="equipped[slot.key]" class="item-details">
          <strong>{{ equipped[slot.key]!.name }}</strong>
          <div class="item-stats">
            <span>Атк: {{ equipped[slot.key]!.attack }}</span>
            <span>Зах: {{ equipped[slot.key]!.defense }}</span>
            <span>Швд: {{ equipped[slot.key]!.speed }}</span>
            <span>Вага: {{ equipped[slot.key]!.weight }} кг</span>
          </div>
        </div>

        <div v-else class="empty-placeholder">
          {{ slot.placeholder }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matrix-panel {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 20px;
  color: #0f172a;
}

.matrix-panel h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.hint {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
}

.slots-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.slot-box {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 14px;
  min-height: 105px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f8fafc;
  transition: all 0.15s ease;
}

.slot-box.filled {
  border-style: solid;
  border-color: #2563eb;
  background: #eff6ff;
  cursor: pointer;
}

.slot-box.filled:hover {
  background: #dbeafe;
}

.slot-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 8px;
}

.item-details strong {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: #1e3a8a;
}

.item-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #334155;
}

.empty-placeholder {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}
</style>