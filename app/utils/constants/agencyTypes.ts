// Константы для типов агентств
export interface AgencyType {
  name: string;
  value: string;
}

export const AGENCY_TYPES: AgencyType[] = [
  { name: "ifns", value: "ФНС" },
  { name: "sfr", value: "СФР" },
];

// Функция для получения отображаемого значения по ключу
export const getAgencyTypeDisplayValue = (key: string): string => {
  const type = AGENCY_TYPES.find(t => t.name === key);
  return type ? type.value : key;
};