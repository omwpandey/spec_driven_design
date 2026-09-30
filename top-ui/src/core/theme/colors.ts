/**
 * TOPSCRM Color Palette
 * 
 * Standards:
 * - Mandatory fields: #EB0A1E (red) with * after text
 * - Non-mandatory fields: #58595B (dark grey)
 * - Error snackbar: Maroon background
 * - Warning snackbar: Orange background
 * - Success snackbar: Green background
 */
export const colors = {
  primary: {
    main: '#EB0A1E',       // Toyota Red (mandatory, primary actions)
    dark: '#C00818',
    light: '#FF3333',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#58595B',       // Dark grey (non-mandatory labels)
    dark: '#333333',
    light: '#7A7A7A',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
    sidebar: '#EB0A1E',
    sidebarHover: '#C00818',
    sidebarActive: '#FFFFFF',
    header: '#FFFFFF',
    topBar: '#EB0A1E',
  },
  text: {
    primary: '#333333',
    secondary: '#49454F',   // Non-mandatory label color
    disabled: '#999999',
    white: '#FFFFFF',
  },
  mandatory: '#EB0A1E',    // Mandatory field label + asterisk color
  nonMandatory: '#58595B', // Non-mandatory field label color
  border: {
    light: '#E0E0E0',
    main: '#CCCCCC',
    dark: '#999999',
  },
  status: {
    success: '#4CAF50',    // Green snackbar
    warning: '#FF9800',    // Orange snackbar
    error: '#800000',      // Maroon snackbar (as per standard)
    info: '#2196F3',
  },
  snackbar: {
    error: '#800000',      // Maroon background for errors
    warning: '#FF9800',    // Orange background for warnings
    success: '#4CAF50',    // Green background for success
    info: '#2196F3',
  },
  table: {
    headerBg: '#FFEBEE',
    headerBgAlt: '#FEF3F4',   // slightly warmer pink used by some section tables
    headerText: '#EB0A1E',
    rowHover: '#FFF5F5',
    rowHoverAlt: '#FFFAFA',
    border: '#E0E0E0',
    borderAlt: '#E6E6E6',
  },
  // ─── Neutral / grey scale (previously hardcoded across style files) ───
  neutral: {
    100: '#F5F5F5',   // light surface / hover bg
    150: '#F3F3F3',   // disabled surface
    200: '#F0F0F0',   // chip bg
    300: '#E6E6E6',   // border alt
    400: '#BDBDBD',   // hover border / toggle off track
    500: '#9E9E9E',   // hover border (buttons)
    black: '#1A1A1A', // near-black text (inputs, tmt labels)
    dark2: '#222222',
    dark3: '#555555',
  },
  // ─── Extended greys used for secondary text/icons ───
  grey: {
    muted: '#666666',    // hint / caption text
    slate: '#596475',    // metric label text
    slate2: '#4B5563',   // metric value text
  },
  // ─── Input control borders/surfaces ───
  input: {
    border: '#E5E7EB',
    disabledBg: '#F5F5F5',
    caret: '#6B7280',
  },
  // ─── Chart accent palette (dashboard) ───
  chart: {
    red: '#EB0A1E',
    blue: '#087DA8',
    orange: '#F07C23',
    green: '#21A357',
    gray: '#6D7884',
  },
};
