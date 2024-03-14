/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 * */

import config from '@lib/services/auth/config.json';

const {
    domain,
    clientId,
    authorizationParams: { audience },
    apiUri,
    errorPath,
} = config as {
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
    apiUri: 'http://localhost:3000/api/v2', // need to disable as http intercepter get to be in place.
    storeApi: 'https://4kafiznttgjtzd3nkcslgn7qbu0ewugv.lambda-url.ap-southeast-2.on.aws',
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
