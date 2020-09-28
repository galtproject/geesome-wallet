define({ "api": [
  {
    "type": "post",
    "url": "/v1/admin/confirm-wallet",
    "title": "Confirm wallet by admin",
    "name": "AdminConfirmWallet",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p><code>signature</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pendingWalletId",
            "description": "<p><code>pendingWalletId</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "confirmMethods",
            "description": "<p><code>confirmMethods</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p><code>success</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/v1/confirm-wallet",
    "title": "Confirm wallet by phone or email",
    "name": "ConfirmWallet",
    "group": "WalletCreation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "confirmationMethod",
            "description": "<p><code>confirmationMethod</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p><code>value</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p><code>code</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "wallet",
            "description": "<p><code>wallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.id",
            "description": "<p><code>wallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.email",
            "description": "<p><code>wallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.username",
            "description": "<p><code>wallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phone",
            "description": "<p><code>wallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.primaryAddress",
            "description": "<p><code>wallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailPasswordHash",
            "description": "<p><code>wallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phonePasswordHash",
            "description": "<p><code>wallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernamePasswordHash",
            "description": "<p><code>wallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailEncryptedSeed",
            "description": "<p><code>wallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phoneEncryptedSeed",
            "description": "<p><code>wallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernameEncryptedSeed",
            "description": "<p><code>wallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.cryptoMetadataJson",
            "description": "<p><code>wallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet",
            "description": "<p><code>pendingWallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.id",
            "description": "<p><code>pendingWallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.email",
            "description": "<p><code>pendingWallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailConfirmationCode",
            "description": "<p><code>pendingWallet.emailConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.username",
            "description": "<p><code>pendingWallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phone",
            "description": "<p><code>pendingWallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneConfirmationCode",
            "description": "<p><code>pendingWallet.phoneConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.primaryAddress",
            "description": "<p><code>pendingWallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailPasswordHash",
            "description": "<p><code>pendingWallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phonePasswordHash",
            "description": "<p><code>pendingWallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernamePasswordHash",
            "description": "<p><code>pendingWallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailEncryptedSeed",
            "description": "<p><code>pendingWallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneEncryptedSeed",
            "description": "<p><code>pendingWallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernameEncryptedSeed",
            "description": "<p><code>pendingWallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.cryptoMetadataJson",
            "description": "<p><code>pendingWallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet.toJSON",
            "description": "<p><code>pendingWallet.toJSON</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletCreation"
  },
  {
    "type": "post",
    "url": "/v1/register",
    "title": "Register wallet",
    "name": "Register",
    "group": "WalletCreation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "username",
            "description": "<p><code>username</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "usernamePasswordHash",
            "description": "<p><code>usernamePasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "emailEncryptedSeed",
            "description": "<p><code>emailEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "phoneEncryptedSeed",
            "description": "<p><code>phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "usernameEncryptedSeed",
            "description": "<p><code>usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "cryptoMetadataJson",
            "description": "<p><code>cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "wallet",
            "description": "<p><code>wallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.id",
            "description": "<p><code>wallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.email",
            "description": "<p><code>wallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.username",
            "description": "<p><code>wallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phone",
            "description": "<p><code>wallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.primaryAddress",
            "description": "<p><code>wallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailPasswordHash",
            "description": "<p><code>wallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phonePasswordHash",
            "description": "<p><code>wallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernamePasswordHash",
            "description": "<p><code>wallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailEncryptedSeed",
            "description": "<p><code>wallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phoneEncryptedSeed",
            "description": "<p><code>wallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernameEncryptedSeed",
            "description": "<p><code>wallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.cryptoMetadataJson",
            "description": "<p><code>wallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet",
            "description": "<p><code>pendingWallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.id",
            "description": "<p><code>pendingWallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.email",
            "description": "<p><code>pendingWallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailConfirmationCode",
            "description": "<p><code>pendingWallet.emailConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.username",
            "description": "<p><code>pendingWallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phone",
            "description": "<p><code>pendingWallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneConfirmationCode",
            "description": "<p><code>pendingWallet.phoneConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.primaryAddress",
            "description": "<p><code>pendingWallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailPasswordHash",
            "description": "<p><code>pendingWallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phonePasswordHash",
            "description": "<p><code>pendingWallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernamePasswordHash",
            "description": "<p><code>pendingWallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailEncryptedSeed",
            "description": "<p><code>pendingWallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneEncryptedSeed",
            "description": "<p><code>pendingWallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernameEncryptedSeed",
            "description": "<p><code>pendingWallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.cryptoMetadataJson",
            "description": "<p><code>pendingWallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet.toJSON",
            "description": "<p><code>pendingWallet.toJSON</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletCreation"
  },
  {
    "type": "post",
    "url": "/v1/resend-confirmation",
    "title": "Resend wallet confirmation for phone or email",
    "name": "ResendConfirmation",
    "group": "WalletCreation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "confirmationMethod",
            "description": "<p><code>confirmationMethod</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet",
            "description": "<p><code>pendingWallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.id",
            "description": "<p><code>pendingWallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.email",
            "description": "<p><code>pendingWallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailConfirmationCode",
            "description": "<p><code>pendingWallet.emailConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.username",
            "description": "<p><code>pendingWallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phone",
            "description": "<p><code>pendingWallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneConfirmationCode",
            "description": "<p><code>pendingWallet.phoneConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.primaryAddress",
            "description": "<p><code>pendingWallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailPasswordHash",
            "description": "<p><code>pendingWallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phonePasswordHash",
            "description": "<p><code>pendingWallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernamePasswordHash",
            "description": "<p><code>pendingWallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailEncryptedSeed",
            "description": "<p><code>pendingWallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneEncryptedSeed",
            "description": "<p><code>pendingWallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernameEncryptedSeed",
            "description": "<p><code>pendingWallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.cryptoMetadataJson",
            "description": "<p><code>pendingWallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet.toJSON",
            "description": "<p><code>pendingWallet.toJSON</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletCreation"
  },
  {
    "type": "post",
    "url": "/v1/get-auth-message",
    "title": "Get auth message to make signature for getting wallet",
    "name": "GetAuthMessage",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "code",
            "description": "<p><code>code</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "expiredOn",
            "description": "<p><code>expiredOn</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-crypto-metadata-by-email",
    "title": "Get crypto metadata of wallet by email",
    "name": "GetCryptoMetadataByEmail",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p><code>email</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "derivationPath",
            "description": "<p><code>derivationPath</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "iterations",
            "description": "<p><code>iterations</code></p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "kdf",
            "description": "<p><code>kdf</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "cryptoCounter",
            "description": "<p><code>cryptoCounter</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p><code>version</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-crypto-metadata-by-email",
    "title": "Get crypto metadata of wallet by phone",
    "name": "GetCryptoMetadataByPhone",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "derivationPath",
            "description": "<p><code>derivationPath</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "iterations",
            "description": "<p><code>iterations</code></p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "kdf",
            "description": "<p><code>kdf</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "cryptoCounter",
            "description": "<p><code>cryptoCounter</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p><code>version</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-crypto-metadata-by-username",
    "title": "Get crypto metadata of wallet by username",
    "name": "GetCryptoMetadataByUsername",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p><code>username</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "derivationPath",
            "description": "<p><code>derivationPath</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "iterations",
            "description": "<p><code>iterations</code></p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "kdf",
            "description": "<p><code>kdf</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "cryptoCounter",
            "description": "<p><code>cryptoCounter</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p><code>version</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-session",
    "title": "Get session",
    "name": "GetSession",
    "group": "WalletLogin",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "secret",
            "description": "<p><code>secret</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "wallet",
            "description": "<p><code>wallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.id",
            "description": "<p><code>wallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.email",
            "description": "<p><code>wallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.username",
            "description": "<p><code>wallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phone",
            "description": "<p><code>wallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.primaryAddress",
            "description": "<p><code>wallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailPasswordHash",
            "description": "<p><code>wallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phonePasswordHash",
            "description": "<p><code>wallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernamePasswordHash",
            "description": "<p><code>wallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailEncryptedSeed",
            "description": "<p><code>wallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phoneEncryptedSeed",
            "description": "<p><code>wallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernameEncryptedSeed",
            "description": "<p><code>wallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.cryptoMetadataJson",
            "description": "<p><code>wallet.cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-wallet-by-email-and-password-hash",
    "title": "Get wallet by email and password hash",
    "name": "GetWalletByEmailAndPasswordHash",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "username",
            "description": "<p><code>username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernamePasswordHash",
            "description": "<p><code>usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailEncryptedSeed",
            "description": "<p><code>emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phoneEncryptedSeed",
            "description": "<p><code>phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernameEncryptedSeed",
            "description": "<p><code>usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "cryptoMetadataJson",
            "description": "<p><code>cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-wallet-by-phone-and-password-hash",
    "title": "Get wallet by phone and password hash",
    "name": "GetWalletByPhoneAndPasswordHash",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "username",
            "description": "<p><code>username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernamePasswordHash",
            "description": "<p><code>usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailEncryptedSeed",
            "description": "<p><code>emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phoneEncryptedSeed",
            "description": "<p><code>phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernameEncryptedSeed",
            "description": "<p><code>usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "cryptoMetadataJson",
            "description": "<p><code>cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-wallet-by-signature",
    "title": "Get wallet by signature of auth message",
    "name": "GetWalletBySignature",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p><code>signature</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "username",
            "description": "<p><code>username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernamePasswordHash",
            "description": "<p><code>usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailEncryptedSeed",
            "description": "<p><code>emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phoneEncryptedSeed",
            "description": "<p><code>phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernameEncryptedSeed",
            "description": "<p><code>usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "cryptoMetadataJson",
            "description": "<p><code>cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/get-wallet-by-username-and-password-hash",
    "title": "Get wallet by username and password hash",
    "name": "GetWalletByUsernameAndPasswordHash",
    "group": "WalletLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "id",
            "description": "<p><code>id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "email",
            "description": "<p><code>email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "username",
            "description": "<p><code>username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phone",
            "description": "<p><code>phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailPasswordHash",
            "description": "<p><code>emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phonePasswordHash",
            "description": "<p><code>phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernamePasswordHash",
            "description": "<p><code>usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "emailEncryptedSeed",
            "description": "<p><code>emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "phoneEncryptedSeed",
            "description": "<p><code>phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "usernameEncryptedSeed",
            "description": "<p><code>usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "cryptoMetadataJson",
            "description": "<p><code>cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletLogin"
  },
  {
    "type": "post",
    "url": "/v1/update-wallet",
    "title": "Update wallet",
    "name": "UpdateWallet",
    "group": "WalletUpdate",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "primaryAddress",
            "description": "<p><code>primaryAddress</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p><code>signature</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expiredOn",
            "description": "<p><code>expiredOn</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "walletData",
            "description": "<p><code>walletData</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.id",
            "description": "<p><code>walletData.id</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.email",
            "description": "<p><code>walletData.email</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.username",
            "description": "<p><code>walletData.username</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.phone",
            "description": "<p><code>walletData.phone</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "walletData.primaryAddress",
            "description": "<p><code>walletData.primaryAddress</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.emailPasswordHash",
            "description": "<p><code>walletData.emailPasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.phonePasswordHash",
            "description": "<p><code>walletData.phonePasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.usernamePasswordHash",
            "description": "<p><code>walletData.usernamePasswordHash</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.emailEncryptedSeed",
            "description": "<p><code>walletData.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.phoneEncryptedSeed",
            "description": "<p><code>walletData.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": true,
            "field": "walletData.usernameEncryptedSeed",
            "description": "<p><code>walletData.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "walletData.cryptoMetadataJson",
            "description": "<p><code>walletData.cryptoMetadataJson</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "wallet",
            "description": "<p><code>wallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.id",
            "description": "<p><code>wallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.email",
            "description": "<p><code>wallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.username",
            "description": "<p><code>wallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phone",
            "description": "<p><code>wallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.primaryAddress",
            "description": "<p><code>wallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailPasswordHash",
            "description": "<p><code>wallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phonePasswordHash",
            "description": "<p><code>wallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernamePasswordHash",
            "description": "<p><code>wallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.emailEncryptedSeed",
            "description": "<p><code>wallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.phoneEncryptedSeed",
            "description": "<p><code>wallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "wallet.usernameEncryptedSeed",
            "description": "<p><code>wallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "wallet.cryptoMetadataJson",
            "description": "<p><code>wallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet",
            "description": "<p><code>pendingWallet</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.id",
            "description": "<p><code>pendingWallet.id</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.email",
            "description": "<p><code>pendingWallet.email</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailConfirmationCode",
            "description": "<p><code>pendingWallet.emailConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.username",
            "description": "<p><code>pendingWallet.username</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phone",
            "description": "<p><code>pendingWallet.phone</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneConfirmationCode",
            "description": "<p><code>pendingWallet.phoneConfirmationCode</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.primaryAddress",
            "description": "<p><code>pendingWallet.primaryAddress</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailPasswordHash",
            "description": "<p><code>pendingWallet.emailPasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phonePasswordHash",
            "description": "<p><code>pendingWallet.phonePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernamePasswordHash",
            "description": "<p><code>pendingWallet.usernamePasswordHash</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.emailEncryptedSeed",
            "description": "<p><code>pendingWallet.emailEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.phoneEncryptedSeed",
            "description": "<p><code>pendingWallet.phoneEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": true,
            "field": "pendingWallet.usernameEncryptedSeed",
            "description": "<p><code>pendingWallet.usernameEncryptedSeed</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": "pendingWallet.cryptoMetadataJson",
            "description": "<p><code>pendingWallet.cryptoMetadataJson</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "pendingWallet.toJSON",
            "description": "<p><code>pendingWallet.toJSON</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.ts",
    "groupTitle": "WalletUpdate"
  }
] });
