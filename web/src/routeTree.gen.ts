/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as StandistsImport } from './routes/standists'
import { Route as StaffImport } from './routes/staff'
import { Route as RallyistsImport } from './routes/_rallyists'
import { Route as StandistsIndexImport } from './routes/standists/index'
import { Route as StaffIndexImport } from './routes/staff/index'
import { Route as RallyistsIndexImport } from './routes/_rallyists/index'
import { Route as StandistsQrcodeImport } from './routes/standists/qrcode'
import { Route as StaffWheelImport } from './routes/staff/wheel'
import { Route as StaffCodeImport } from './routes/staff/code'
import { Route as RallyistsSubmitImport } from './routes/_rallyists/submit'
import { Route as RallyistsRulesImport } from './routes/_rallyists/rules'
import { Route as RallyistsCodeImport } from './routes/_rallyists/code'
import { Route as StaffGenQrcodeIndexImport } from './routes/staff/gen-qrcode/index'
import { Route as RallyistsSubmitIndexImport } from './routes/_rallyists/submit/index'
import { Route as RallyistsStampsIndexImport } from './routes/_rallyists/stamps/index'
import { Route as RallyistsArtistsIndexImport } from './routes/_rallyists/artists/index'
import { Route as StaffSubmissionSubmissionidImport } from './routes/staff/submission.$submissionid'
import { Route as StaffGenQrcodeUserIdImport } from './routes/staff/gen-qrcode/$userId'
import { Route as RallyistsStampsScannerImport } from './routes/_rallyists/stamps/scanner'

// Create Virtual Routes

const StandistsSigninLazyImport = createFileRoute('/standists/signin')()
const StaffSigninLazyImport = createFileRoute('/staff/signin')()
const RallyistsMapLazyImport = createFileRoute('/_rallyists/map')()

// Create/Update Routes

const StandistsRoute = StandistsImport.update({
  path: '/standists',
  getParentRoute: () => rootRoute,
} as any)

const StaffRoute = StaffImport.update({
  path: '/staff',
  getParentRoute: () => rootRoute,
} as any)

const RallyistsRoute = RallyistsImport.update({
  id: '/_rallyists',
  getParentRoute: () => rootRoute,
} as any)

const StandistsIndexRoute = StandistsIndexImport.update({
  path: '/',
  getParentRoute: () => StandistsRoute,
} as any)

const StaffIndexRoute = StaffIndexImport.update({
  path: '/',
  getParentRoute: () => StaffRoute,
} as any)

const RallyistsIndexRoute = RallyistsIndexImport.update({
  path: '/',
  getParentRoute: () => RallyistsRoute,
} as any)

const StandistsSigninLazyRoute = StandistsSigninLazyImport.update({
  path: '/signin',
  getParentRoute: () => StandistsRoute,
} as any).lazy(() =>
  import('./routes/standists/signin.lazy').then((d) => d.Route),
)

const StaffSigninLazyRoute = StaffSigninLazyImport.update({
  path: '/signin',
  getParentRoute: () => StaffRoute,
} as any).lazy(() => import('./routes/staff/signin.lazy').then((d) => d.Route))

const RallyistsMapLazyRoute = RallyistsMapLazyImport.update({
  path: '/map',
  getParentRoute: () => RallyistsRoute,
} as any).lazy(() =>
  import('./routes/_rallyists/map.lazy').then((d) => d.Route),
)

const StandistsQrcodeRoute = StandistsQrcodeImport.update({
  path: '/qrcode',
  getParentRoute: () => StandistsRoute,
} as any)

const StaffWheelRoute = StaffWheelImport.update({
  path: '/wheel',
  getParentRoute: () => StaffRoute,
} as any)

const StaffCodeRoute = StaffCodeImport.update({
  path: '/code',
  getParentRoute: () => StaffRoute,
} as any)

const RallyistsSubmitRoute = RallyistsSubmitImport.update({
  path: '/submit',
  getParentRoute: () => RallyistsRoute,
} as any)

const RallyistsRulesRoute = RallyistsRulesImport.update({
  path: '/rules',
  getParentRoute: () => RallyistsRoute,
} as any)

const RallyistsCodeRoute = RallyistsCodeImport.update({
  path: '/code',
  getParentRoute: () => RallyistsRoute,
} as any)

const StaffGenQrcodeIndexRoute = StaffGenQrcodeIndexImport.update({
  path: '/gen-qrcode/',
  getParentRoute: () => StaffRoute,
} as any)

const RallyistsSubmitIndexRoute = RallyistsSubmitIndexImport.update({
  path: '/',
  getParentRoute: () => RallyistsSubmitRoute,
} as any)

const RallyistsStampsIndexRoute = RallyistsStampsIndexImport.update({
  path: '/stamps/',
  getParentRoute: () => RallyistsRoute,
} as any)

const RallyistsArtistsIndexRoute = RallyistsArtistsIndexImport.update({
  path: '/artists/',
  getParentRoute: () => RallyistsRoute,
} as any)

