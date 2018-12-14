import "ip";
import { zh_CN } from "./i18n/zh_CN";
import { en_US } from "./i18n/en_US";
import routeConfig from "./route";
import httpConfig from "./http";
import ComModule from "../common";
import coreModule from "./coreModule";
import pluginModule from "./pluginList";
import mainModule from "./main";
angular.module("app", [ComModule,pluginModule,mainModule, coreModule,"ComModules", "ui.select", "ngSanitize", "pascalprecht.translate"])
    .constant("API_HOST", GLOBALCONFIG.APIHOST)
    .config(routeConfig)
    .config(httpConfig)
    .value("APILOADING", {
        "reqNum": 0,
        "resNum":0,
        "exclude":[ ".html",
                    "user-manager/v1/login",
                    "ailab-manager/v1/round/experiment"
                ],
        "apiResTime":null
    })
    .config(["$httpProvider", "$translateProvider",
        function($httpProvider, $translateProvider) {
            $translateProvider.translations("en", en_US);
            $translateProvider.translations("zh", zh_CN);
            $translateProvider.preferredLanguage("zh");
        }
    ]);