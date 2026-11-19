<script setup lang="ts">
import CharacterStatsWidget from './components/CharacterStatsWidget.vue'
import EquipmentMatrix from './components/EquipmentMatrix.vue'
import InventoryGrid from './components/InventoryGrid.vue'
</script>

<template>
  <div class="app-container">
    <header class="page-header">
      <h1>Тактичний конструктор спорядження персонажа</h1>
    </header>

    <div class="top-grid">
      <CharacterStatsWidget />
      <EquipmentMatrix />
    </div>

    <div class="bottom-section">
      <InventoryGrid />
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