const StaffSubmissionSubmissionidRoute =
  StaffSubmissionSubmissionidImport.update({
    path: '/submission/$submissionid',
    getParentRoute: () => StaffRoute,
  } as any)

const StaffGenQrcodeUserIdRoute = StaffGenQrcodeUserIdImport.update({
  path: '/gen-qrcode/$userId',
  getParentRoute: () => StaffRoute,
} as any)

const RallyistsStampsScannerRoute = RallyistsStampsScannerImport.update({
  path: '/stamps/scanner',
  getParentRoute: () => RallyistsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_rallyists': {
      id: '/_rallyists'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof RallyistsImport
      parentRoute: typeof rootRoute
    }
    '/staff': {
      id: '/staff'
      path: '/staff'
      fullPath: '/staff'
      preLoaderRoute: typeof StaffImport
      parentRoute: typeof rootRoute
    }
    '/standists': {
      id: '/standists'
      path: '/standists'
      fullPath: '/standists'
      preLoaderRoute: typeof StandistsImport
      parentRoute: typeof rootRoute
    }
    '/_rallyists/code': {
      id: '/_rallyists/code'
      path: '/code'
      fullPath: '/code'
      preLoaderRoute: typeof RallyistsCodeImport
      parentRoute: typeof RallyistsImport
    }
    '/_rallyists/rules': {
      id: '/_rallyists/rules'
      path: '/rules'
      fullPath: '/rules'
      preLoaderRoute: typeof RallyistsRulesImport
      parentRoute: typeof RallyistsImport
    }
    '/_rallyists/submit': {
      id: '/_rallyists/submit'
      path: '/submit'
      fullPath: '/submit'
      preLoaderRoute: typeof RallyistsSubmitImport
      parentRoute: typeof RallyistsImport
    }
    '/staff/code': {
      id: '/staff/code'
      path: '/code'
      fullPath: '/staff/code'
      preLoaderRoute: typeof StaffCodeImport
      parentRoute: typeof StaffImport
    }
    '/staff/wheel': {
      id: '/staff/wheel'
      path: '/wheel'
      fullPath: '/staff/wheel'
      preLoaderRoute: typeof StaffWheelImport
      parentRoute: typeof StaffImport
    }
    '/standists/qrcode': {
      id: '/standists/qrcode'
      path: '/qrcode'
      fullPath: '/standists/qrcode'
      preLoaderRoute: typeof StandistsQrcodeImport
      parentRoute: typeof StandistsImport
    }
    '/_rallyists/map': {
      id: '/_rallyists/map'
      path: '/map'
      fullPath: '/map'
      preLoaderRoute: typeof RallyistsMapLazyImport
      parentRoute: typeof RallyistsImport
    }
    '/staff/signin': {
      id: '/staff/signin'
      path: '/signin'
      fullPath: '/staff/signin'
      preLoaderRoute: typeof StaffSigninLazyImport
      parentRoute: typeof StaffImport
    }
    '/standists/signin': {
      id: '/standists/signin'
      path: '/signin'
      fullPath: '/standists/signin'
      preLoaderRoute: typeof StandistsSigninLazyImport
      parentRoute: typeof StandistsImport
    }
    '/_rallyists/': {
      id: '/_rallyists/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof RallyistsIndexImport
      parentRoute: typeof RallyistsImport
    }
    '/staff/': {
      id: '/staff/'
      path: '/'
      fullPath: '/staff/'
      preLoaderRoute: typeof StaffIndexImport
      parentRoute: typeof StaffImport
    }
    '/standists/': {
      id: '/standists/'
      path: '/'
      fullPath: '/standists/'
      preLoaderRoute: typeof StandistsIndexImport
      parentRoute: typeof StandistsImport
    }
    '/_rallyists/stamps/scanner': {
      id: '/_rallyists/stamps/scanner'
      path: '/stamps/scanner'
      fullPath: '/stamps/scanner'
      preLoaderRoute: typeof RallyistsStampsScannerImport
      parentRoute: typeof RallyistsImport
    }
    '/staff/gen-qrcode/$userId': {
      id: '/staff/gen-qrcode/$userId'
      path: '/gen-qrcode/$userId'
      fullPath: '/staff/gen-qrcode/$userId'
      preLoaderRoute: typeof StaffGenQrcodeUserIdImport
      parentRoute: typeof StaffImport
    }
    '/staff/submission/$submissionid': {
      id: '/staff/submission/$submissionid'
      path: '/submission/$submissionid'
      fullPath: '/staff/submission/$submissionid'
      preLoaderRoute: typeof StaffSubmissionSubmissionidImport
      parentRoute: typeof StaffImport
    }
    '/_rallyists/artists/': {
      id: '/_rallyists/artists/'
      path: '/artists'
      fullPath: '/artists'
      preLoaderRoute: typeof RallyistsArtistsIndexImport
      parentRoute: typeof RallyistsImport
    }
    '/_rallyists/stamps/': {
      id: '/_rallyists/stamps/'
      path: '/stamps'
      fullPath: '/stamps'
      preLoaderRoute: typeof RallyistsStampsIndexImport
      parentRoute: typeof RallyistsImport
    }
    '/_rallyists/submit/': {
      id: '/_rallyists/submit/'
      path: '/'
      fullPath: '/submit/'
      preLoaderRoute: typeof RallyistsSubmitIndexImport
      parentRoute: typeof RallyistsSubmitImport
    }
    '/staff/gen-qrcode/': {
      id: '/staff/gen-qrcode/'
      path: '/gen-qrcode'
      fullPath: '/staff/gen-qrcode'
      preLoaderRoute: typeof StaffGenQrcodeIndexImport
      parentRoute: typeof StaffImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  RallyistsRoute: RallyistsRoute.addChildren({
    RallyistsCodeRoute,
    RallyistsRulesRoute,
    RallyistsSubmitRoute: RallyistsSubmitRoute.addChildren({
      RallyistsSubmitIndexRoute,
    }),
    RallyistsMapLazyRoute,
    RallyistsIndexRoute,
    RallyistsStampsScannerRoute,
    RallyistsArtistsIndexRoute,
    RallyistsStampsIndexRoute,
  }),
  StaffRoute: StaffRoute.addChildren({
    StaffCodeRoute,
    StaffWheelRoute,
    StaffSigninLazyRoute,
    StaffIndexRoute,
    StaffGenQrcodeUserIdRoute,
    StaffSubmissionSubmissionidRoute,
    StaffGenQrcodeIndexRoute,
  }),
  StandistsRoute: StandistsRoute.addChildren({
    StandistsQrcodeRoute,
    StandistsSigninLazyRoute,
    StandistsIndexRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_rallyists",
        "/staff",
        "/standists"
      ]
    },
    "/_rallyists": {
      "filePath": "_rallyists.tsx",
      "children": [
        "/_rallyists/code",
        "/_rallyists/rules",
        "/_rallyists/submit",
        "/_rallyists/map",
        "/_rallyists/",
        "/_rallyists/stamps/scanner",
        "/_rallyists/artists/",
        "/_rallyists/stamps/"
      ]
    },
    "/staff": {
      "filePath": "staff.tsx",
      "children": [
        "/staff/code",
        "/staff/wheel",
        "/staff/signin",
        "/staff/",
        "/staff/gen-qrcode/$userId",
        "/staff/submission/$submissionid",
        "/staff/gen-qrcode/"
      ]
    },
    "/standists": {
      "filePath": "standists.tsx",
      "children": [
        "/standists/qrcode",
        "/standists/signin",
        "/standists/"
      ]
    },
    "/_rallyists/code": {
      "filePath": "_rallyists/code.tsx",
      "parent": "/_rallyists"
    },
    "/_rallyists/rules": {
      "filePath": "_rallyists/rules.tsx",
      "parent": "/_rallyists"
    },
    "/_rallyists/submit": {
      "filePath": "_rallyists/submit.tsx",
      "parent": "/_rallyists",
      "children": [
        "/_rallyists/submit/"
      ]
    },
    "/staff/code": {
      "filePath": "staff/code.tsx",
      "parent": "/staff"
    },
    "/staff/wheel": {
      "filePath": "staff/wheel.tsx",
      "parent": "/staff"
    },
    "/standists/qrcode": {
      "filePath": "standists/qrcode.tsx",
      "parent": "/standists"
    },
    "/_rallyists/map": {
      "filePath": "_rallyists/map.lazy.tsx",
      "parent": "/_rallyists"
    },
    "/staff/signin": {
      "filePath": "staff/signin.lazy.tsx",
      "parent": "/staff"
    },
    "/standists/signin": {
      "filePath": "standists/signin.lazy.tsx",
      "parent": "/standists"
    },
    "/_rallyists/": {
      "filePath": "_rallyists/index.tsx",
      "parent": "/_rallyists"
    },
    "/staff/": {
      "filePath": "staff/index.tsx",
      "parent": "/staff"
    },
    "/standists/": {
      "filePath": "standists/index.tsx",
      "parent": "/standists"
    },
    "/_rallyists/stamps/scanner": {
      "filePath": "_rallyists/stamps/scanner.tsx",
      "parent": "/_rallyists"
    },
    "/staff/gen-qrcode/$userId": {
      "filePath": "staff/gen-qrcode/$userId.tsx",
      "parent": "/staff"
    },
    "/staff/submission/$submissionid": {
      "filePath": "staff/submission.$submissionid.tsx",
      "parent": "/staff"
    },
    "/_rallyists/artists/": {
      "filePath": "_rallyists/artists/index.tsx",
      "parent": "/_rallyists"
    },
    "/_rallyists/stamps/": {
      "filePath": "_rallyists/stamps/index.tsx",
      "parent": "/_rallyists"
    },
    "/_rallyists/submit/": {
      "filePath": "_rallyists/submit/index.tsx",
      "parent": "/_rallyists/submit"
    },
    "/staff/gen-qrcode/": {
      "filePath": "staff/gen-qrcode/index.tsx",
      "parent": "/staff"
    }
  }
}
ROUTE_MANIFEST_END */
