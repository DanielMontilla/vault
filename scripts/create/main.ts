import { input, select } from "@inquirer/prompts";
import * as Path from "@std/path";
import Chalk from "chalk";
import {
  Cache,
  Chunk,
  Duration,
  Effect,
  Schedule,
  Schema,
  Stream,
} from "effect";
import { ParseError } from "effect/ParseResult";
import * as YAML from "yaml";

const dirname = Path.dirname(Path.fromFileUrl(import.meta.url));
const templatesDir = Path.resolve(dirname, "templates");
const problemsDir = Path.resolve(dirname, "..", "..", "problems");

const printError = (msg: string) =>
  Effect.sync(() => {
    console.error(Chalk.red(msg));
    console.log("");
  });

const printParseError = ({ message }: ParseError) => printError(message);

const MetaSchema = Schema.Struct({
  language: Schema.String,
  instructions: Schema.String,
});

const clearConsole = Effect.sync(() => console.clear());

export type Meta = Schema.Schema.Type<typeof MetaSchema>;
export type Template = { name: string; meta: Meta };

const entriesSchema = Cache.make({
  capacity: Number.MAX_SAFE_INTEGER,
  timeToLive: Duration.infinity,
  lookup: (_: void) =>
    Stream.fromAsyncIterable(Deno.readDir(templatesDir), e => e).pipe(
      Stream.tapError(() => printError(`Failed to read template directory`)),
      Stream.orDie,
      Stream.filter(entry => entry.isDirectory),
      Stream.flatMap(entry =>
        Effect.gen(function* () {
          const meta = yield* Effect.tryPromise({
            try: () =>
              Deno.readTextFile(
                Path.join(templatesDir, entry.name, "meta.yml")
              ),
            catch: () => ({ _tag: "PathError" as const }),
          }).pipe(
            Effect.tryMap({
              try: YAML.parse,
              catch: () => ({ _tag: "YAMLError" as const }),
            }),

            Effect.andThen(Schema.decodeUnknown(MetaSchema)),
            Effect.tapErrorTag("PathError", () =>
              printError(
                `Failed to locate meta.yml in template directory: ${entry.name}`
              )
            ),
            Effect.tapErrorTag("YAMLError", () =>
              printError(
                `Failed to parse meta.yml in template directory: ${entry.name}`
              )
            ),
            Effect.tapErrorTag("ParseError", () =>
              printError(
                `Failed to decode meta.yml file in template directory: ${entry.name}`
              )
            ),

            Effect.orDie
          );

          return { name: entry.name, meta } satisfies Template;
        })
      ),
      Stream.runCollect,
      Effect.map(Chunk.toArray)
    ),
});

const getEntries = entriesSchema.pipe(
  Effect.andThen(
    Effect.fn(function* (cache) {
      return yield* cache.get();
    })
  )
);

const NameSchema = Schema.String.pipe(
  Schema.nonEmptyString({
    message: () => ({
      message: "Can't be empty. Try Again.",
      override: true,
    }),
  }),
  Schema.pattern(/^[a-zA-Z0-9\s]+$/, {
    message: () => ({
      message: `Only alphanumeric characters and spaces are allowed. Try Again.`,
      override: true,
    }),
  })
);

const TemplateNameSchema = Effect.gen(function* () {
  const templates = yield* getEntries;

  return Schema.Literal(...templates.map(({ name }) => name)).annotations({
    message: ({ actual }) => ({
      message: `Language "${actual}" not available. Choose another.`,
      override: true,
    }),
  });
});

const ReferenceSchema = Schema.transform(
  Schema.String,
  Schema.Array(Schema.String),
  {
    decode: str => (str === "" ? [] : str.split(",")),
    encode: strs => strs.join(","),
  }
);

const DescriptionSchema = Schema.transform(
  Schema.String.pipe(Schema.maxLength(2 ** 12)),
  Schema.Union(Schema.String, Schema.Undefined),
  {
    encode: maybeString => maybeString ?? "",
    decode: str => (str === "" ? undefined : str),
  }
);

