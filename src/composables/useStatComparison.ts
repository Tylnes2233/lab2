import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '../stores/equipment.store'
import type { EquipmentItem, StatDiff } from '../types'

export function useStatComparison() {
  const store = useEquipmentStore()
  const { equipped } = storeToRefs(store)

  const hoveredItem = ref<EquipmentItem | null>(null)

  const setHoveredItem = (item: EquipmentItem | null) => {
    hoveredItem.value = item
  }

  const activeDiff = computed<StatDiff | null>(() => {
    const candidate = hoveredItem.value
    if (!candidate) return null

    const current = equipped.value[candidate.slot]
    return {
      attack: candidate.attack - (current ? current.attack : 0),
      defense: candidate.defense - (current ? current.defense : 0),
      speed: candidate.speed - (current ? current.speed : 0),
      weight: candidate.weight - (current ? current.weight : 0),
      replacingName: current ? current.name : null
    }
  })

  const formatDelta = (value: number): string => {
    return value > 0 ? `+${value}` : `${value}`
  }

  return {
    hoveredItem,
    activeDiff,
    setHoveredItem,
    formatDelta
  }
}