import { ref, computed, watch, readonly } from 'vue'
import { defineStore } from 'pinia'
import type { EquipmentItem, EquippedGear, SlotType } from '../types'

const STORAGE_KEY = 'rpg_equipment_pinia_store_v1'

const initialItems: EquipmentItem[] = [
  { id: 1, name: 'Шолом Новобранця', slot: 'helmet', attack: 0, defense: 6, speed: 0, weight: 3 },
  { id: 2, name: 'Шолом Тіні', slot: 'helmet', attack: 4, defense: 4, speed: 3, weight: 2 },
  { id: 3, name: 'Важкий Шолом Лицаря', slot: 'helmet', attack: 0, defense: 14, speed: -2, weight: 7 },
  { id: 4, name: 'Шкіряний Нагрудник', slot: 'armor', attack: 2, defense: 10, speed: 2, weight: 6 },
  { id: 5, name: 'Латний Панцир', slot: 'armor', attack: 0, defense: 26, speed: -5, weight: 18 },
  { id: 6, name: 'Мантія Слідопита', slot: 'armor', attack: 5, defense: 8, speed: 6, weight: 4 },
  { id: 7, name: 'Залізний Меч', slot: 'weapon', attack: 15, defense: 2, speed: 0, weight: 5 },
  { id: 8, name: 'Дворучна Сокира', slot: 'weapon', attack: 28, defense: 0, speed: -4, weight: 14 },
  { id: 9, name: 'Парні Кинджали', slot: 'weapon', attack: 12, defense: 0, speed: 8, weight: 2 },
  { id: 10, name: 'Чоботи Мандрівника', slot: 'boots', attack: 0, defense: 4, speed: 7, weight: 2 },
  { id: 11, name: 'Залізні Сабатони', slot: 'boots', attack: 1, defense: 11, speed: -3, weight: 8 }
]

const createEmptyGear = (): EquippedGear => ({
  helmet: null,
  armor: null,
  weapon: null,
  boots: null
})

export const useEquipmentStore = defineStore('equipment', () => {
  const baseStats = {
    attack: 10,
    defense: 10,
    speed: 15
  }

  const maxWeight = 40

  const _equipped = ref<EquippedGear>(createEmptyGear())
  const _inventory = ref<EquipmentItem[]>([...initialItems])

  const savedRaw = localStorage.getItem(STORAGE_KEY)
  if (savedRaw) {
    try {
      const parsed = JSON.parse(savedRaw) as {
        equipped: EquippedGear
        inventory: EquipmentItem[]
      }
      if (parsed.equipped && Array.isArray(parsed.inventory)) {
        _equipped.value = parsed.equipped
        _inventory.value = parsed.inventory
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  watch(
    [_equipped, _inventory],
    () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          equipped: _equipped.value,
          inventory: _inventory.value
        })
      )
    },
    { deep: true }
  )

  const equipped = readonly(_equipped)
  const inventory = readonly(_inventory)

  const bonuses = computed(() => {
    let attack = 0
    let defense = 0
    let speed = 0

    const slots: SlotType[] = ['helmet', 'armor', 'weapon', 'boots']
    for (const slot of slots) {
      const item = _equipped.value[slot]
      if (item) {
        attack += item.attack
        defense += item.defense
        speed += item.speed
      }
    }

    return { attack, defense, speed }
  })

  const currentWeight = computed(() => {
    let total = 0
    const slots: SlotType[] = ['helmet', 'armor', 'weapon', 'boots']
    for (const slot of slots) {
      const item = _equipped.value[slot]
      if (item) {
        total += item.weight
      }
    }
    return total
  })

  const isOverloaded = computed(() => currentWeight.value > maxWeight)

  const totalStats = computed(() => {
    const rawSpeed = Math.max(0, baseStats.speed + bonuses.value.speed)
    return {
      attack: Math.max(0, baseStats.attack + bonuses.value.attack),
      defense: Math.max(0, baseStats.defense + bonuses.value.defense),
      speed: isOverloaded.value ? 0 : rawSpeed
    }
  })

  function equipItem(item: EquipmentItem) {
    const slot = item.slot
    const previousItem = _equipped.value[slot]

    _inventory.value = _inventory.value.filter((i) => i.id !== item.id)

    if (previousItem) {
      _inventory.value.push(previousItem)
    }

    _equipped.value[slot] = item
  }

  function unequipSlot(slot: SlotType) {
    const item = _equipped.value[slot]
    if (!item) return

    _equipped.value[slot] = null
    _inventory.value.push(item)
  }

  function resetBuild() {
    _equipped.value = createEmptyGear()
    _inventory.value = [...initialItems]
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
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
  }
})