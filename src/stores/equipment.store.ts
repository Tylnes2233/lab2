import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  EquipmentItem,
  EquipmentStats,
  EquippedSlots,
  SlotType
} from '../types'

const STORAGE_KEY = 'rpg_equipment_builder_v1'

const BASE_STATS: EquipmentStats = {
  attack: 15,
  defense: 10,
  speed: 12
}

const MAX_CARRY_WEIGHT = 40

const initialCatalog: EquipmentItem[] = [
  {
    id: 'helm-leather',
    name: 'Шкіряний каптур слідопита',
    slot: 'helmet',
    weight: 2.5,
    stats: { attack: 2, defense: 4, speed: 2 },
    rarity: 'common'
  },
  {
    id: 'helm-steel',
    name: 'Шолом залізної гвардії',
    slot: 'helmet',
    weight: 7.0,
    stats: { attack: 0, defense: 14, speed: -3 },
    rarity: 'rare'
  },
  {
    id: 'helm-dragon',
    name: 'Корона попелястого дракона',
    slot: 'helmet',
    weight: 5.5,
    stats: { attack: 10, defense: 16, speed: 1 },
    rarity: 'legendary'
  },
  {
    id: 'armor-brigandine',
    name: 'Бригантина найманця',
    slot: 'armor',
    weight: 10.0,
    stats: { attack: 3, defense: 15, speed: 0 },
    rarity: 'common'
  },
  {
    id: 'armor-plate',
    name: 'Важкі лицарські лати',
    slot: 'armor',
    weight: 22.0,
    stats: { attack: 0, defense: 32, speed: -6 },
    rarity: 'epic'
  },
  {
    id: 'armor-shadow',
    name: 'Плащ нічного клинка',
    slot: 'armor',
    weight: 6.5,
    stats: { attack: 12, defense: 11, speed: 6 },
    rarity: 'rare'
  },
  {
    id: 'weapon-dagger',
    name: 'Парні кинджали тиші',
    slot: 'weapon',
    weight: 3.0,
    stats: { attack: 16, defense: 1, speed: 5 },
    rarity: 'rare'
  },
  {
    id: 'weapon-sword',
    name: 'Полуторний меч паладина',
    slot: 'weapon',
    weight: 8.5,
    stats: { attack: 24, defense: 5, speed: -1 },
    rarity: 'epic'
  },
  {
    id: 'weapon-greataxe',
    name: 'Дворучна сокира берсерка',
    slot: 'weapon',
    weight: 16.5,
    stats: { attack: 38, defense: -4, speed: -5 },
    rarity: 'legendary'
  },
  {
    id: 'boots-runner',
    name: 'Чоботи вітру',
    slot: 'boots',
    weight: 2.0,
    stats: { attack: 1, defense: 3, speed: 8 },
    rarity: 'rare'
  },
  {
    id: 'boots-iron',
    name: 'Ковані сабатони бастіону',
    slot: 'boots',
    weight: 6.5,
    stats: { attack: 0, defense: 11, speed: -2 },
    rarity: 'common'
  }
]

function createEmptySlots(): EquippedSlots {
  return {
    helmet: null,
    armor: null,
    weapon: null,
    boots: null
  }
}

export const useEquipmentStore = defineStore('equipment', () => {
  const catalog = ref<EquipmentItem[]>(initialCatalog)
  const equipped = ref<EquippedSlots>(createEmptySlots())

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<Record<SlotType, string | null>>
      const restored = createEmptySlots()

      ;(Object.keys(restored) as SlotType[]).forEach((slot) => {
        const itemId = parsed[slot]
        if (itemId) {
          restored[slot] =
            catalog.value.find((item) => item.id === itemId && item.slot === slot) || null
        }
      })

      equipped.value = restored
    } catch {
      equipped.value = createEmptySlots()
    }
  }

  loadFromStorage()

  watch(
    equipped,
    (current) => {
      const serialized: Record<SlotType, string | null> = {
        helmet: current.helmet?.id ?? null,
        armor: current.armor?.id ?? null,
        weapon: current.weapon?.id ?? null,
        boots: current.boots?.id ?? null
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
    },
    { deep: true }
  )

  const baseStats = computed(() => BASE_STATS)
  const maxWeight = computed(() => MAX_CARRY_WEIGHT)

  const equippedItemsList = computed<EquipmentItem[]>(() => {
    return Object.values(equipped.value).filter((item): item is EquipmentItem => item !== null)
  })

  const backpackItems = computed<EquipmentItem[]>(() => {
    const equippedIds = new Set(equippedItemsList.value.map((i) => i.id))
    return catalog.value.filter((item) => !equippedIds.has(item.id))
  })

  const currentWeight = computed<number>(() => {
    const sum = equippedItemsList.value.reduce((acc, item) => acc + item.weight, 0)
    return Number(sum.toFixed(1))
  })

  const isOverloaded = computed<boolean>(() => currentWeight.value > MAX_CARRY_WEIGHT)

  const bonuses = computed<EquipmentStats>(() => {
    return equippedItemsList.value.reduce(
      (acc, item) => ({
        attack: acc.attack + item.stats.attack,
        defense: acc.defense + item.stats.defense,
        speed: acc.speed + item.stats.speed
      }),
      { attack: 0, defense: 0, speed: 0 }
    )
  })

  const totalStats = computed<EquipmentStats>(() => {
    const rawSpeed = Math.max(0, BASE_STATS.speed + bonuses.value.speed)
    return {
      attack: Math.max(0, BASE_STATS.attack + bonuses.value.attack),
      defense: Math.max(0, BASE_STATS.defense + bonuses.value.defense),
      speed: isOverloaded.value ? 0 : rawSpeed
    }
  })

  function equipItem(item: EquipmentItem) {
    equipped.value[item.slot] = item
  }

  function unequipSlot(slot: SlotType) {
    equipped.value[slot] = null
  }

  function resetBuild() {
    equipped.value = createEmptySlots()
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    equipped,
    baseStats,
    maxWeight,
    backpackItems,
    currentWeight,
    isOverloaded,
    bonuses,
    totalStats,
    equipItem,
    unequipSlot,
    resetBuild
  }
})