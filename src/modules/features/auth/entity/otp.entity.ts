import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractEntity } from './base.entity'
// import { User } from './user.entity';
import { OtpPurpose } from 'src/types/enums/user.enum'
import { User } from './user.entity'

@Entity('otp')
export class Otp extends AbstractEntity {
    @Column({ name: 'value' })
    value: number

    @Column({ name: 'purpose', type: 'enum', enum: OtpPurpose })
    purpose: OtpPurpose

    @Column({ name: 'used_at', nullable: true, type: 'timestamptz' })
    usedAt: Date | null

    @Column({ name: 'expires_at', nullable: true, type: 'timestamptz' })
    expiresAt: Date | null

    // Relations
    @ManyToOne(() => User, user => user.otps)
    @JoinColumn({ name: 'user_id' })
    user: User
}