const program = Effect.gen(function* () {
  yield* clearConsole;

  const entries = yield* getEntries;

  const problemName = yield* Effect.promise(() =>
    input({ message: "Problem name:" })
  ).pipe(
    Effect.andThen(Schema.decodeUnknown(NameSchema)),
    Effect.tapErrorTag("ParseError", printParseError),
    Effect.tap(clearConsole),
    Effect.retry(Schedule.forever)
  );

  const problemMachineName = yield* Effect.succeed(problemName).pipe(
    Effect.map(name => name.replaceAll(" ", "_")),
    Effect.map(name => name.toLowerCase())
  );

  const authorName = yield* Effect.promise(() =>
    input({ message: "Author:", default: "Daniel Montilla" })
  ).pipe(
    Effect.andThen(Schema.decodeUnknown(NameSchema)),
    Effect.tapErrorTag("ParseError", printParseError),
    Effect.tap(clearConsole),
    Effect.retry(Schedule.forever)
  );

  const template = yield* Effect.promise(() =>
    select({
      message: "Select preferred language:",
      choices: entries.map(({ name }) => name),
    })
  ).pipe(
    Effect.andThen(Schema.decodeUnknown(yield* TemplateNameSchema)),
    Effect.tapErrorTag("ParseError", printParseError),
    Effect.tap(clearConsole),
    Effect.retry(Schedule.forever),
    Effect.flatMap(
      Effect.fn(function* (name) {
        return entries.find(template => template.name === name)!;
      })
    )
  );

  const description = yield* Effect.promise(() =>
    input({ message: "Add a problem description:" })
  ).pipe(
    Effect.andThen(Schema.decodeUnknown(DescriptionSchema)),
    Effect.tapErrorTag("ParseError", error =>
      Effect.all([clearConsole, printParseError(error)])
    ),
    Effect.tap(clearConsole),
    Effect.retry(Schedule.forever)
  );

  const references = yield* Effect.promise(() =>
    input({
      message: 'Add some references to this problem (comma "," separated):',
    })
  ).pipe(
    Effect.andThen(Schema.decodeUnknown(ReferenceSchema)),
    Effect.tapErrorTag("ParseError", printParseError),
    Effect.tap(clearConsole),
    Effect.retry(Schedule.forever)
  );

  yield* Effect.gen(function* () {
    const destination = Path.join(
      problemsDir,
      problemMachineName,
      template.name
    );
    const original = Path.join(templatesDir, template.name);

    yield* Effect.tryPromise(() =>
      Deno.stat(destination)
        .then(() => true)
        .catch(() => false)
    ).pipe(
      Effect.andThen(
        Effect.fn(function* (exists) {
          if (exists) {
            const msg = `Destination directory already exists: ${destination}`;
            yield* printError(msg);
            yield* Effect.die(msg);
          }
        })
      )
    );

    yield* Effect.tryPromise(() =>
      Deno.mkdir(destination, { recursive: true })
    );

    yield* Stream.fromAsyncIterable(Deno.readDir(original), e => e).pipe(
      Stream.tapError(() => printError(`Failed to read template directory`)),
      Stream.orDie,
      Stream.filter(entry => entry.isFile),
      Stream.filter(entry => entry.name !== "meta.yml"),
      Stream.runCollect,
      Effect.map(Chunk.toArray),
      Effect.andThen(
        Effect.forEach(entry =>
          Effect.tryPromise({
            try: () => Deno.readTextFile(Path.join(original, entry.name)),
            catch: () => ({ _tag: "ReadFileError" as const }),
          }).pipe(
            Effect.map(file =>
              file.replaceAll("{{problem_name}}", problemMachineName)
            ),
            Effect.map(file => new TextEncoder().encode(file)),
            Effect.tryMapPromise({
              try: content =>
                Deno.writeFile(Path.join(destination, entry.name), content, {
                  create: true,
                }),
              catch: () => ({ _tag: "WriteFileError" as const }),
            }),
            Effect.tapErrorTag("ReadFileError", () =>
              printError("Failed to read file")
            ),
            Effect.tapErrorTag("WriteFileError", () =>
              printError("Failed to write file")
            ),
            Effect.orDie
          )
        )
      )
    );

    // New line
    const nl =
      (times: number = 1) =>
      <E, R>(self: Effect.Effect<string, E, R>): Effect.Effect<string, E, R> =>
        Effect.map(self, contents => contents + "\n".repeat(times));

    // Append
    const ap =
      (str: string) =>
      <E, R>(self: Effect.Effect<string, E, R>): Effect.Effect<string, E, R> =>
        Effect.map(self, contents => contents + str);

    yield* Effect.succeed("").pipe(
      ap(`# ${problemName}`),
      nl(),
      ap(`## Solved by ${authorName} using ${template.meta.language}`),
      nl(2),
      ap(`# Problem`),
      nl(),
      ap(description ?? `Missing description!`),
      nl(2),
      ap(`# References`),
      nl(),
      ap(references.join("\n")),
      nl(2),
      ap(`# Setup`),
      ap(template.meta.instructions),
      Effect.map(contents => new TextEncoder().encode(contents)),
      Effect.tryMapPromise({
        try: contents =>
          Deno.writeFile(Path.join(destination, "README.md"), contents),
        catch: () => ({ _tag: "FailedReadmeWrite" as const }),
      }),
      Effect.tapErrorTag("FailedReadmeWrite", () =>
        printError("Failed to write readme")
      ),
      Effect.orDie
    );

    console.clear();
    console.log("");
    console.log(
      Chalk.green(`Successfully created template for "${problemName}" 🎉`)
    );
    console.log("");
    console.log(Chalk.blue("Next steps:"));
    console.log(
      Chalk.cyan(
        "\t"
          + `0. cd ${Path.resolve(Path.join(problemsDir, problemMachineName))}`
      )
    );
    console.log("\t", Chalk.cyan(`${template.meta.instructions}`));

    Deno.exit();
  });
});

if (import.meta.main) {
  Effect.runPromise(program);
}
