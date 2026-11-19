export type SlotType = 'helmet' | 'armor' | 'weapon' | 'boots'

export interface EquipmentStats {
  attack: number
  defense: number
  speed: number
}

export interface EquipmentItem {
  id: string
  name: string
  slot: SlotType
  weight: number
  stats: EquipmentStats
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export type EquippedSlots = Record<SlotType, EquipmentItem | null>

export interface StatDiff {
  attack: number
  defense: number
  speed: number
  weight: number
}