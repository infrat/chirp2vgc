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
        field: 'tx_sub_audio(CTCSS=freq/DCS=number)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'rx_sub_audio(CTCSS=freq/DCS=number)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'tx_power(H/M/L)',
        editable: true,
        type: 'string',
        defaultValue: 'H',
      },
      {
        field: 'bandwidth(12500/25000)',
        editable: true,
        type: 'number',
        defaultValue: '',
      },
      {
        field: 'scan(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '1',
      },
      {
        field: 'talk_around(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '0',
      },
      {
        field: 'pre_de_emph_bypass(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '0',
      },
      {
        field: 'sign(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '0',
      },
      {
        field: 'tx_dis(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '0',
      },
      {
        field: 'mute(0=OFF/1=ON)',
        editable: true,
        type: 'boolean',
        defaultValue: '0',
      },
      {
        field: 'rx_modulation(0=FM/1=AM)',
        editable: true,
        type: 'number',
        defaultValue: '0',
      },
      {
        field: 'tx_modulation(0=FM/1=AM)',
        editable: true,
        type: 'number',
        defaultValue: '0',
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
      {
        sourceField: 'rToneFreq',
        targetField: 'rx_sub_audio(CTCSS=freq/DCS=number)',
        transform: (value, row) => {
          if (!row['Tone']) {
            return '0';
          }
          const toneMode = row['Tone'];
          if (toneMode === 'TSQL') {
            return `${Math.round(+value * 100)}`;
          }
          if (toneMode === 'DTCS') {
            return null;
          }
          return '0';
        },
      },
      {
        sourceField: 'cToneFreq',
        targetField: 'tx_sub_audio(CTCSS=freq/DCS=number)',
        transform: (value, row) => {
          if (!row['Tone']) {
            return '0';
          }
          const tone = row['Tone'];
          if (tone === 'Tone' || tone === 'TSQL') {
            return `${Math.round(+value * 100)}`;
          }
          if (tone === 'DTCS') {
            return null;
          }
          return '0';
        },
      },
      {
        sourceField: 'RxDtcsCode',
        targetField: 'rx_sub_audio(CTCSS=freq/DCS=number)',
        transform: (value, row) => {
          if (!row['Tone']) {
            return '0';
          }
          const tone = row['Tone'];
          if (tone === 'DTCS') {
            return `${+value}`;
          }
          if (tone === 'Tone' || tone === 'TSQL') {
            return null;
          }
          return '0';
        },
      },
      {
        sourceField: 'DtcsCode',
        targetField: 'tx_sub_audio(CTCSS=freq/DCS=number)',
        transform: (value, row) => {
          if (!row['Tone']) {
            return '0';
          }
          const tone = row['Tone'];
          if (tone === 'DTCS') {
            return `${+value}`;
          }
          if (tone === 'Tone' || tone === 'TSQL') {
            return null;
          }
          return '0';
        },
      },
      {
        sourceField: 'Mode',
        targetField: 'bandwidth(12500/25000)',
        transform: (value, row) => {
          if (value === 'FM' || !value) {
            return '25000';
          }
          if (value === 'NFM') {
            return '12500';
          }
          return '12500';
        },
      },
      {
        sourceField: 'Mode',
        targetField: 'rx_modulation(0=FM/1=AM)',
        transform: (value, row) => {
          if (value === 'FM' || value === 'NFM' || !value) {
            return '0';
          }
          return '1';
        },
      },
      {
        sourceField: 'Mode',
        targetField: 'tx_modulation(0=FM/1=AM)',
        transform: (value, row) => {
          if (value === 'FM' || value === 'NFM' || !value) {
            return '0';
          }
          return '1';
        },
      },
      {
        sourceField: 'Duplex',
        targetField: 'tx_dis(0=OFF/1=ON)',
        transform: (value, row) => {
          if (value === 'off') {
            return '1';
          }
          return null;
        },
      },
    ],
  },
};
