import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1736783728246 implements MigrationInterface {
    name = 'Migrations1736783728246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deactivated_at" TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "user" ADD "deactivated_by_user_id" uuid`)
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name")`)
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_16aafd49a1ef3fcc0a05c1520b9" FOREIGN KEY ("deactivated_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_16aafd49a1ef3fcc0a05c1520b9"`)
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deactivated_by_user_id"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deactivated_at"`)
    }
}
