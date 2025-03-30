const verboseHeader = `
1:11:11 AM - Projects in this build:
    * tsconfig.json

1:11:11 AM - Project 'tsconfig.json' is out of date because buildinfo file 'tsconfig.tsbuildinfo' indicates that program needs to report errors.

1:11:11 AM - Building project 'project/tsconfig.json'...`.trimStart();

const verboseFooter = `
Projects in scope:                         1
Projects built:                            1
Aggregate Files:                         111
Aggregate Lines of Library:            11111
Aggregate Lines of Definitions:        11111
Aggregate Lines of TypeScript:          1111
Aggregate Lines of JavaScript:             1
Aggregate Lines of JSON:                 111
Aggregate Lines of Other:                  1
Aggregate Identifiers:                 11111
Aggregate Symbols:                     11111
Aggregate Types:                        1111
Aggregate Instantiations:               1111
Aggregate Memory used:               111111K
Aggregate Assignability cache size:     1111
Aggregate Identity cache size:            11
Aggregate Subtype cache size:             11
Aggregate Strict subtype cache size:      11
Aggregate I/O Read time:               0.11s
Aggregate Parse time:                  0.11s
Aggregate ResolveModule time:          0.11s
Aggregate ResolveTypeReference time:   0.11s
Aggregate ResolveLibrary time:         0.11s
Aggregate Program time:                0.11s
Aggregate Bind time:                   0.11s
Aggregate Check time:                  0.11s
Aggregate I/O Write time:              0.11s
Aggregate printTime time:              0.11s
Aggregate Emit time:                   0.11s
Config file parsing time:              0.11s
Up-to-date check time:                 0.11s
Build time:                            1.11s`.trimStart();

const extendedDiagnostics = `
Files:                        111 
Lines of Library:           11111 
Lines of Definitions:       11111 
Lines of TypeScript:         1111 
Lines of JavaScript:           11 
Lines of JSON:                 11 
Lines of Other:                11 
Identifiers:                11111 
Symbols:                    11111 
Types:                       1111 
Instantiations:              1111 
Memory used:               11111K 
Assignability cache size:     111 
Identity cache size:           11 
Subtype cache size:            11 
Strict subtype cache size:     11 
I/O Read time:              0.11s 
Parse time:                 0.11s 
ResolveModule time:         0.11s 
ResolveTypeReference time:  0.11s 
ResolveLibrary time:        0.11s 
Program time:               0.11s 
Bind time:                  0.11s 
Check time:                 0.11s 
printTime time:             0.11s 
Emit time:                  0.11s 
Total time:                 0.11s`.trimStart();

const PRETTY = `${verboseHeader}

error TS1000: Unexpected error.

index.ts(1,1): error TS1000: Unexpected error.

1  const unexpected_error = unexpected_error;
                            ~~~~~~~~~~~~~~~~

index.ts(1,1): error TS1000: Unexpected error.
  Sub error.
    Grand sub error.

1    const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~

index.ts(1,1): error Unexpected error.

1      const unexpected_error = unexpected_error;
                                ~~~~~~~~~~~~~~~~

index.ts(1,1): Unexpected error.

1        const unexpected_error = unexpected_error;
                                  ~~~~~~~~~~~~~~~~

error TS1000 - Unexpected error.

index2.ts:1:1 - error TS1000: Unexpected error.

1  const unexpected_error = unexpected_error;
                            ~~~~~~~~~~~~~~~~

index2.ts:1:1 - error TS1000: Unexpected error.
  Sub error.
    Grand sub error.

1    const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~

index2.ts:1:1 - error Unexpected error.

1      const unexpected_error = unexpected_error;
                                ~~~~~~~~~~~~~~~~

index2.ts:1:1 - Unexpected error.

1        const unexpected_error = unexpected_error;
                                  ~~~~~~~~~~~~~~~~

${extendedDiagnostics}

Found 10 errors.

${verboseFooter}`;

const NOT_PRETTY = `${verboseHeader}

error TS1000: Unexpected error.
index.ts(1,1): error TS1000: Unexpected error.
index.ts(1,1): error TS1000: Unexpected error.
  Sub error.
    Grand sub error.
index.ts(1,1): error Unexpected error.
index.ts(1,1): Unexpected error.
error TS1000 - Unexpected error.
index2.ts:1:1 - error TS1000: Unexpected error.
index2.ts:1:1 - error TS1000: Unexpected error.
  Sub error.
    Grand sub error.
index2.ts:1:1 - error Unexpected error.
index2.ts:1:1 - Unexpected error.
${extendedDiagnostics}
${verboseFooter}`;

export default { PRETTY, NOT_PRETTY };
