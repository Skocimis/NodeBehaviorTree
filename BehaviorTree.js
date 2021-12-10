const Status = {
    SUCCESS: 1,
    FAILURE: -1,
    RUNNING: 0
}

class Node {
    constructor(parent) {
        this.parent = parent ? parent : null;
    }
    tick() {

    }
}
class ControlFlowNode extends Node {
    constructor(parent, children) {
        super(parent ? parent : null);
        this.children = children ? children : [];
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    addChildren(children) {
        for (let i in children) {
            this.children.push(children[i]);
            children[i].parent = this;
        }
    }
}
class SequenceNode extends ControlFlowNode {
    constructor(parent, children) {
        super(parent, children);
    }
    tick(data) {
        for (let i in this.children) {
            let result = this.children[i].tick(data);
            if (result == Status.SUCCESS) {

            }
            else if (result == Status.RUNNING) {
                return Status.RUNNING;
                //Ovde vrv treba da vrati RUNNING
            }
            else if (result == Status.FAILURE) {
                return Status.FAILURE;
            }
        }
        return Status.SUCCESS;
    }

}
class FallbackNode extends ControlFlowNode {
    constructor(parent, children) {
        super(parent, children);
    }
    tick(data) {
        for (let i in this.children) {
            let result = this.children[i].tick(data);
            if (result == Status.SUCCESS) {
                return Status.SUCCESS;
            }
            else if (result == Status.RUNNING) {
                return Status.RUNNING;
                //Ovde vrv treba da vrati RUNNING
            }
            else if (result == Status.FAILURE) {

            }
        }
        return Status.FAILURE;
    }
}
class DecoratorNode extends ControlFlowNode {
    constructor(decoratorFunction, parent, children) {
        super(parent, children);
        this.decoratorFunction = decoratorFunction;
    }
    tick(data) {
        let childrentickarray = [];
        for (let i in this.children) {
            let result = this.children[i].tick(data);
            childrentickarray.push(result);
        }
        return this.decoratorFunction(childrentickarray)
    }
}
class ParallelNode extends ControlFlowNode {
    constructor(parent, children) {
        super(parent, children);
    }
    tick(data) {
        let status = Status.FAILURE;
        for (let i in this.children) {
            let result = this.children[i].tick(data);
            if (result == Status.SUCCESS) {
                status = Math.min(Status.SUCCESS, status)
            }
            else if (result == Status.RUNNING) {
                status = Math.min(Status.RUNNING, status)
            }
            else if (result == Status.FAILURE) {
                status = Math.min(Status.FAILURE, status)
            }
        }
        return status;
    }
}
class ExecutionNode extends Node {
    constructor(parent) {
        super(parent ? parent : null);
    }
}
class ActionNode extends ExecutionNode {
    constructor(action, parent) {
        super(parent ? parent : null);
        this.action = action;
    }
    tick(data) {
        return this.action(data);//VRV SAMO VRACA RUNNING
    }
}
class ConditionNode extends ExecutionNode {
    constructor(condition, parent) {
        super(parent ? parent : null);
        this.condition = condition;
    }
    tick(data) {
        return this.condition(data);
    }
}
//DINAMICKE AKCIJE, KAD SE JEDNOM URADI, DA SE NE RADI PONOVO, hesmapa lako resenje, blackboard takodje, cuva samo relevantne informacije. data je blackboard