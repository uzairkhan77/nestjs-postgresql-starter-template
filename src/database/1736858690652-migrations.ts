import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1736858690652 implements MigrationInterface {
    name = 'Migrations1736858690652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" RENAME COLUMN "form_date" TO "form_data"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" RENAME COLUMN "form_data" TO "form_date"`)
    }
}
