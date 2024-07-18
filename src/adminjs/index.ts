import AdminJs from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import AdminJsSequelize from '@adminjs/sequelize'
import { sequelize } from "../database";
import { adminJsResourcesOptions } from './resources';
import { locale } from './locale';
import { dashboardOptions } from './dashboard';
import { brandingOptions } from './branding';
import { authenticationOptions } from './authentication';

AdminJs.registerAdapter(AdminJsSequelize);

export const adminJs = new AdminJs({
  databases: [sequelize],
  rootPath: "/admin",
  resources: adminJsResourcesOptions,
  branding: brandingOptions,
  locale: locale,
  dashboard: dashboardOptions
});

export const adminJsRouter = AdminJsExpress.buildAuthenticatedRouter(
  adminJs,
  authenticationOptions,
  null,
  {
    resave: false,
    saveUninitialized: true
  }
);