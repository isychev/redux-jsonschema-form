const form1 = {
  schema: {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First name',
      },
      lastName: {
        type: 'string',
        title: 'Last name',
      },
      age: {
        type: 'integer',
        title: 'Age',
      },
      bio: {
        type: 'string',
        title: 'Bio',
      },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 3,
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      'ui:autofocus': true,
      'ui:emptyValue': '',
    },
    age: {
      'ui:widget': 'updown',
      'ui:title': 'Age of person',
      'ui:description': '(earthian year)',
    },
    bio: {
      'ui:widget': 'textarea',
    },
    password: {
      'ui:widget': 'password',
      'ui:help': 'Hint: Make it strong!',
    },
    date: {
      'ui:widget': 'alt-datetime',
    },
    telephone: {
      'ui:options': {
        inputType: 'tel',
      },
    },
  },
};

const form2 = {
  schema: {
    type: 'object',
    required: ['name'],
    properties: {
      // obj:{
      //   type:'object',
      //   //required: ['obj2'],
      //   properties:{
      //     obj2:{
      //       type:'object',
      //       required: ['obj3'],
      //       properties:{
      //         obj3:{
      //           type: 'string',
      //           minLength: 10,
      //         }
      //       }
      //     }
      //   }
      // },
      name: {
        type: 'string',
      },
      name2: {
        type: 'string',
      },
      name3: {
        type: 'string',
      },
    },
  },
};
const form3 = {
  schema: {
    title: 'A list of tasks',
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        title: 'Task list title',
      },
      tasks: {
        type: 'array',
        title: 'Tasks',
        items: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              title: 'Title',
              description: 'A sample title',
            },
            details: {
              type: 'string',
              title: 'Task details',
              description: 'Enter the task details',
            },
          },
        },
      },
    },
  },
  formData: {
    title: 'My current tasks',
  },
};

const form4 = {
  schema: {
    title: 'A list of tasks',
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        title: 'Task list title',
      },
      tasks: {
        type: 'array',
        title: 'Tasks',
        items: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              title: 'Title',
              description: 'A sample title',
            },
            details: {
              type: 'string',
              title: 'Task details',
              description: 'Enter the task details',
            },
            done: {
              type: 'boolean',
              title: 'Done?',
              default: false,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    tasks: {
      items: {
        details: {
          'ui:widget': 'textarea',
        },
      },
    },
  },
  formData: {
    title: 'My current tasks',
    tasks: [
      {
        title: 'My first task',
        details:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        done: true,
      },
      {
        title: 'My second task',
        details:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
        done: false,
      },
    ],
  },
};
const form5 = {
  schema: {
    definitions: {
      Thing: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            default: 'Default name',
          },
        },
      },
    },
    type: 'object',
    properties: {
      listOfStrings: {
        type: 'array',
        title: 'A list of strings',
        items: {
          type: 'string',
          default: 'bazinga',
        },
      },
      multipleChoicesList: {
        type: 'array',
        title: 'A multiple choices list',
        items: {
          type: 'string',
          enum: ['foo', 'bar', 'fuzz', 'qux'],
        },
        uniqueItems: true,
      },
      fixedItemsList: {
        type: 'array',
        title: 'A list of fixed items',
        items: [
          {
            title: 'A string value',
            type: 'string',
            default: 'lorem ipsum',
          },
          {
            title: 'a boolean value',
            type: 'boolean',
          },
        ],
        additionalItems: {
          title: 'Additional item',
          type: 'number',
        },
      },
      minItemsList: {
        type: 'array',
        title: 'A list with a minimal number of items',
        minItems: 3,
        items: {
          $ref: '#/definitions/Thing',
        },
      },
      defaultsAndMinItems: {
        type: 'array',
        title: 'List and item level defaults',
        minItems: 5,
        default: ['carp', 'trout', 'bream'],
        items: {
          type: 'string',
          default: 'unidentified',
        },
      },
      nestedList: {
        type: 'array',
        title: 'Nested list',
        items: {
          type: 'array',
          title: 'Inner list',
          items: {
            type: 'string',
            default: 'lorem ipsum',
          },
        },
      },
      unorderable: {
        title: 'Unorderable items',
        type: 'array',
        items: {
          type: 'string',
          default: 'lorem ipsum',
        },
      },
      unremovable: {
        title: 'Unremovable items',
        type: 'array',
        items: {
          type: 'string',
          default: 'lorem ipsum',
        },
      },
      noToolbar: {
        title: 'No add, remove and order buttons',
        type: 'array',
        items: {
          type: 'string',
          default: 'lorem ipsum',
        },
      },
      fixedNoToolbar: {
        title: 'Fixed array without buttons',
        type: 'array',
        items: [
          {
            title: 'A number',
            type: 'number',
            default: 42,
          },
          {
            title: 'A boolean',
            type: 'boolean',
            default: false,
          },
        ],
        additionalItems: {
          title: 'A string',
          type: 'string',
          default: 'lorem ipsum',
        },
      },
    },
  },
  uiSchema: {
    listOfStrings: {
      items: {
        'ui:emptyValue': '',
      },
    },
    multipleChoicesList: {
      'ui:widget': 'checkboxes',
    },
    fixedItemsList: {
      items: [
        {
          'ui:widget': 'textarea',
        },
        {
          'ui:widget': 'select',
        },
      ],
      additionalItems: {
        'ui:widget': 'updown',
      },
    },
    unorderable: {
      'ui:options': {
        orderable: false,
      },
    },
    unremovable: {
      'ui:options': {
        removable: false,
      },
    },
    noToolbar: {
      'ui:options': {
        addable: false,
        orderable: false,
        removable: false,
      },
    },
    fixedNoToolbar: {
      'ui:options': {
        addable: false,
        orderable: false,
        removable: false,
      },
    },
  },
  formData: {
    listOfStrings: ['foo', 'bar'],
    multipleChoicesList: ['foo', 'bar'],
    fixedItemsList: ['Some text', true, 123],
    nestedList: [['lorem', 'ipsum'], ['dolor']],
    unorderable: ['one', 'two'],
    unremovable: ['one', 'two'],
    noToolbar: ['one', 'two'],
    fixedNoToolbar: [42, true, 'additional item one', 'additional item two'],
  },
};

export { form1, form2, form3, form4, form5 };
