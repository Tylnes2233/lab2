import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '../stores/equipment.store'
import type { EquipmentItem, StatDiff } from '../types'

export function useStatComparison() {
  const store = useEquipmentStore()
  const { equipped } = storeToRefs(store)

  function getItemDiff(candidate: EquipmentItem): StatDiff {
    const currentlyEquipped = equipped.value[candidate.slot]

    if (!currentlyEquipped) {
      return {
        attack: candidate.stats.attack,
        defense: candidate.stats.defense,
        speed: candidate.stats.speed,
        weight: candidate.weight
      }
    }

    return {
      attack: candidate.stats.attack - currentlyEquipped.stats.attack,
      defense: candidate.stats.defense - currentlyEquipped.stats.defense,
      speed: candidate.stats.speed - currentlyEquipped.stats.speed,
      weight: Number((candidate.weight - currentlyEquipped.weight).toFixed(1))
    }
  }

  function formatDelta(value: number): string {
    return value > 0 ? `+${value}` : `${value}`
  }

  return {
    getItemDiff,
    formatDelta
  }
}