/* eslint-disable prettier/prettier */
/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 * */

import config from '@lib/services/auth/config.json';

const { domain, clientId, authorizationParams: { audience }, apiUri, errorPath } = config as {
    domain: string;
    clientId: string;
    authorizationParams: {
        audience: string;
    };
    apiUri: string;
    errorPath: string;
};


export const environment = {
    production: false,
    apiUri: apiUri, // need to disable as http intercepter get to be in place.
    auth: {
        domain,
        clientId,
        audience,
        redirectUri: window.location.origin,
        errorPath,
    },
    httpInterceptor: {
        allowedList: [`${apiUri}/*`],
    },
};
