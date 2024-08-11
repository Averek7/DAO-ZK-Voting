export type DaoVoting = {
  "version": "0.1.0",
  "name": "dao_voting",
  "instructions": [
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userVote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "vote",
          "type": "bool"
        }
      ]
    },
    {
      "name": "rewardParticipation",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voterPubkey",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "yesVotes",
            "type": "u64"
          },
          {
            "name": "noVotes",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposalTitle",
            "type": "string"
          },
          {
            "name": "voter",
            "type": "publicKey"
          },
          {
            "name": "voted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "voter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "rewardPoints",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: DaoVoting = {
  "version": "0.1.0",
  "name": "dao_voting",
  "instructions": [
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userVote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "vote",
          "type": "bool"
        }
      ]
    },
    {
      "name": "rewardParticipation",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voterPubkey",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "yesVotes",
            "type": "u64"
          },
          {
            "name": "noVotes",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposalTitle",
            "type": "string"
          },
          {
            "name": "voter",
            "type": "publicKey"
          },
          {
            "name": "voted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "voter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "rewardPoints",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
