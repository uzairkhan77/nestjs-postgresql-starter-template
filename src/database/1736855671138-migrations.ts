import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1736855671138 implements MigrationInterface {
    name = 'Migrations1736855671138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_service_map" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL DEFAULT 'active', "activated_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "service_id" uuid, CONSTRAINT "PK_de21c69c27fe563ef90beb927ad" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "user_service_payment_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_82cba020ad1d04cf268a3c5a092" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD CONSTRAINT "FK_0fe28af354446de4db1ad7324b0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_service_map" ADD CONSTRAINT "FK_19bee01071504feede70ca1c6d4" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP CONSTRAINT "FK_19bee01071504feede70ca1c6d4"`)
        await queryRunner.query(`ALTER TABLE "user_service_map" DROP CONSTRAINT "FK_0fe28af354446de4db1ad7324b0"`)
        await queryRunner.query(`DROP TABLE "user_service_payment_history"`)
        await queryRunner.query(`DROP TABLE "user_service_map"`)
    }
}
