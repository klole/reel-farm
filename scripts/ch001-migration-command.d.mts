export type MigrationSqlCommandOptions = {
  database: string;
  user: string;
  password?: string;
  sql: string;
  verboseErrors?: boolean;
};

export type MigrationSqlCommandExecutor<T> = (name: string, args: string[]) => Promise<T>;

export declare function buildMigrationSqlArgs(options: MigrationSqlCommandOptions): string[];
export declare function createMigrationSqlAdapter<T>(execute: MigrationSqlCommandExecutor<T>): (
  name: string,
  sql: string,
  database: string,
  user?: string,
  password?: string,
  verboseErrors?: boolean
) => Promise<T>;
