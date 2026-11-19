export type SlotType = 'helmet' | 'armor' | 'weapon' | 'boots'

export interface EquipmentItem {
  id: number
  name: string
  slot: SlotType
  attack: number
  defense: number
  speed: number
  weight: number
}

export type EquippedGear = Record<SlotType, EquipmentItem | null>