export class ExecutableAlreadyAddedError extends Error {
  constructor() {
    super('The selected exe has already existed in your other profiles.');
  }
}
