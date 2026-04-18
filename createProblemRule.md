# Problem Creation Rules

Use these rules for every new problem that should run on the batched judging model.

## Contract

1. `Run` and `Submit` each make one JDoodle execution.
2. The backend sends all testcase inputs in one batched stdin payload.
3. User code must read multiple testcases from stdin, solve each testcase independently, and print one marked output block per testcase.
4. The backend parses those output blocks and compares them against expected outputs in order.

## Input Format

The stdin contract is length-prefixed:

1. First line: total testcase count `T`
2. For each testcase:
3. One line with the testcase line count `L`
4. Next `L` lines: the raw testcase input

Example for three testcases:

```text
3
1
2
1
3
2
1 2 3
4 5 6
```

## Output Format

Each testcase output must be wrapped exactly like this:

```text
__ALGOPREP_CASE_START__
<case output>
__ALGOPREP_CASE_END__
```

Multiple testcase outputs are concatenated in order.

## Authoring Rules

1. Write solution templates around a `solveCase(rawInput)` function or equivalent.
2. Parse one testcase only inside `solveCase`; batching belongs in the wrapper.
3. Keep testcase input self-contained. Do not rely on shared state across cases.
4. Make outputs deterministic.
5. If the answer is a list or matrix, serialize it in a canonical order.
6. If the problem can have multiline input, preserve that structure inside the raw testcase string.
7. Reference solutions must use the same batched wrapper as starter code.
8. Sample examples shown in the UI should match the same raw testcase format users are expected to parse.

## Recommended Pattern

1. Parse batched stdin into `string[] testcases`
2. For each testcase:
3. Convert raw input into typed data
4. Compute the answer
5. Convert the answer to a canonical string
6. Emit the marked output block

## Validation Checklist

Before publishing a problem, verify:

1. The reference solution passes all hidden testcases through the batched wrapper.
2. The sample inputs are valid raw testcase payloads.
3. The expected outputs use the exact serialized format the reference solution prints.
4. Duplicate-order-sensitive outputs such as combinations, triplets, or intervals are normalized before serialization.
5. The starter code keeps the batched wrapper intact and leaves only the problem logic unfinished.
