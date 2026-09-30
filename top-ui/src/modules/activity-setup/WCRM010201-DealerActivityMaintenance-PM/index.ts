// [WCRM010201] Dealer Activity Maintenance (Activity Setup by Dealer)
export { default as ActivitySetupPage } from './activitySetupPage';
export { default as ServiceRepairSection } from './components/serviceRepairSection';
export { default as ContactChannelSection } from './components/contactChannelSection';
export type { ContactChannelSectionRef } from './components/contactChannelSection';
export {
  activitySetupStyles,
  getCellBorderStyle,
  activityDayDisabledStyle,
  getAssignGroupWrapStyle,
  getStatusColor,
} from './activitySetup.styles';
