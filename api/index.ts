const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");

const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    title: "Farcaster Hub REST API",
    version: "1.0",
    description:
      "Perform basic queries of Farcaster state via the REST API of a Farcaster hub. See the [Farcaster docs](https://www.thehubble.xyz/docs/httpapi/httpapi.html) for more details. Some client libraries:\n  - [TypeScript](https://www.npmjs.com/package/@standard-crypto/farcaster-js-hub-rest)\n",
  },
  servers: [
    {
      url: "https://hubs.dev.airstack.xyz",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  paths: {
    "/v1/info": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Info"],
        summary: "Sync Methods",
        operationId: "GetInfo",
        parameters: [
          {
            name: "dbstats",
            in: "query",
            description: "Whether to return DB stats",
            required: true,
            schema: {
              type: "boolean",
            },
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HubInfoResponse",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/castById": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Casts"],
        summary: "Get a cast by its FID and Hash.",
        operationId: "GetCastById",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the cast's creator",
            required: true,
            schema: {
              type: "integer",
            },
            example: 6833,
          },
          {
            name: "hash",
            in: "query",
            description: "The cast's hash",
            required: true,
            schema: {
              pattern: "^0x[0-9a-fA-F]{40}$",
              type: "string",
            },
            example: "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9",
          },
        ],
        responses: {
          "200": {
            description: "The requested Cast.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CastAdd",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/castsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Casts"],
        summary: "Fetch all casts authored by an FID.",
        operationId: "ListCastsByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the casts' creator",
            required: true,
            schema: {
              type: "integer",
            },
            example: 6833,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Casts.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/CastAdd",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/castsByMention": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Casts"],
        summary: "Fetch all casts that mention an FID",
        operationId: "ListCastsByMention",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID that is mentioned in a cast",
            required: true,
            schema: {
              type: "integer",
            },
            example: 6833,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Casts.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/CastAdd",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/castsByParent": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Casts"],
        summary:
          "Fetch all casts by parent cast's FID and Hash OR by the parent's URL",
        operationId: "ListCastsByParent",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the parent cast",
            schema: {
              type: "integer",
            },
            example: 226,
          },
          {
            name: "hash",
            in: "query",
            description: "The parent cast's hash",
            schema: {
              type: "string",
            },
            example: "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9",
          },
          {
            name: "url",
            in: "query",
            schema: {
              type: "string",
            },
            example:
              "chain://eip155:1/erc721:0x39d89b649ffa044383333d297e325d42d31329b2",
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Casts.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/CastAdd",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/reactionById": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Reactions"],
        summary: "Get a reaction by its created FID and target Cast.",
        operationId: "GetReactionById",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the reaction's creator",
            schema: {
              type: "integer",
            },
            required: true,
          },
          {
            name: "target_fid",
            in: "query",
            description: "The FID of the cast's creator",
            schema: {
              type: "integer",
            },
            required: true,
          },
          {
            name: "target_hash",
            in: "query",
            description: "The cast's hash",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "reaction_type",
            in: "query",
            description:
              "The type of reaction, either as a numerical enum value or string representation",
            schema: {
              $ref: "#/components/schemas/ReactionType",
            },
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "The requested Reaction.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Reaction",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/reactionsByCast": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Reactions"],
        summary: "Get all reactions to a cast",
        operationId: "ListReactionsByCast",
        parameters: [
          {
            name: "target_fid",
            in: "query",
            description: "The FID of the cast's creator",
            schema: {
              type: "integer",
            },
            required: true,
          },
          {
            name: "target_hash",
            in: "query",
            description: "The hash of the cast",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "reaction_type",
            in: "query",
            description:
              "The type of reaction, either as a numerical enum value or string representation",
            schema: {
              $ref: "#/components/schemas/ReactionType",
            },
            required: true,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Reactions.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Reaction",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/reactionsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Reactions"],
        summary: "Get all reactions by an FID",
        operationId: "ListReactionsByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the reaction's creator",
            schema: {
              type: "integer",
            },
            required: true,
          },
          {
            name: "reaction_type",
            in: "query",
            description:
              "The type of reaction, either as a numerical enum value or string representation",
            schema: {
              $ref: "#/components/schemas/ReactionType",
            },
            required: true,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Reactions.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Reaction",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/reactionsByTarget": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Reactions"],
        operationId: "ListReactionsByTarget",
        summary: "Get all reactions to a target URL",
        parameters: [
          {
            name: "url",
            in: "query",
            description: "The URL of the parent cast",
            schema: {
              type: "string",
            },
            required: true,
            example:
              "chain://eip155:1/erc721:0x39d89b649ffa044383333d297e325d42d31329b2",
          },
          {
            name: "reaction_type",
            in: "query",
            description:
              "The type of reaction, either as a numerical enum value or string representation",
            schema: {
              $ref: "#/components/schemas/ReactionType",
            },
            required: true,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Reactions.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Reaction",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/linkById": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Links"],
        summary: "Get a link by its FID and target FID.",
        operationId: "GetLinkById",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID of the link's originator",
            required: true,
            schema: {
              type: "integer",
            },
          },
          {
            name: "target_fid",
            in: "query",
            description: "The FID of the target of the link",
            required: true,
            schema: {
              type: "integer",
            },
          },
          {
            name: "link_type",
            in: "query",
            description: "The type of link, as a string value",
            required: true,
            schema: {
              $ref: "#/components/schemas/LinkType",
            },
          },
        ],
        responses: {
          "200": {
            description: "The requested Link.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LinkAdd",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/linksByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Links"],
        summary: "Get all links from a source FID",
        operationId: "ListLinksByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            schema: {
              type: "integer",
            },
            required: true,
            description: "The FID of the link's originator",
          },
          {
            name: "link_type",
            in: "query",
            schema: {
              $ref: "#/components/schemas/LinkType",
            },
            required: false,
            description: "The type of link, as a string value",
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Links.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/LinkAdd",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/linksByTargetFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Links"],
        summary: "Get all links to a target FID",
        operationId: "ListLinksByTargetFid",
        parameters: [
          {
            name: "target_fid",
            in: "query",
            schema: {
              type: "integer",
            },
            required: true,
            description: "The FID of the target of the link",
          },
          {
            name: "link_type",
            in: "query",
            schema: {
              $ref: "#/components/schemas/LinkType",
            },
            required: false,
            description: "The type of link, as a string value",
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Links.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/LinkAdd",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/userDataByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["UserData"],
        summary: "Get UserData for a FID.",
        description:
          "**Note:** one of two different response schemas is returned based on whether the caller provides the `user_data_type` parameter. If included, a single `UserDataAdd` message is returned (or a `not_found` error). If omitted, a paginated list of `UserDataAdd` messages is returned instead",
        operationId: "GetUserDataByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            description: "The FID that's being requested",
            schema: {
              type: "integer",
            },
            required: true,
          },
          {
            name: "user_data_type",
            in: "query",
            description:
              "The type of user data, either as a numerical value or type string. If this is omitted, all user data for the FID is returned",
            schema: {
              $ref: "#/components/schemas/UserDataType",
            },
            required: false,
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested UserData.",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/UserDataAdd",
                    },
                    {
                      type: "object",
                      required: ["messages", "nextPageToken"],
                      properties: {
                        messages: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/UserDataAdd",
                          },
                        },
                        nextPageToken: {
                          pattern:
                            "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                          type: "string",
                          format: "byte",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/fids": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["FIDs"],
        operationId: "ListFids",
        summary: "Get a list of all the FIDs",
        parameters: [
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FidsResponse",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/storageLimitsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Storage"],
        operationId: "GetStorageLimitsByFid",
        summary: "Get an FID's storage limits.",
        parameters: [
          {
            name: "fid",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StorageLimitsResponse",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
        "x-codegen-request-body-name": "body",
      },
    },
    "/v1/userNameProofsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Usernames"],
        operationId: "ListUsernameProofsByFid",
        summary: "Get a list of proofs provided by an FID",
        parameters: [
          {
            name: "fid",
            in: "query",
            schema: {
              type: "integer",
            },
            required: true,
            description: "The FID being requested",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsernameProofsResponse",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/userNameProofByName": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Usernames"],
        summary: "Get an proof for a username by the Farcaster username",
        operationId: "GetUsernameProof",
        parameters: [
          {
            name: "name",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
            description: "The Farcaster username or ENS address",
            examples: {
              username: {
                value: "gavi",
              },
              "ENS address": {
                value: "dwr.eth",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserNameProof",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/verificationsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["Verifications"],
        operationId: "ListVerificationsByFid",
        summary: "Get a list of verifications provided by an FID",
        parameters: [
          {
            name: "fid",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The FID being requested",
          },
          {
            name: "address",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            description: "The optional ETH address to filter by",
          },
          {
            $ref: "#/components/parameters/pageSize",
          },
          {
            $ref: "#/components/parameters/paginationReverse",
          },
          {
            $ref: "#/components/parameters/pageToken",
          },
        ],
        responses: {
          "200": {
            description: "The requested Reactions.",
            content: {
              "application/json": {
                schema: {
                  required: ["messages", "nextPageToken"],
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Verification",
                      },
                    },
                    nextPageToken: {
                      pattern:
                        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
                      type: "string",
                      format: "byte",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
        "x-codegen-request-body-name": "body",
      },
    },
    "/v1/onChainIdRegistryEventByAddress": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["OnChainEvents"],
        summary: "Get an on chain ID Registry Event for a given Address",
        operationId: "GetOnChainIdRegistrationByAddress",
        parameters: [
          {
            name: "address",
            in: "query",
            required: true,
            schema: {
              type: "string",
              pattern: "^0x[0-9a-fA-F]{40}$",
            },
            description: "The ETH address being requested",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OnChainEventIdRegister",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/onChainEventsByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["OnChainEvents"],
        summary: "Get a list of on-chain events provided by an FID",
        operationId: "ListOnChainEventsByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The FID being requested",
          },
          {
            name: "event_type",
            in: "query",
            schema: {
              $ref: "#/components/schemas/OnChainEventType",
            },
            description:
              "The numeric of string value of the event type being requested.",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/OnChainEvent",
                      },
                    },
                  },
                  required: ["events"],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/onChainSignersByFid": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["OnChainEvents"],
        summary: "Get a list of signers provided by an FID",
        description:
          "**Note:** one of two different response schemas is returned based on whether the caller provides the `signer` parameter. If included, a single `OnChainEventSigner` message is returned (or a `not_found` error). If omitted, a non-paginated list of `OnChainEventSigner` messages is returned instead",
        operationId: "ListOnChainSignersByFid",
        parameters: [
          {
            name: "fid",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The FID being requested",
          },
          {
            name: "signer",
            in: "query",
            schema: {
              type: "string",
            },
            description: "The optional key of signer",
            required: false,
            example:
              "0x0852c07b5695ff94138b025e3f9b4788e06133f04e254f0ea0eb85a06e999cdd",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/OnChainEventSigner",
                    },
                    {
                      type: "object",
                      properties: {
                        events: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/OnChainEventSigner",
                          },
                        },
                      },
                      required: ["events"],
                    },
                  ],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/submitMessage": {
      post: {
        tags: ["SubmitMessage"],
        summary: "Submit a signed protobuf-serialized message to the Hub",
        operationId: "SubmitMessage",
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        requestBody: {
          description:
            "* \nA Message is a delta operation on the Farcaster network. The message protobuf is an envelope \nthat wraps a MessageData object and contains a hash and signature which can verify its authenticity.",
          content: {
            "application/octet-stream": {
              schema: {
                type: "string",
                format: "binary",
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Message",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
        "x-codegen-request-body-name": "body",
      },
    },
    "/v1/validateMessage": {
      post: {
        tags: ["ValidateMessage"],
        summary: "Validate a signed protobuf-serialized message with the Hub",
        operationId: "ValidateMessage",
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        requestBody: {
          description:
            "* \nA Message is a delta operation on the Farcaster network. The message protobuf is an envelope \nthat wraps a MessageData object and contains a hash and signature which can verify its authenticity.",
          content: {
            "application/octet-stream": {
              schema: {
                type: "string",
                format: "binary",
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidateMessageResponse",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
        "x-codegen-request-body-name": "body",
      },
    },
    "/v1/events": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["HubEvents"],
        operationId: "ListEvents",
        summary: "Get a page of Hub events",
        parameters: [
          {
            name: "from_event_id",
            in: "query",
            required: false,
            schema: {
              type: "integer",
            },
            description:
              "An optional Hub Id to start getting events from. This is also returned from the API as nextPageEventId, which can be used to page through all the Hub events. Set it to 0 to start from the first event",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nextPageEventId: {
                      type: "integer",
                    },
                    events: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/HubEvent",
                      },
                    },
                  },
                  required: ["nextPageEventId", "events"],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
    "/v1/eventById": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: ["HubEvents"],
        operationId: "GetEventById",
        summary: "Get an event by its ID",
        parameters: [
          {
            name: "event_id",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The Hub Id of the event",
          },
        ],
        responses: {
          "200": {
            description: "A successful response.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HubEvent",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/ErrorResponse",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-airstack-hubs",
      },
    },
    parameters: {
      pageSize: {
        name: "pageSize",
        in: "query",
        description:
          "Maximum number of messages to return in a single response",
        schema: {
          type: "integer",
        },
      },
      paginationReverse: {
        name: "reverse",
        in: "query",
        description: "Reverse the sort order, returning latest messages first",
        schema: {
          type: "boolean",
        },
      },
      pageToken: {
        name: "pageToken",
        in: "query",
        description:
          "The page token returned by the previous query, to fetch the next page. If this parameter is empty, fetch the first page",
        schema: {
          type: "string",
        },
      },
    },
    schemas: {
      CastAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataCastAdd",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      CastAddBody: {
        description: "Adds a new Cast",
        type: "object",
        properties: {
          embedsDeprecated: {
            title: "URLs to be embedded in the cast",
            type: "array",
            items: {
              type: "string",
            },
          },
          mentions: {
            title: "Fids mentioned in the cast",
            type: "array",
            items: {
              type: "integer",
              format: "uint64",
              example: 2,
            },
          },
          parentCastId: {
            $ref: "#/components/schemas/CastId",
          },
          parentUrl: {
            title: "Parent URL",
            type: "string",
            example:
              "chain://eip155:1/erc721:0x39d89b649ffa044383333d297e325d42d31329b2",
          },
          text: {
            title: "Text of the cast",
            type: "string",
          },
          mentionsPositions: {
            title: "Positions of the mentions in the text",
            type: "array",
            items: {
              type: "integer",
              format: "int64",
            },
          },
          embeds: {
            title: "URLs or cast ids to be embedded in the cast",
            type: "array",
            items: {
              $ref: "#/components/schemas/Embed",
            },
          },
        },
        required: [
          "embedsDeprecated",
          "mentions",
          "text",
          "mentionsPositions",
          "embeds",
        ],
      },
      CastEmbed: {
        type: "object",
        properties: {
          castId: {
            $ref: "#/components/schemas/CastId",
          },
        },
        required: ["castId"],
      },
      CastRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataCastRemove",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      CastId: {
        description: "Identifier used to look up a Cast",
        required: ["fid", "hash"],
        type: "object",
        properties: {
          fid: {
            title: "Fid of the user who created the cast",
            type: "integer",
            format: "uint64",
          },
          hash: {
            $ref: "#/components/schemas/CastHash",
          },
        },
      },
      CastHash: {
        pattern: "^0x[0-9a-fA-F]{40}$",
        type: "string",
      },
      CastRemoveBody: {
        description: "Removes an existing Cast",
        type: "object",
        properties: {
          targetHash: {
            title: "Hash of the cast to remove",
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
        },
        required: ["targetHash"],
      },
      DbStats: {
        required: ["numFidEvents", "numFnameEvents", "numMessages"],
        type: "object",
        properties: {
          numMessages: {
            type: "integer",
            format: "uint64",
          },
          numFidEvents: {
            type: "integer",
            format: "uint64",
          },
          numFnameEvents: {
            type: "integer",
            format: "uint64",
          },
        },
      },
      Embed: {
        oneOf: [
          {
            $ref: "#/components/schemas/CastEmbed",
          },
          {
            $ref: "#/components/schemas/UrlEmbed",
          },
        ],
      },
      ErrorResponse: {
        required: [
          "code",
          "details",
          "errCode",
          "metadata",
          "name",
          "presentable",
        ],
        type: "object",
        properties: {
          errCode: {
            type: "string",
          },
          presentable: {
            type: "boolean",
          },
          name: {
            type: "string",
          },
          code: {
            type: "integer",
          },
          details: {
            type: "string",
          },
          metadata: {
            required: ["errcode"],
            type: "object",
            properties: {
              errcode: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      FarcasterNetwork: {
        type: "string",
        description:
          "Farcaster network the message is intended for.\n- FARCASTER_NETWORK_MAINNET: Public primary network\n - FARCASTER_NETWORK_TESTNET: Public test network\n - FARCASTER_NETWORK_DEVNET: Private test network",
        default: "FARCASTER_NETWORK_MAINNET",
        enum: [
          "FARCASTER_NETWORK_MAINNET",
          "FARCASTER_NETWORK_TESTNET",
          "FARCASTER_NETWORK_DEVNET",
        ],
      },
      FidsResponse: {
        type: "object",
        properties: {
          fids: {
            type: "array",
            items: {
              type: "integer",
              format: "uint64",
            },
          },
          nextPageToken: {
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
        },
        required: ["fids", "nextPageToken"],
      },
      FrameActionBody: {
        description: "A Farcaster Frame action",
        type: "object",
        properties: {
          url: {
            type: "string",
            format: "uri",
          },
          buttonIndex: {
            title: "The index of the button pressed (1-4)",
            type: "integer",
            format: "int32",
            minimum: 1,
            maximum: 4,
          },
          castId: {
            $ref: "#/components/schemas/CastId",
          },
        },
        required: ["url", "buttonIndex", "castId"],
      },
      HashScheme: {
        type: "string",
        description:
          "Type of hashing scheme used to produce a digest of MessageData. - HASH_SCHEME_BLAKE3: Default scheme for hashing MessageData\n",
        default: "HASH_SCHEME_BLAKE3",
        enum: ["HASH_SCHEME_BLAKE3"],
      },
      HubEvent: {
        oneOf: [
          {
            $ref: "#/components/schemas/HubEventMergeMessage",
          },
          {
            $ref: "#/components/schemas/HubEventPruneMessage",
          },
          {
            $ref: "#/components/schemas/HubEventRevokeMessage",
          },
          {
            $ref: "#/components/schemas/HubEventMergeUsernameProof",
          },
          {
            $ref: "#/components/schemas/HubEventMergeOnChainEvent",
          },
        ],
        discriminator: {
          propertyName: "type",
          mapping: {
            HUB_EVENT_TYPE_MERGE_MESSAGE:
              "#/components/schemas/HubEventMergeMessage",
            HUB_EVENT_TYPE_PRUNE_MESSAGE:
              "#/components/schemas/HubEventPruneMessage",
            HUB_EVENT_TYPE_REVOKE_MESSAGE:
              "#/components/schemas/HubEventRevokeMessage",
            HUB_EVENT_TYPE_MERGE_USERNAME_PROOF:
              "#/components/schemas/HubEventMergeUsernameProof",
            HUB_EVENT_TYPE_MERGE_ON_CHAIN_EVENT:
              "#/components/schemas/HubEventMergeOnChainEvent",
          },
        },
      },
      HubEventMergeMessage: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "HUB_EVENT_TYPE_MERGE_MESSAGE",
          },
          id: {
            type: "integer",
            format: "uint64",
          },
          mergeMessageBody: {
            $ref: "#/components/schemas/MergeMessageBody",
          },
        },
        required: ["type", "id", "mergeMessageBody"],
      },
      HubEventPruneMessage: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "HUB_EVENT_TYPE_PRUNE_MESSAGE",
          },
          id: {
            type: "integer",
            format: "uint64",
          },
          pruneMessageBody: {
            $ref: "#/components/schemas/PruneMessageBody",
          },
        },
        required: ["type", "id", "pruneMessageBody"],
      },
      HubEventRevokeMessage: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "HUB_EVENT_TYPE_REVOKE_MESSAGE",
          },
          id: {
            type: "integer",
            format: "uint64",
          },
          revokeMessageBody: {
            $ref: "#/components/schemas/RevokeMessageBody",
          },
        },
        required: ["type", "id", "revokeMessageBody"],
      },
      HubEventMergeUsernameProof: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "HUB_EVENT_TYPE_MERGE_USERNAME_PROOF",
          },
          id: {
            type: "integer",
            format: "uint64",
          },
          mergeUsernameProofBody: {
            $ref: "#/components/schemas/MergeUserNameProofBody",
          },
        },
        required: ["type", "id", "mergeUsernameProofBody"],
      },
      HubEventMergeOnChainEvent: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "HUB_EVENT_TYPE_MERGE_ON_CHAIN_EVENT",
          },
          id: {
            type: "integer",
            format: "uint64",
          },
          mergeOnChainEventBody: {
            $ref: "#/components/schemas/MergeOnChainEventBody",
          },
        },
        required: ["type", "id", "mergeOnChainEventBody"],
      },
      HubInfoResponse: {
        title: "Response Types for the Sync RPC Methods",
        required: [
          "hubOperatorFid",
          "isSyncing",
          "nickname",
          "peerId",
          "rootHash",
          "version",
        ],
        type: "object",
        properties: {
          version: {
            type: "string",
          },
          isSyncing: {
            type: "boolean",
          },
          nickname: {
            type: "string",
          },
          rootHash: {
            type: "string",
          },
          dbStats: {
            $ref: "#/components/schemas/DbStats",
          },
          peerId: {
            type: "string",
          },
          hubOperatorFid: {
            type: "integer",
            format: "uint64",
          },
        },
      },
      IdRegisterEventBody: {
        type: "object",
        properties: {
          to: {
            pattern: "^0x[a-fA-F0-9]*$",
            type: "string",
            example: "0x00000000fcd5a8e45785c8a4b9a718c9348e4f18",
          },
          eventType: {
            $ref: "#/components/schemas/IdRegisterEventType",
          },
          from: {
            pattern: "^0x[a-fA-F0-9]*$",
            type: "string",
            example: "0x00000000fcd5a8e45785c8a4b9a718c9348e4f18",
          },
          recoveryAddress: {
            pattern: "^0x[a-fA-F0-9]*$",
            type: "string",
            example: "0x00000000fcd5a8e45785c8a4b9a718c9348e4f18",
          },
        },
        required: ["to", "from", "eventType", "recoveryAddress"],
      },
      IdRegisterEventType: {
        type: "string",
        default: "ID_REGISTER_EVENT_TYPE_REGISTER",
        enum: [
          "ID_REGISTER_EVENT_TYPE_REGISTER",
          "ID_REGISTER_EVENT_TYPE_TRANSFER",
          "ID_REGISTER_EVENT_TYPE_CHANGE_RECOVERY",
        ],
      },
      LinkAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataLink",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      LinkBody: {
        description: "Adds or removes a Link",
        type: "object",
        properties: {
          type: {
            $ref: "#/components/schemas/LinkType",
          },
          displayTimestamp: {
            title:
              "User-defined timestamp that preserves original timestamp when message.data.timestamp needs to be updated for compaction",
            type: "integer",
            format: "int64",
          },
          targetFid: {
            title: "The fid the link relates to",
            type: "integer",
            format: "uint64",
          },
        },
        required: ["type", "targetFid"],
      },
      LinkRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataLink",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      LinkType: {
        type: "string",
        description: "Type of Link.\n- follow: Follow another user",
        default: "follow",
        enum: ["follow"],
      },
      MergeMessageBody: {
        type: "object",
        properties: {
          message: {
            $ref: "#/components/schemas/Message",
          },
          deletedMessages: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Message",
            },
          },
        },
        required: ["message", "deletedMessages"],
      },
      MergeOnChainEventBody: {
        type: "object",
        properties: {
          onChainEvent: {
            $ref: "#/components/schemas/OnChainEvent",
          },
        },
        required: ["onChainEvent"],
      },
      MergeUserNameProofBody: {
        type: "object",
        properties: {
          usernameProof: {
            $ref: "#/components/schemas/UserNameProof",
          },
          deletedUsernameProof: {
            $ref: "#/components/schemas/UserNameProof",
          },
          usernameProofMessage: {
            $ref: "#/components/schemas/Message",
          },
          deletedUsernameProofMessage: {
            $ref: "#/components/schemas/Message",
          },
        },
      },
      Message: {
        allOf: [
          {
            type: "object",
            properties: {
              data: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/MessageDataCastAdd",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataCastRemove",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataReaction",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataLink",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataVerificationAdd",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataVerificationRemove",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataUserDataAdd",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataUsernameProof",
                  },
                  {
                    $ref: "#/components/schemas/MessageDataFrameAction",
                  },
                ],
                discriminator: {
                  propertyName: "type",
                  mapping: {
                    MESSAGE_TYPE_CAST_ADD:
                      "#/components/schemas/MessageDataCastAdd",
                    MESSAGE_TYPE_CAST_REMOVE:
                      "#/components/schemas/MessageDataCastRemove",
                    MESSAGE_TYPE_REACTION_ADD:
                      "#/components/schemas/MessageDataReaction",
                    MESSAGE_TYPE_REACTION_REMOVE:
                      "#/components/schemas/MessageDataReaction",
                    MESSAGE_TYPE_LINK_ADD:
                      "#/components/schemas/MessageDataLink",
                    MESSAGE_TYPE_LINK_REMOVE:
                      "#/components/schemas/MessageDataLink",
                    MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS:
                      "#/components/schemas/MessageDataVerificationAdd",
                    MESSAGE_TYPE_VERIFICATION_REMOVE:
                      "#/components/schemas/MessageDataVerificationRemove",
                    MESSAGE_TYPE_USER_DATA_ADD:
                      "#/components/schemas/MessageDataUserDataAdd",
                    MESSAGE_TYPE_USERNAME_PROOF:
                      "#/components/schemas/MessageDataUsernameProof",
                    MESSAGE_TYPE_FRAME_ACTION:
                      "#/components/schemas/MessageDataFrameAction",
                  },
                },
              },
            },
            required: ["data"],
          },
          {
            $ref: "#/components/schemas/MessageCommon",
          },
        ],
        description:
          "* \nA Message is a delta operation on the Farcaster network. The message protobuf is an envelope \nthat wraps a MessageData object and contains a hash and signature which can verify its authenticity.",
      },
      MessageCommon: {
        type: "object",
        properties: {
          hash: {
            title: "Hash digest of data",
            pattern: "^0x[0-9a-fA-F]{40}$",
            type: "string",
            example: "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
          },
          hashScheme: {
            $ref: "#/components/schemas/HashScheme",
          },
          signature: {
            title: "Signature of the hash digest",
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
          signatureScheme: {
            $ref: "#/components/schemas/SignatureScheme",
          },
          signer: {
            title:
              "Public key or address of the key pair that produced the signature",
            pattern: "^0x[0-9a-fA-F]+$",
            type: "string",
          },
        },
        required: [
          "hash",
          "hashScheme",
          "signature",
          "signatureScheme",
          "signer",
        ],
      },
      MessageDataCommon: {
        required: ["fid", "network", "timestamp"],
        type: "object",
        properties: {
          fid: {
            title: "Farcaster ID of the user producing the message",
            type: "integer",
            format: "uint64",
            example: 2,
          },
          timestamp: {
            title: "Farcaster epoch timestamp in seconds",
            type: "integer",
            format: "int64",
            example: 48994466,
          },
          network: {
            $ref: "#/components/schemas/FarcasterNetwork",
          },
        },
      },
      MessageDataCastAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["castAddBody"],
            properties: {
              castAddBody: {
                $ref: "#/components/schemas/CastAddBody",
              },
            },
          },
        ],
      },
      MessageDataCastRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["castRemoveBody"],
            properties: {
              castRemoveBody: {
                $ref: "#/components/schemas/CastRemoveBody",
              },
            },
          },
        ],
      },
      MessageDataFrameAction: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["frameActionBody"],
            properties: {
              frameActionBody: {
                $ref: "#/components/schemas/FrameActionBody",
              },
            },
          },
        ],
      },
      MessageDataLink: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["linkBody"],
            properties: {
              linkBody: {
                $ref: "#/components/schemas/LinkBody",
              },
            },
          },
        ],
      },
      MessageDataReaction: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["reactionBody"],
            properties: {
              reactionBody: {
                $ref: "#/components/schemas/ReactionBody",
              },
            },
          },
        ],
      },
      MessageDataUserDataAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["userDataBody"],
            properties: {
              userDataBody: {
                $ref: "#/components/schemas/UserDataBody",
              },
            },
          },
        ],
      },
      MessageDataUsernameProof: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["usernameProofBody"],
            properties: {
              usernameProofBody: {
                $ref: "#/components/schemas/UserNameProof",
              },
            },
          },
        ],
      },
      MessageDataVerificationAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["verificationAddEthAddressBody"],
            properties: {
              verificationAddEthAddressBody: {
                $ref: "#/components/schemas/VerificationAddEthAddressBody",
              },
            },
          },
        ],
      },
      MessageDataVerificationRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageDataCommon",
          },
          {
            type: "object",
            required: ["verificationRemoveBody"],
            properties: {
              verificationRemoveBody: {
                $ref: "#/components/schemas/VerificationRemoveBody",
              },
            },
          },
        ],
      },
      MessageType: {
        type: "string",
        description:
          "Type of the MessageBody.\n - MESSAGE_TYPE_CAST_ADD: Add a new Cast\n - MESSAGE_TYPE_CAST_REMOVE: Remove an existing Cast\n - MESSAGE_TYPE_REACTION_ADD: Add a Reaction to a Cast\n - MESSAGE_TYPE_REACTION_REMOVE: Remove a Reaction from a Cast\n - MESSAGE_TYPE_LINK_ADD: Add a new Link\n - MESSAGE_TYPE_LINK_REMOVE: Remove an existing Link\n - MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS: Add a Verification of an Ethereum Address\n - MESSAGE_TYPE_VERIFICATION_REMOVE: Remove a Verification\n - MESSAGE_TYPE_USER_DATA_ADD: Add metadata about a user\n - MESSAGE_TYPE_USERNAME_PROOF: Add or replace a username proof\n - MESSAGE_TYPE_FRAME_ACTION: A Farcaster Frame action",
        default: "MESSAGE_TYPE_CAST_ADD",
        enum: [
          "MESSAGE_TYPE_CAST_ADD",
          "MESSAGE_TYPE_CAST_REMOVE",
          "MESSAGE_TYPE_REACTION_ADD",
          "MESSAGE_TYPE_REACTION_REMOVE",
          "MESSAGE_TYPE_LINK_ADD",
          "MESSAGE_TYPE_LINK_REMOVE",
          "MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS",
          "MESSAGE_TYPE_VERIFICATION_REMOVE",
          "MESSAGE_TYPE_USER_DATA_ADD",
          "MESSAGE_TYPE_USERNAME_PROOF",
          "MESSAGE_TYPE_FRAME_ACTION",
        ],
      },
      OnChainEvent: {
        oneOf: [
          {
            $ref: "#/components/schemas/OnChainEventSigner",
          },
          {
            $ref: "#/components/schemas/OnChainEventSignerMigrated",
          },
          {
            $ref: "#/components/schemas/OnChainEventIdRegister",
          },
          {
            $ref: "#/components/schemas/OnChainEventStorageRent",
          },
        ],
        discriminator: {
          propertyName: "type",
          mapping: {
            EVENT_TYPE_SIGNER: "#/components/schemas/OnChainEventSigner",
            EVENT_TYPE_SIGNER_MIGRATED:
              "#/components/schemas/OnChainEventSignerMigrated",
            EVENT_TYPE_ID_REGISTER:
              "#/components/schemas/OnChainEventIdRegister",
            EVENT_TYPE_STORAGE_RENT:
              "#/components/schemas/OnChainEventStorageRent",
          },
        },
      },
      OnChainEventCommon: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "EVENT_TYPE_SIGNER",
          },
          chainId: {
            type: "integer",
          },
          blockNumber: {
            type: "integer",
          },
          blockHash: {
            type: "string",
            example:
              "0x75fbbb8b2a4ede67ac350e1b0503c6a152c0091bd8e3ef4a6927d58e088eae28",
          },
          blockTimestamp: {
            type: "integer",
          },
          transactionHash: {
            type: "string",
            example:
              "0x36ef79e6c460e6ae251908be13116ff0065960adb1ae032b4cc65a8352f28952",
          },
          logIndex: {
            type: "integer",
          },
          txIndex: {
            type: "integer",
          },
          fid: {
            type: "integer",
          },
        },
        required: [
          "type",
          "chainId",
          "blockNumber",
          "blockHash",
          "blockTimestamp",
          "transactionHash",
          "logIndex",
          "txIndex",
          "fid",
        ],
      },
      OnChainEventSigner: {
        allOf: [
          {
            $ref: "#/components/schemas/OnChainEventCommon",
          },
          {
            type: "object",
            properties: {
              signerEventBody: {
                $ref: "#/components/schemas/SignerEventBody",
              },
            },
            required: ["signerEventBody"],
          },
        ],
      },
      OnChainEventSignerMigrated: {
        allOf: [
          {
            $ref: "#/components/schemas/OnChainEventCommon",
          },
          {
            type: "object",
            properties: {
              signerMigratedEventBody: {
                $ref: "#/components/schemas/SignerMigratedEventBody",
              },
            },
            required: ["signerMigratedEventBody"],
          },
        ],
      },
      OnChainEventIdRegister: {
        allOf: [
          {
            $ref: "#/components/schemas/OnChainEventCommon",
          },
          {
            type: "object",
            properties: {
              idRegisterEventBody: {
                $ref: "#/components/schemas/IdRegisterEventBody",
              },
            },
            required: ["idRegisterEventBody"],
          },
        ],
      },
      OnChainEventStorageRent: {
        allOf: [
          {
            $ref: "#/components/schemas/OnChainEventCommon",
          },
          {
            type: "object",
            properties: {
              storageRentEventBody: {
                $ref: "#/components/schemas/StorageRentEventBody",
              },
            },
            required: ["storageRentEventBody"],
          },
        ],
      },
      OnChainEventType: {
        type: "string",
        default: "EVENT_TYPE_SIGNER",
        enum: [
          "EVENT_TYPE_SIGNER",
          "EVENT_TYPE_SIGNER_MIGRATED",
          "EVENT_TYPE_ID_REGISTER",
          "EVENT_TYPE_STORAGE_RENT",
        ],
      },
      PruneMessageBody: {
        type: "object",
        properties: {
          message: {
            $ref: "#/components/schemas/Message",
          },
        },
        required: ["message"],
      },
      Reaction: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataReaction",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      ReactionBody: {
        description: "Adds or removes a Reaction from a Cast",
        type: "object",
        properties: {
          type: {
            $ref: "#/components/schemas/ReactionType",
          },
          targetCastId: {
            $ref: "#/components/schemas/CastId",
          },
          targetUrl: {
            title: "URL to react to",
            type: "string",
          },
        },
        required: ["type"],
      },
      ReactionRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                $ref: "#/components/schemas/MessageDataReaction",
              },
            },
            required: ["data"],
          },
        ],
      },
      ReactionType: {
        type: "string",
        description:
          "Type of Reaction.\n- REACTION_TYPE_LIKE: Like the target cast\n - REACTION_TYPE_RECAST: Share target cast to the user's audience",
        default: "REACTION_TYPE_LIKE",
        enum: ["REACTION_TYPE_LIKE", "REACTION_TYPE_RECAST"],
      },
      RevokeMessageBody: {
        type: "object",
        properties: {
          message: {
            $ref: "#/components/schemas/Message",
          },
        },
        required: ["message"],
      },
      SignatureScheme: {
        type: "string",
        description:
          "Type of signature scheme used to sign the Message hash\n- SIGNATURE_SCHEME_ED25519: Ed25519 signature (default)\n - SIGNATURE_SCHEME_EIP712: ECDSA signature using EIP-712 scheme",
        default: "SIGNATURE_SCHEME_ED25519",
        enum: ["SIGNATURE_SCHEME_ED25519", "SIGNATURE_SCHEME_EIP712"],
      },
      SignerEventBody: {
        type: "object",
        properties: {
          key: {
            pattern: "^0x[a-fA-F0-9]{64}$",
            type: "string",
          },
          keyType: {
            type: "integer",
            format: "int64",
          },
          eventType: {
            $ref: "#/components/schemas/SignerEventType",
          },
          metadata: {
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
          metadataType: {
            type: "integer",
            format: "int64",
          },
        },
        required: ["key", "keyType", "eventType", "metadata", "metadataType"],
      },
      SignerEventType: {
        type: "string",
        default: "SIGNER_EVENT_TYPE_ADD",
        enum: [
          "SIGNER_EVENT_TYPE_ADD",
          "SIGNER_EVENT_TYPE_REMOVE",
          "SIGNER_EVENT_TYPE_ADMIN_RESET",
        ],
      },
      SignerMigratedEventBody: {
        type: "object",
        properties: {
          migratedAt: {
            type: "integer",
            format: "int64",
          },
        },
        required: ["migratedAt"],
      },
      StorageLimit: {
        type: "object",
        properties: {
          storeType: {
            $ref: "#/components/schemas/StoreType",
          },
          limit: {
            type: "integer",
            format: "uint64",
          },
        },
        required: ["storeType", "limit"],
      },
      StorageLimitsResponse: {
        type: "object",
        properties: {
          limits: {
            type: "array",
            items: {
              $ref: "#/components/schemas/StorageLimit",
            },
          },
        },
        required: ["limits"],
      },
      StorageRentEventBody: {
        type: "object",
        properties: {
          payer: {
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
          units: {
            type: "integer",
            format: "int64",
          },
          expiry: {
            type: "integer",
            format: "int64",
          },
        },
        required: ["payer", "units", "expiry"],
      },
      StoreType: {
        type: "string",
        default: "STORE_TYPE_CASTS",
        enum: [
          "STORE_TYPE_CASTS",
          "STORE_TYPE_LINKS",
          "STORE_TYPE_REACTIONS",
          "STORE_TYPE_USER_DATA",
          "STORE_TYPE_VERIFICATIONS",
          "STORE_TYPE_USERNAME_PROOFS",
        ],
      },
      UrlEmbed: {
        type: "object",
        properties: {
          url: {
            type: "string",
            format: "uri",
          },
        },
        required: ["url"],
      },
      UserDataAdd: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataUserDataAdd",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      UserDataBody: {
        description: "Adds metadata about a user",
        type: "object",
        properties: {
          type: {
            $ref: "#/components/schemas/UserDataType",
          },
          value: {
            title: "Value of the metadata",
            type: "string",
          },
        },
        required: ["type", "value"],
      },
      UserDataType: {
        type: "string",
        description:
          "Type of UserData.\n- USER_DATA_TYPE_PFP: Profile Picture for the user\n - USER_DATA_TYPE_DISPLAY: Display Name for the user\n - USER_DATA_TYPE_BIO: Bio for the user\n - USER_DATA_TYPE_URL: URL of the user\n - USER_DATA_TYPE_USERNAME: Preferred Name for the user",
        default: "USER_DATA_TYPE_PFP",
        enum: [
          "USER_DATA_TYPE_PFP",
          "USER_DATA_TYPE_DISPLAY",
          "USER_DATA_TYPE_BIO",
          "USER_DATA_TYPE_URL",
          "USER_DATA_TYPE_USERNAME",
        ],
      },
      UserNameProof: {
        type: "object",
        properties: {
          timestamp: {
            type: "integer",
            format: "uint64",
          },
          name: {
            type: "string",
            example: "gavi",
          },
          owner: {
            pattern: "^0x[0-9a-fA-F]{40}$",
            type: "string",
          },
          signature: {
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
          fid: {
            type: "integer",
            format: "uint64",
          },
          type: {
            $ref: "#/components/schemas/UserNameType",
          },
        },
        required: ["timestamp", "name", "owner", "signature", "fid", "type"],
      },
      UsernameProofsResponse: {
        type: "object",
        properties: {
          proofs: {
            type: "array",
            items: {
              $ref: "#/components/schemas/UserNameProof",
            },
          },
        },
        required: ["proofs"],
      },
      UserNameType: {
        type: "string",
        default: "USERNAME_TYPE_FNAME",
        enum: ["USERNAME_TYPE_FNAME", "USERNAME_TYPE_ENS_L1"],
      },
      ValidateMessageResponse: {
        type: "object",
        properties: {
          valid: {
            type: "boolean",
          },
          message: {
            $ref: "#/components/schemas/Message",
          },
        },
        required: ["valid", "message"],
      },
      Verification: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataVerificationAdd",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      VerificationAddEthAddressBody: {
        description: "Adds a Verification of ownership of an Ethereum Address",
        type: "object",
        properties: {
          address: {
            title: "Ethereum address being verified",
            pattern: "^0x[a-fA-F0-9]{40}$",
            type: "string",
          },
          ethSignature: {
            title: "Signature produced by the user's Ethereum address",
            pattern:
              "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
            type: "string",
            format: "byte",
          },
          blockHash: {
            title:
              "Hash of the latest Ethereum block when the signature was produced",
            pattern: "^0x[a-fA-F0-9]{64}$",
            type: "string",
          },
        },
        required: ["address", "ethSignature", "blockHash"],
      },
      VerificationRemove: {
        allOf: [
          {
            $ref: "#/components/schemas/MessageCommon",
          },
          {
            type: "object",
            properties: {
              data: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageDataVerificationRemove",
                  },
                  {
                    type: "object",
                    properties: {
                      type: {
                        $ref: "#/components/schemas/MessageType",
                      },
                    },
                    required: ["type"],
                  },
                ],
              },
            },
            required: ["data"],
          },
        ],
      },
      VerificationRemoveBody: {
        description: "Removes a Verification of any type",
        type: "object",
        properties: {
          address: {
            title: "Address of the Verification to remove",
            pattern: "^0x[A-Za-z0-9]{40}$",
            type: "string",
          },
        },
        required: ["address"],
      },
    },
    responses: {
      ErrorResponse: {
        description: "An unexpected error response.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
          },
        },
      },
    },
  },
};

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const app = express();
app.use(express.json());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: CSS_URL,
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
  })
);

app.listen(3000, () => {
  console.log(`Running on http://localhost:3000/api-docs`);
});