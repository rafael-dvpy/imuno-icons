// Arquivo para armazenar todos os dados de ícones organizados por categoria

import immunologyIcons from './immunologyIcons';
import anatomyIcons from './anatomyIcons';
import virusIcons from './virusIcons';
import cellsAndOrganellesIcons from './cellsAndOrganellesIcons';
import equipmentIcons from './equipamentIcons';
import proteinIcons from './proteinsIcons';

export interface IconItem {
  id: string;
  url: string;
}

export interface IconCategories {
  [category: string]: IconItem[] | { [subcategory: string]: IconItem[] };
}

const iconData: IconCategories = {
  "Immunology": immunologyIcons,
  "Anatomy": anatomyIcons,
  "Virus": virusIcons,
  "Cells and Organelles": cellsAndOrganellesIcons,
  "Equipment": equipmentIcons,
  "Proteins": proteinIcons
};

export default iconData; 