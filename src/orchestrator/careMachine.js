import { createMachine } from 'xstate';

const careMachine = createMachine({
  id: 'careMachine',
  initial: 'greeting',
  states: {
    greeting: {
      after: {
        2500: { target: 'announcingTask' },
      },
    },
    announcingTask: {
      after: {
        1500: { target: 'guidingTask' },
      },
    },
    guidingTask: {
      on: {
        CHECK_IN_DUE: { target: 'checkingIn' },
        TASK_COMPLETE: { target: 'greeting' },
      },
    },
    checkingIn: {
      on: {
        WANTS_TO_CONTINUE: { target: 'guidingTask' },
        WANTS_TO_SWITCH: { target: 'announcingTask' },
        NO_RESPONSE: { target: 'guidingTask' },
      },
    },
  },
});

export default careMachine;
