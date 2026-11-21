// Ready-made cup illustrations for new menu items. Staff pick one, then a garnish.
export const CUP_LOOKS = [
  { id: 'black', label: 'Black coffee', art: { tint: '#EFE6DC', layers: [{ c: '#2A1810', h: 0.86 }] } },
  { id: 'latte', label: 'Latte', art: { tint: '#EFE7DE', layers: [{ c: '#F3ECE2', h: 0.46 }, { c: '#6B4430', h: 0.4 }] } },
  { id: 'cream-latte', label: 'Creamy latte', art: { tint: '#F4ECDD', layers: [{ c: '#E8D6B8', h: 0.5 }, { c: '#8A5A3C', h: 0.36 }] } },
  { id: 'white', label: 'Milk / coconut', art: { tint: '#EEF3EA', layers: [{ c: '#FBF8F1', h: 0.86 }] } },
  { id: 'orange-coffee', label: 'Citrus coffee', art: { tint: '#FDEBD2', layers: [{ c: '#F59E1B', h: 0.5 }, { c: '#3A2016', h: 0.36 }] } },
  { id: 'red-coffee', label: 'Berry coffee', art: { tint: '#FCE4DC', layers: [{ c: '#E9775F', h: 0.36 }, { c: '#3A2016', h: 0.5 }] } },
  { id: 'green-latte', label: 'Green latte', art: { tint: '#E9F1DE', layers: [{ c: '#6FA23C', h: 0.3 }, { c: '#F1ECE0', h: 0.22 }, { c: '#7A4E36', h: 0.34 }] } },
  { id: 'matcha', label: 'Matcha', art: { tint: '#E9F1DE', layers: [{ c: '#F1ECE0', h: 0.4 }, { c: '#7DAE4A', h: 0.46 }] } },
  { id: 'pink-latte', label: 'Pink latte', art: { tint: '#FBE3E7', layers: [{ c: '#EE9AAA', h: 0.48 }, { c: '#7A4E36', h: 0.38 }] } },
  { id: 'chocolate', label: 'Chocolate', art: { tint: '#EFE3DA', layers: [{ c: '#3E2216', h: 0.26 }, { c: '#EFE6DA', h: 0.26 }, { c: '#6B4430', h: 0.34 }], drizzle: true } },
  { id: 'creamy', label: 'Creamy foam', art: { tint: '#F3E7DA', layers: [{ c: '#5B3522', h: 0.58 }, { c: '#C99A6B', h: 0.28 }], garnish: 'foam', noIce: true } },
  { id: 'cola', label: 'Fizzy coffee', art: { tint: '#EDE7E1', layers: [{ c: '#6B3A22', h: 0.4 }, { c: '#2A1810', h: 0.46 }], bubbles: true } },
  { id: 'blue-soda', label: 'Blue soda', art: { tint: '#DCEEFF', layers: [{ c: '#1C64D6', h: 0.32 }, { c: '#7FB6F2', h: 0.18 }, { c: '#E6F2FF', h: 0.38 }], bubbles: true } },
  { id: 'tea', label: 'Tea / juice', art: { tint: '#FBEBD6', layers: [{ c: '#C8781E', h: 0.86 }] } },
  { id: 'red-soda', label: 'Red soda', art: { tint: '#FCE4E4', layers: [{ c: '#D93A3A', h: 0.4 }, { c: '#F7B2B2', h: 0.46 }], bubbles: true } },
  { id: 'lemon', label: 'Lemonade', art: { tint: '#FFF6D6', layers: [{ c: '#F7D74A', h: 0.4 }, { c: '#FFF3B0', h: 0.46 }], bubbles: true } },
];

export const GARNISH_OPTIONS = [
  { id: '', label: 'None' },
  { id: 'beans', label: 'Coffee beans' },
  { id: 'orange', label: 'Orange' },
  { id: 'grapefruit', label: 'Grapefruit' },
  { id: 'lime', label: 'Lime' },
  { id: 'strawberry', label: 'Strawberry' },
  { id: 'coconut', label: 'Coconut' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'oat', label: 'Oats' },
  { id: 'chocolate', label: 'Chocolate' },
  { id: 'goldfish', label: 'Goldfish' },
];
