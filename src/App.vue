<script setup lang="ts">
import { useEquipment } from './composables/useEquipment'
import CharacterStatsWidget from './components/CharacterStatsWidget.vue'
import EquipmentMatrix from './components/EquipmentMatrix.vue'
import InventoryGrid from './components/InventoryGrid.vue'

const {
  baseStats,
  maxWeight,
  equipped,
  inventory,
  bonuses,
  currentWeight,
  isOverloaded,
  totalStats,
  equipItem,
  unequipSlot,
  resetBuild
} = useEquipment()
</script>

<template>
  <div class="app-container">
    <header class="page-header">
      <h1>Тактичний конструктор спорядження персонажа</h1>
    </header>

    <div class="top-grid">
      <CharacterStatsWidget
        :base-stats="baseStats"
        :bonuses="bonuses"
        :total-stats="totalStats"
        :current-weight="currentWeight"
        :max-weight="maxWeight"
        :is-overloaded="isOverloaded"
        @reset="resetBuild"
      />

      <EquipmentMatrix :equipped="equipped" @unequip="unequipSlot" />
    </div>

    <div class="bottom-section">
      <InventoryGrid
        :inventory="inventory"
        :equipped="equipped"
        @equip="equipItem"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1050px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.top-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .top-grid {
    grid-template-columns: 1fr;
  }
}
</style>