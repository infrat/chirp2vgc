import { MappingConfig, CsvData } from './csv-mapper.service';

export const CSV_MAPPINGS: { [key: string]: MappingConfig } = {
  standardToVGC: {
    name: 'Standard CSV to VGC Format',
    description: 'Converts a standard CSV format to VGC format',
    columnDefinitions: [
      { field: 'title', editable: true, defaultValue: '' },
      { field: 'tx_freq', editable: true, type: 'number', defaultValue: '' },
      { field: 'rx_freq', editable: true, type: 'number', defaultValue: '' },
      {
        field: 'tx_sub_audio (CTCSS=freq/DCS=number)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'rx_sub_audio (CTCSS=freq/DCS=number)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'tx_power (H/M/L)',
        editable: true,
        type: 'string',
        defaultValue: '',
      },
      {
        field: 'bandwidth (12500/25000)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'scan (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'talk_around (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'pre_de_emph_bypass (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'sign (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'tx_dis (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'mute (0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '',
      },
      {
        field: 'rx_modulation (0=FM/1=AM)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'tx_modulation (0=FM/1=AM)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
    ],

    rules: [
      { sourceField: 'Name', targetField: 'title' },
      {
        sourceField: 'Frequency',
        targetField: 'rx_freq',
        transform: (value) => `${+value * 1000000}`,
      },
      {
        sourceField: 'Frequency',
        targetField: 'tx_freq',
        transform: (value, row) => {
          if (!row['Offset'] || !row['Duplex']) {
            return `${+value * 1000000}`;
          }
          const offset = +row['Offset'] * 1000000;
          const rxFreq = +row['Frequency'] * 1000000;

          if (row['Duplex'] === '-') return `${rxFreq - offset}`;
          if (row['Duplex'] === '+') return `${rxFreq + offset}`;
          return `${rxFreq}`;
        },
      },
      { sourceField: 'Level', targetField: 'level' },
      { sourceField: 'HP', targetField: 'hp' },
      { sourceField: 'Attack', targetField: 'atk' },
      { sourceField: 'Defense', targetField: 'def' },
      { sourceField: 'SpAttack', targetField: 'spa' },
      { sourceField: 'SpDefense', targetField: 'spd' },
      { sourceField: 'Speed', targetField: 'spe' },
      { sourceField: 'Speed', targetField: 'spe' },

      // Combine multiple moves into a single field
      {
        sourceField: 'Move1',
        targetField: 'moves',
        transform: (value, row) => {
          const moves = [];
          if (row['Move1']) moves.push(row['Move1']);
          if (row['Move2']) moves.push(row['Move2']);
          if (row['Move3']) moves.push(row['Move3']);
          if (row['Move4']) moves.push(row['Move4']);
          return moves.join(',');
        },
      },

      // Format ability with hidden flag
      {
        sourceField: 'Ability',
        targetField: 'ability',
        transform: (value, row) =>
          row['IsHiddenAbility'] === 'true' ? `${value} (H)` : value,
      },
    ],
  },

  // /**
  //  * Example: Convert inventory data with one-to-many relationship
  //  */
  // inventoryToLineItems: {
  //   name: 'Inventory to Line Items',
  //   description: 'Expands inventory items into individual line items',
  //   rules: [
  //     { sourceField: 'ItemID', targetField: 'ItemID' },
  //     { sourceField: 'ItemName', targetField: 'ItemName' },
  //     { sourceField: 'Category', targetField: 'Category' },

  //     // Line item will have specific quantity = 1
  //     {
  //       sourceField: 'Quantity',
  //       targetField: 'Quantity',
  //       transform: () => '1', // Each line item has quantity of 1
  //     },

  //     // Line item price is same as original item
  //     { sourceField: 'Price', targetField: 'Price' },
  //   ],
  //   // Expand each row into multiple rows based on quantity
  //   expandRow: (row) => {
  //     const quantity = parseInt(row['Quantity'] || '0');
  //     // Create array with 'quantity' number of items
  //     return Array.from({ length: quantity }, (_, i) => ({
  //       LineNumber: (i + 1).toString(),
  //       ItemPosition: (i + 1).toString(), // Add position info to each line item
  //     }));
  //   },
  // },

  // /**
  //  * Example: Custom Chirp2VGC mapping
  //  */
  // chirpToVGC: {
  //   name: 'Chirp to VGC Format',
  //   description: 'Converts Chirp format to VGC format',
  //   defaultValue: '',
  //   rules: [
  //     { sourceField: 'Species', targetField: 'Species' },
  //     { sourceField: 'Level', targetField: 'Level' },
  //     // Transform gender to VGC format (M/F/N)
  //     {
  //       sourceField: 'Gender',
  //       targetField: 'Gender',
  //       transform: (value) => {
  //         if (!value) return 'N';
  //         value = value.trim().toLowerCase();
  //         if (value === 'male') return 'M';
  //         if (value === 'female') return 'F';
  //         return 'N';
  //       },
  //     },
  //     // Generate SpeciesName+Gender field
  //     {
  //       sourceField: 'Species',
  //       targetField: 'DisplayName',
  //       transform: (value, row) => {
  //         const gender = row['Gender']
  //           ? row['Gender'].trim().toLowerCase()
  //           : '';
  //         if (gender === 'male') return `${value} (M)`;
  //         if (gender === 'female') return `${value} (F)`;
  //         return value;
  //       },
  //     },
  //     // Nature can be mapped directly
  //     { sourceField: 'Nature', targetField: 'Nature' },
  //     // Ability can be mapped directly
  //     { sourceField: 'Ability', targetField: 'Ability' },
  //     // Map individual stats
  //     { sourceField: 'HP', targetField: 'HP' },
  //     { sourceField: 'Atk', targetField: 'Attack' },
  //     { sourceField: 'Def', targetField: 'Defense' },
  //     { sourceField: 'SpA', targetField: 'SpecialAttack' },
  //     { sourceField: 'SpD', targetField: 'SpecialDefense' },
  //     { sourceField: 'Spe', targetField: 'Speed' },
  //     // Combine moves into a formatted string
  //     {
  //       sourceField: 'Move1',
  //       targetField: 'Moves',
  //       transform: (value, row) => {
  //         const moves = [];
  //         if (row['Move1']) moves.push(row['Move1']);
  //         if (row['Move2']) moves.push(row['Move2']);
  //         if (row['Move3']) moves.push(row['Move3']);
  //         if (row['Move4']) moves.push(row['Move4']);
  //         return moves.join(' / ');
  //       },
  //     },
  //     // Combine EVs into a formatted string
  //     {
  //       sourceField: 'EVHP',
  //       targetField: 'EVs',
  //       transform: (value, row) => {
  //         const evs = [];
  //         if (row['EVHP'] && parseInt(row['EVHP']) > 0)
  //           evs.push(`${row['EVHP']} HP`);
  //         if (row['EVAtk'] && parseInt(row['EVAtk']) > 0)
  //           evs.push(`${row['EVAtk']} Atk`);
  //         if (row['EVDef'] && parseInt(row['EVDef']) > 0)
  //           evs.push(`${row['EVDef']} Def`);
  //         if (row['EVSpA'] && parseInt(row['EVSpA']) > 0)
  //           evs.push(`${row['EVSpA']} SpA`);
  //         if (row['EVSpD'] && parseInt(row['EVSpD']) > 0)
  //           evs.push(`${row['EVSpD']} SpD`);
  //         if (row['EVSpe'] && parseInt(row['EVSpe']) > 0)
  //           evs.push(`${row['EVSpe']} Spe`);
  //         return evs.join(' / ');
  //       },
  //     },
  //     // Combine IVs into a formatted string
  //     {
  //       sourceField: 'IVHP',
  //       targetField: 'IVs',
  //       transform: (value, row) => {
  //         const ivs = [];
  //         if (row['IVHP'] && parseInt(row['IVHP']) < 31)
  //           ivs.push(`${row['IVHP']} HP`);
  //         if (row['IVAtk'] && parseInt(row['IVAtk']) < 31)
  //           ivs.push(`${row['IVAtk']} Atk`);
  //         if (row['IVDef'] && parseInt(row['IVDef']) < 31)
  //           ivs.push(`${row['IVDef']} Def`);
  //         if (row['IVSpA'] && parseInt(row['IVSpA']) < 31)
  //           ivs.push(`${row['IVSpA']} SpA`);
  //         if (row['IVSpD'] && parseInt(row['IVSpD']) < 31)
  //           ivs.push(`${row['IVSpD']} SpD`);
  //         if (row['IVSpe'] && parseInt(row['IVSpe']) < 31)
  //           ivs.push(`${row['IVSpe']} Spe`);
  //         return ivs.join(' / ');
  //       },
  //     },
  //   ],
  // },
};

/**
 * Helper function to create a custom mapping configuration on the fly
 * @param sourceCsv Sample source CSV data
 * @param targetCsv Sample target CSV data
 * @returns A basic mapping configuration
 */
export function createBasicMapping(
  sourceCsv: CsvData[],
  targetCsv: CsvData[]
): MappingConfig {
  if (!sourceCsv.length || !targetCsv.length) {
    throw new Error(
      'Both source and target samples must contain at least one row'
    );
  }

  // Get all unique field names from source and target
  const sourceFields = Object.keys(sourceCsv[0]);
  const targetFields = Object.keys(targetCsv[0]);

  // Create mapping rules by matching field names (case-insensitive)
  const rules: MappingConfig['rules'] = [];

  for (const targetField of targetFields) {
    // Look for exact match first
    let sourceField = sourceFields.find((field) => field === targetField);

    // If no exact match, try case-insensitive match
    if (!sourceField) {
      sourceField = sourceFields.find(
        (field) => field.toLowerCase() === targetField.toLowerCase()
      );
    }

    // If match found, add a mapping rule
    if (sourceField) {
      rules.push({
        sourceField,
        targetField,
      });
    }
  }

  return {
    name: 'Auto-generated Mapping',
    description: 'Automatically generated mapping based on field names',
    columnDefinitions: [],
    rules,
  };
}
