import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Catalogos',
    iconName: 'home',
    route: 'catalogs',
    bgcolor: 'primary',
    children: [
      {
        displayName: 'Ubicaciones',
        iconName: 'point',
        route: 'catalogs/ubications',
      },
      {
        displayName: 'Clientes',
        iconName: 'point',
        route: 'catalogs/customers',
      },
      {
        displayName: 'Conductores',
        iconName: 'point',
        route: 'catalogs/drivers',
      },
      {
        displayName: 'Vehiculos',
        iconName: 'point',
        route: 'catalogs/trucks',
      },
      {
        displayName: 'Preguntas',
        iconName: 'point',
        route: 'catalogs/questions',
      },
    ],
  },
  {
    displayName: 'Configuraciones',
    iconName: 'apps',
    route: 'settings',
    bgcolor: 'accent',
    ddType: '',
    children: [
      {
        displayName: 'Usuarios',
        iconName: 'point',
        route: 'settings/users',
      },
      {
        displayName: 'K9',
        iconName: 'point',
        route: 'settings/k9',
      },
      {
        displayName: 'Asignacion Binomios',
        iconName: 'point',
        route: 'settings/asign-bonimio',
      },
      {
        displayName: 'Certificaciones',
        iconName: 'point',
        route: 'settings/certifications',
      }
    ],
  },
  {
    displayName: 'Inspeccion',
    iconName: 'components',
    route: 'inspections',
    bgcolor: 'warning',
    ddType: '',
    children: [
      {
        displayName: 'Inspecciones',
        iconName: 'point',
        route: 'inspection/inspections',
      },
      {
        displayName: 'Cuarentenas',
        iconName: 'point',
        route: 'inspection/cuarentenas',
      }
    ],
  },
  {
    displayName: 'Clientes',
    iconName: 'file-description',
    bgcolor: 'error',
    route: 'customers',
    children: [
      {
        displayName: 'Mis Inspecciones',
        iconName: 'point',
        route: 'customers/my-inspections',
      },
      {
        displayName: 'Cuarentenas',
        iconName: 'point',
        route: 'customers/cuarentenas',
      }
    ],
  },
  {
    displayName: 'Reportes',
    iconName: 'clipboard',
    route: 'reports',
    bgcolor: 'success',
    children: [
      {
        displayName: 'Logs',
        iconName: 'point',
        route: 'reports/logs',
      },
      {
        displayName: 'Inspecciones',
        iconName: 'point',
        route: 'reports/inspecciones',
      }
    ],
  }
];
