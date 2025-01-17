import { Column, Entity, OneToMany } from 'typeorm'
import { AbstractEntity } from './base.entity'
import { User } from './user.entity'

@Entity('organization_role')
export class OrganizationRole extends AbstractEntity {
    @Column({ name: 'name', unique: true })
    name: string

    @Column({ name: 'logo' })
    logo: string

    /**
     * Relations
     */
    @OneToMany(() => User, user => user.organizationRole)
    user: User
}
