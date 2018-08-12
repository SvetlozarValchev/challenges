import * as assert from 'assert';
import TextOperationAdapter from "./text-operation-adapter";

describe('TextOperationAdapter', function () {
    let op1, op2;

    describe('Core', function () {
        it('should create instances', function() {
            op1 = new TextOperationAdapter([{move: 1}, {insert: "FOO"}, {move: 6}]);
            op2 = new TextOperationAdapter([{move: 3}, {insert: "BAR"}, {move: 4}]);

            assert(op1 instanceof TextOperationAdapter);
            assert(op2 instanceof TextOperationAdapter);
        });
    });

    describe('Transformation Operations', function () {
        it('should apply operations on a string', function () {
            assert.equal(op1.apply('abcdefg'), 'aFOObcdefg');
        });

        it('should apply operations on a string #2', function () {
            assert.equal(op2.apply('abcdefg'), 'abcBARdefg');
        });

        it('should allow many operations on a string', function () {
            const textOp = new TextOperationAdapter([
                {move: 4},
                {delete: 5},
                {insert: 'slow'},
                {move: 7},
                {delete: 3},
                {insert: 'bear'},
                {move:21},
                {delete: 3},
                {insert: 'cow'}
            ]);

            assert.equal(textOp.apply('The quick brown fox jumps over the lazy dog'), 'The slow brown bear jumps over the lazy cow');
        });
    });

    describe('Operation Combination', function () {
        it('prototype.combine() should create a combined TextOperationAdapter instance', function () {
            const combined = TextOperationAdapter.combine(op1, op2);

            assert.equal(combined.apply('abcdefg'), 'aFOObcBARdefg')
        });

        it('combine() should combine with another TextOperationAdapter instance', function () {
            const textOp1 = new TextOperationAdapter([{move: 1}, {insert: "BAZ"}, {move: 6}]);
            const textOp2 = new TextOperationAdapter([{move: 3}, {insert: "JAZ"}, {move: 4}]);

            textOp1.combine(textOp2);

            assert.equal(textOp1.apply('abcdefg'), 'aBAZbcJAZdefg');
        });

        it('operation order should not affect result', function () {
            const combined1 = TextOperationAdapter.combine(op1, op2);
            const combined2 = TextOperationAdapter.combine(op2, op1);

            assert.equal(combined2.apply('abcdefg'), combined1.apply('abcdefg'));
        });

        it('should work with complex operations', function () {
            const textOp1 = new TextOperationAdapter([
                {move: 4},
                {delete: 5},
                {insert: 'slow'},
                {move: 7},
                {delete: 3},
                {insert: 'bear'},
                {move:21},
                {delete: 3},
                {insert: 'cow'}
            ]);
            const textOp2 = new TextOperationAdapter([
                {move: 10},
                {delete: 5},
                {insert: 'black'},
                {move: 5},
                {delete: 5},
                {insert: 'runs'},
                {move: 10},
                {delete: 4},
                {insert: 'funny'},
                {move: 4}
            ]);

            const combined = TextOperationAdapter.combine(textOp1, textOp2);

            assert.equal(combined.apply('The quick brown fox jumps over the lazy dog'), 'The slow black bear runs over the funny cow');
        });
    });
});
