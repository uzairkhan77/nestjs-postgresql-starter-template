import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1736931058689 implements MigrationInterface {
    name = 'Migrations1736931058689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "status"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" ADD "is_activated" boolean NOT NULL DEFAULT false`)
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD "admin_marked_as_completed" boolean NOT NULL DEFAULT false`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD "admin_marked_as_completed_at" TIMESTAMP WITH TIME ZONE NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD "marked_as_completed_response" boolean NOT NULL DEFAULT false`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD "marked_as_completed_response_at" TIMESTAMP WITH TIME ZONE`,
        )
        await queryRunner.query(`ALTER TABLE "user_service_map" ADD "marked_as_completed_by_admin_id" uuid`)
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD CONSTRAINT "FK_6ecb7ddac003deb8e2c20560637" FOREIGN KEY ("marked_as_completed_by_admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP CONSTRAINT "FK_6ecb7ddac003deb8e2c20560637"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "marked_as_completed_by_admin_id"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "marked_as_completed_response_at"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "marked_as_completed_response"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "admin_marked_as_completed_at"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "admin_marked_as_completed"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP COLUMN "is_activated"`)
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD "status" character varying NOT NULL DEFAULT 'active'`,
        )
    }
}
