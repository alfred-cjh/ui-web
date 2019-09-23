module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "globals": {
        "angular": true,
        "_":true,
        "d3":true,
        "moment":true,
        "$":true,
        "_IP":true,
        "GLOBALCONFIG":true,
        "go":true
    },
    //"extends": "eslint:recommended",
    "parserOptions": {
        "parser": 'babel-eslint',
        "sourceType": "module"
    },
    "plugins": [
        'vue'
    ],
    "extends": ["plugin:vue/base"],
    "rules": {
        "no-console":"off",
        "no-dupe-keys":["warn"],
        "no-redeclare":['warn'],
        "no-unused-vars":['warn'],
        "indent": [
            "warn",
            4
        ],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        // "quotes": [
        //     "warn",
        //     "double"
        // ],
        // "semi": [
        //     "warn",
        //     "always"
        // ]
    }
};