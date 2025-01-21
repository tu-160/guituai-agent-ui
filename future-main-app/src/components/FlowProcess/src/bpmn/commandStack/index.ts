import CommandStack from 'diagram-js/lib/command/CommandStack';

class CustomCommandStack extends CommandStack {
  constructor(eventBus, modeling) {
    super(eventBus, modeling);
  }
}

let sameId = '';
let isVerticalSameId = false;
let isHorizontalSameId = false;
CommandStack.prototype._internalExecute = function (action, redo) {
  const command = action.command;
  const context = action.context;
  const handler = this._getHandler(command);
  if (!handler) throw new Error('no command handler registered for <' + command + '>');
  this._pushAction(action);
  if (!redo) {
    this._fire(command, 'preExecute', action);
    if (handler.preExecute) handler.preExecute(context);
    this._fire(command, 'preExecuted', action);
  }
  // guard against illegal nested command stack invocations
  this._atomicDo(() => {
    this._fire(command, 'execute', action);
    if (handler.execute) this._markDirty(handler.execute(context));
    if (action.command == 'element.updateProperties' || sameId == action.id) {
      sameId = action.id;
    } else {
      if (action.id != 'updateProperties') this._executedAction(action, redo);
    }
    this._fire(command, 'executed', action);
  });
  if (!redo) {
    this._fire(command, 'postExecute', action);
    if (handler.postExecute) handler.postExecute(context);
    this._fire(command, 'postExecuted', action);
  }
  this._popAction(action);
};
CommandStack.prototype._pushAction = function (action) {
  const execution = this._currentExecution;
  const actions = execution.actions;
  const baseAction = actions[0];
  if (execution.atomic) throw new Error('illegal invocation in <execute> or <revert> phase (action: ' + action.command + ')');
  if (action.command == 'element.updateProperties') action.id = 'updateProperties';
  if (!action.id) action.id = (baseAction && baseAction.id) || this._createId();
  if (isVerticalSameId) action.type = 'beautification.vertical';
  if (isHorizontalSameId) action.type = 'beautification.horizontal';
  actions.push(action);
};
CommandStack.prototype._createId = function () {
  return isHorizontalSameId || isVerticalSameId ? this._uid : this._uid++;
};
CommandStack.prototype.execute = function (command, context) {
  if (!command) throw new Error('command required');
  // 设置一个开始和一个结束状态 如果遇到遇到开始 则全局设置该值为true 后续的入栈id设置成相同id
  if (command === 'vertical.action.same.id.start') return (isVerticalSameId = true);
  if (command === 'vertical.action.same.id.end') {
    this._uid++;
    return (isVerticalSameId = false);
  }
  if (command === 'horizontal.action.same.id.start') return (isHorizontalSameId = true);
  if (command === 'horizontal.action.same.id.end') {
    this._uid++;
    return (isHorizontalSameId = false);
  }
  this._currentExecution.trigger = 'execute';
  const action = { command: command, context: context };
  this._pushAction(action);
  this._internalExecute(action);
  this._popAction(action);
};

export default CustomCommandStack;
