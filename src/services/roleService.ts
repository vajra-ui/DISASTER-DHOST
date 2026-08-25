import { UserRole, IncidentStatus } from '../types/dhostAuth';

export class RoleService {
  public static canAccessCommandCenter(role?: UserRole | null): boolean {
    return role === 'COMMANDER';
  }

  public static canAccessRescueDashboard(role?: UserRole | null): boolean {
    return role === 'RESCUE_TEAM' || role === 'COMMANDER';
  }


  public static canAccessMedicalDashboard(role?: UserRole | null): boolean {
    return role === 'MEDICAL' || role === 'COMMANDER';
  }


  public static canAssignTeams(role?: UserRole | null): boolean {
    return role === 'COMMANDER';
  }


  public static canChangeGlobalPriority(role?: UserRole | null): boolean {
    return role === 'COMMANDER';
  }


  public static canUpdateIncidentStatus(role: UserRole | null | undefined, _targetStatus: IncidentStatus): boolean {
    if (!role) return false;
    return role === 'COMMANDER' || role === 'RESCUE_TEAM' || role === 'MEDICAL';
  }

  public static canSimulateDisaster(role?: UserRole | null): boolean {
    return role === 'COMMANDER';
  }


  public static getDefaultRouteForRole(role?: UserRole | null): string {
    switch (role) {
      case 'COMMANDER':
        return '/command';
      case 'RESCUE_TEAM':
        return '/rescue';
      case 'MEDICAL':
        return '/medical';
      case 'VOLUNTEER':
        return '/help-others';
      default:
        return '/';
    }
  }

  public static getRoleLabel(role?: UserRole | null): string {
    switch (role) {
      case 'COMMANDER':
        return 'Incident Commander';
      case 'RESCUE_TEAM':
        return 'Rescue Response Team';
      case 'MEDICAL':
        return 'Medical Triage Unit';
      case 'VOLUNTEER':
        return 'Community Volunteer';
      default:
        return 'Citizen / Victim';
    }
  }

  public static getRoleBadgeColor(role?: UserRole | null): { bg: string; text: string; border: string } {
    switch (role) {
      case 'COMMANDER':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' };
      case 'RESCUE_TEAM':
        return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' };
      case 'MEDICAL':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' };
      case 'VOLUNTEER':
        return { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30' };
    }
  }
}
