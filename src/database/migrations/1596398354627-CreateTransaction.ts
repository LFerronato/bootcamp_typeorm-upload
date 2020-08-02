import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class CreateTransaction1596398354627
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Transactions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
            enum: ['income', 'outcome'],
          },
          {
            name: 'value',
            type: 'decimal',
          },
          {
            name: 'category_id',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['category_id'],
            referencedTableName: 'Category',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Transactions')
  }
}
