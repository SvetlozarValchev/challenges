import { TextOperation } from 'ot';

export interface Operation {
    move?: number;
    insert?: string;
    delete?: number;
}

export default class TextOperationAdapter {
    public textOperation: TextOperation;

    constructor(operations: Operation[] = []) {
        this.textOperation = new TextOperation();

        operations.forEach((op: Operation) => {
            if ('move' in op) {
                this.textOperation.retain(op.move);
            } else if ('insert' in op) {
                this.textOperation.insert(op.insert);
            } else if ('delete' in op) {
                this.textOperation.delete(op.delete);
            } else {
                throw new Error ('Operation type not recognized');
            }
        })
    }

    apply(str: string): string {
        return this.textOperation.apply(str);
    }

    combine(textOp: TextOperationAdapter): void {
        this.textOperation = TextOperationAdapter.mergeTextOperations(this.textOperation, textOp.textOperation);
    }

    static combine(op1: TextOperationAdapter, op2: TextOperationAdapter): TextOperationAdapter {
        const textOperationAdapter = new TextOperationAdapter();

        textOperationAdapter.textOperation = TextOperationAdapter.mergeTextOperations(op1.textOperation, op2.textOperation);

        return textOperationAdapter;
    }

    static mergeTextOperations(textOp1: TextOperation, textOp2: TextOperation): TextOperation {
        const transform = TextOperation.transform(textOp1, textOp2);

        return textOp1.compose(transform[1]);
    }
}
