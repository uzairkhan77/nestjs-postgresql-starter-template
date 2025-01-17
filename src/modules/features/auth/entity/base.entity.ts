import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt: Date

    @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
    public deletedAt: Date
}
