<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
import CharacterStatsWidget from './components/CharacterStatsWidget.vue'
import EquipmentMatrix from './components/EquipmentMatrix.vue'
import InventoryGrid from './components/InventoryGrid.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content pb-12">
    <header class="navbar bg-base-100 shadow-md px-4 md:px-8 mb-6">
      <div class="flex-1">
        <span class="text-xl font-extrabold flex items-center gap-2 text-primary">
          <Shield class="w-6 h-6" />
          RPG Equipment Builder
        </span>
      </div>
      <div class="flex-none text-xs opacity-70">
        Лабораторна робота №2 • Варіант 1 (Pinia Store)
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-4">
          <CharacterStatsWidget />
        </div>

        <div class="lg:col-span-8 space-y-6">
          <EquipmentMatrix />
          <InventoryGrid />
        </div>
      </div>
    </main>
  </div>
</template>